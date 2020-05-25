import { Key } from "./key";

/* An info card about a particular key
 */
 export const KeyInfo = ({ keyData }) => {
  const {
    legend,
    legendText,
  } = keyData

  return (
    <>
      <Key
        keyData={keyData} standalone={true}
        extraClasses="inline"
      />
      <span className="p-5 font-mono">{keyData.legendText ? keyData.legendText : keyData.legend}</span>
      <div className="p-5">
        <p className="">{keyData.info}</p>
      </div>
    </>
  );
}
