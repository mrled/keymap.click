import log from "loglevel";

import {
  Key,
} from "./key";


/* Parse a keyInfo property
  * Return an array of JSX <span> elements.
    Each <span> element represents either regular text,
    or a reference to a key on the board.
  */
export const parseKeyInfo = (keyInfo) => {
  if (!keyInfo) {
    return [<span>""</span>];
  }

  const keyRefRe = /\[\[(([l|r])-([f|t])-([0-9]{1,2})-([0-9]{1,2}))\]\]/g;
  var output = [];
  var match = null;
  var lastMatchEndIdx = 0;

  while (match = keyRefRe.exec(keyInfo)) {
    var [
      wholeMatch,   // e.g. [[l-t-1-3]]
      identifier,   // e.g. l-t-1-3, for the first key on the left side of the left finger cluster
      // side,         // e.g. l for left side or r for right side
      // cluster,      // e.g. f for finger cluster or t for thumb cluster
      // col,          // e.g. 1, for the key starting at grid col 1
      // row,          // e.g. 3, for the key starting at grid row 3
    ] = match;
    output.push(
      <span key={`pre-match-idx-${match.index}`}>
        {keyInfo.slice(lastMatchEndIdx, match.index)}
      </span>
    );
    output.push(
      <span key={`match-idx-${match.index}`} className={`key-info-connect-from key-info-connect-from-${identifier}`}>
        {identifier}
      </span>
    );
    //var origLastMatchEndIdx = lastMatchEndIdx;
    lastMatchEndIdx = match.index + wholeMatch.length;
    //log.debug(`Processing match. wholeMatch: ${wholeMatch}, identifier: ${identifier}, side: ${side}, cluster: ${cluster}, col: ${col}, row: ${row}, match.index: ${match.index}, origLastMatchEndIdx: ${origLastMatchEndIdx}, lastMatchEndIdx: ${lastMatchEndIdx}, wholeMatch.length: ${wholeMatch.length}`)
  }
  output.push(
    <span key="match-idx-final">
      {keyInfo.slice(lastMatchEndIdx, keyInfo.length)}
    </span>
  );
  log.debug(`All done. lastMatchEndIdx: ${lastMatchEndIdx}, keyInfo.length: ${keyInfo.length}`)

  log.debug(typeof output)

  return output;
}

/* An info card about a particular key
 * keyData: A key object (e.g. from lib/keys.js)
 * parsedKeyInfo: JSX returned from parseKeyInfo()
 */
export const KeyInfoInner = ({ keyData, parsedKeyInfo }) => {
  return (
    <>
      <Key
        keyData={keyData} standalone={true}
        extraClasses="inline"
      />
      <span className="p-5 font-mono">{keyData.legendText ? keyData.legendText : keyData.legend}</span>
      <div className="p-5">
        <p className="">{parsedKeyInfo}</p>
      </div>
    </>
  );
}

/* Return a KeyInfoInner component, wrapped in a <KeyInfo> component
 * styled nicely for the parent <Keyboard> component
 */
export const KeyInfo = ({ keyData, parsedKeyInfo, keyButtonOnClick=()=>{} }) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center border-b md:border-none pb-2 mb-2 md:mb-none">
        <h2 className="text-2xl">Key information</h2>
        <button
          onClick={keyButtonOnClick}
          className="block md:hidden text-blue-500"
        >
          close
        </button>
      </div>
        {keyData.info ? (
          <KeyInfoInner keyData={keyData} parsedKeyInfo={parsedKeyInfo} />
        ) : (
          "Select a key"
        )}
    </>
  );
};
