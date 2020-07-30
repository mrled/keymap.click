import log from "loglevel";

import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "../lib/keyConnections";
import { Key } from "./key";

/* Parse a keyInfo property
  * Return an array of JSX <span> elements.
    Each <span> element represents either regular text,
    or an indicator to a key on the board.
    (see docs/physical-key-indicators.md for more information on textual key indicators)
  */
export const parseKeyInfo = (keyInfo) => {
  if (!keyInfo) {
    return [<span>""</span>];
  }

  const keyRefRe = /\[\[(([l|r])-([f|t])-([0-9]{1,2})-([0-9]{1,2}))(\|(.+?))?\]\]/g;
  var output = [];
  var match = null;
  var lastMatchEndIdx = 0;

  while ((match = keyRefRe.exec(keyInfo))) {
    var [
      wholeMatch, //     e.g. [[l-t-1-3|some text]]
      identifier, //     e.g. l-t-1-3, for the first key on the left side of the left finger cluster
      side, //           e.g. l for left side or r for right side
      cluster, //        e.g. f for finger cluster or t for thumb cluster
      col, //            e.g. 1, for the key starting at grid col 1
      row, //            e.g. 3, for the key starting at grid row 3
      wholeContent, //   e.g. '|some text'
      content, //        e.g. 'some text'
    ] = match;
    if (!content) content = identifier;
    output.push(
      <span
        key={`pre-match-idx-${match.index}`}
        dangerouslySetInnerHTML={{
          __html: keyInfo.slice(lastMatchEndIdx, match.index),
        }}
      />
    );
    output.push(
      <span
        key={`match-idx-${match.index}`}
        className={`${keyInfoConnectFromClass} ${keyInfoConnectFromClassPrefix}${identifier} bg-green-200 truncate`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
    //var origLastMatchEndIdx = lastMatchEndIdx;
    lastMatchEndIdx = match.index + wholeMatch.length;
    //log.debug(`Processing match. wholeMatch: ${wholeMatch}, identifier: ${identifier}, side: ${side}, cluster: ${cluster}, col: ${col}, row: ${row}, match.index: ${match.index}, origLastMatchEndIdx: ${origLastMatchEndIdx}, lastMatchEndIdx: ${lastMatchEndIdx}, wholeMatch.length: ${wholeMatch.length}`)
  }
  output.push(
    <span
      key="match-idx-final"
      dangerouslySetInnerHTML={{
        __html: keyInfo.slice(lastMatchEndIdx, keyInfo.length),
      }}
    />
  );
  log.debug(
    `All done. lastMatchEndIdx: ${lastMatchEndIdx}, keyInfo.length: ${keyInfo.length}`
  );

  log.debug(typeof output);

  return output;
};

/* An info card about a particular key
 * keyData: A key object (e.g. from lib/keys.js)
 * parsedKeyInfo: JSX returned from parseKeyInfo()
 */
export const KeyInfoInner = ({ keyData, parsedKeyInfo }) => {
  return (
    <>
      <div className="py-5">
        <p className="">{parsedKeyInfo}</p>
      </div>
    </>
  );
};

/* Return a KeyInfoInner component, wrapped in a <KeyInfo> component
 * styled nicely for the parent <Keyboard> component
 */
export const KeyInfo = ({
  keyData,
  parsedKeyInfo,
  keyButtonOnClick = () => { },
}) => {
  return (
    <>
      <div className="border-b pb-2 mb-2">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl">Key information</h2>
            <button onClick={keyButtonOnClick} className="block text-blue-500">
              deselect key
            </button>
          </div>
          <div>
            <Key keyData={keyData} standalone={true} extraClasses="inline" />
            <span className="p-5 font-mono">{keyData.name}</span>
          </div>
        </div>
      </div>
      <KeyInfoInner keyData={keyData} parsedKeyInfo={parsedKeyInfo} />
    </>
  );
};
