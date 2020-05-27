import { Key } from "./key";

/* Parse a keyInfo property
  * Return jsx
  * Convert textual key references to <Key>s
  */
export const parseKeyInfo = (keyInfo) => {
  const keyRefRe = /\[\[(([l|r])-([f|t])-([0-9]{1,2})-([0-9]{1,2}))\]\]/g;
  var output = [];
  var match = null;
  var lastMatchEndIdx = 0;

  while (match = keyRefRe.exec(keyInfo)) {
    var [
      wholeMatch,   // e.g. [[l-t-1-3]]
      identifier,   // e.g. l-t-1-3, for the first key on the left side of the left finger cluster
      // side,         // e.g. l, for left side
      // cluster,      // e.g. t, for finger cluster
      // col,          // e.g. 1, for the key starting at grid col 1
      // row,          // e.g. 3, for the key starting at grid row 3
    ] = match;
    output.push(
      <span key={`pre-match-idx-${match.index}`}>
        {keyInfo.slice(lastMatchEndIdx, match.index)}
      </span>
    );
    output.push(
      <span key={`match-idx-${match.index}`} className={`key-info-connect-to key-info-${identifier} bg-green-300`}>
        {identifier}
      </span>
    );
    //var origLastMatchEndIdx = lastMatchEndIdx;
    lastMatchEndIdx = match.index + wholeMatch.length;
    //console.log(`Processing match. wholeMatch: ${wholeMatch}, identifier: ${identifier}, side: ${side}, cluster: ${cluster}, col: ${col}, row: ${row}, match.index: ${match.index}, origLastMatchEndIdx: ${origLastMatchEndIdx}, lastMatchEndIdx: ${lastMatchEndIdx}, wholeMatch.length: ${wholeMatch.length}`)
  }
  output.push(
    <span key="match-idx-final">
      {keyInfo.slice(lastMatchEndIdx, keyInfo.length)}
    </span>
  );
  //console.log(`All done. lastMatchEndIdx: ${lastMatchEndIdx}, keyInfo.length: ${keyInfo.length}`)

  return output;
}

/* An info card about a particular key
 */
export const KeyInfo = ({ keyData }) => {
  return (
    <>
      <Key
        keyData={keyData} standalone={true}
        extraClasses="inline"
      />
      <span className="p-5 font-mono">{keyData.legendText ? keyData.legendText : keyData.legend}</span>
      <div className="p-5">
        <p className="">{parseKeyInfo(keyData.info)}</p>
      </div>
    </>
  );
}
