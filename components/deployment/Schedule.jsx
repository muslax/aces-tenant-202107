export default function Schedule({ groups, remoteGroups, tentative = false }) {
  if (!groups || groups.length == 0) return <p className="text-red-500">EMPTY</p>;

  // const color = remoteGroups.length > 0 ? 'indigo' : 'red';
  const borderStyle = remoteGroups && remoteGroups.length > 0 
  ? "border-b border-gray-300 border-opacity-50"
  : "border-b border-green-500 border-opacity-20"
  
  const headStyle = remoteGroups && remoteGroups.length > 0 
  ? "bg-green-50 border-t border-green-500 border-opacity-30"
  : "bg-gray-50 border-t border-gray-300 border-opacity-50"

  const headTdStyle = remoteGroups && remoteGroups.length > 0 
  ? "border-l border-green-500 border-opacity-10 font-medium p-2"
  : "border-l border-gray-300 border-opacity-20 font-medium p-2"

  const tdStyle = remoteGroups && remoteGroups.length > 0 
  ? "border-l border-green-500 border-opacity-20 px-2 py-1"
  : "border-l border-gray-300 border-opacity-50 px-2 py-1"

  const trStyle = remoteGroups && remoteGroups.length > 0 
  ? "border-b border-green-500 border-opacity-20"
  : "border-b border-gray-300 border-opacity-50"

  return (
    <div className="">
      {/* Preload Tailwinds styles in order to be available conditionally */}
      <div className="hidden">
        <div className="bg-gray-50 border-b border-gray-300 border-opacity-50"></div>
        <div className="bg-green-50 border-b border-green-500 border-opacity-20"></div>
      </div>
      <table className="w-full text-xs">
        <tbody>
          <tr className={headStyle}>
            <td className="font-medium p-2">Group<span className="hidden xs:inline">{` `}x Slot</span></td>
            <td width="20%" className={headTdStyle}>08.00</td>
            <td width="20%" className={headTdStyle}>10.00</td>
            <td width="20%" className={headTdStyle}>13.00</td>
            <td width="20%" className={headTdStyle}>15.00</td>
          </tr>
          <tr>
            {remoteGroups && remoteGroups.length > 0 
              ? <td colSpan="5" className="h-1 bg-green-500 bg-opacity-60"></td>
              : <td colSpan="5" className="h-1 bg-gray-400 bg-opacity-60"></td>
            }
            {/* {remoteGroups && remoteGroups.length > 0 && <td colSpan="5" className="h-1 bg-green-500 bg-opacity-60"></td>} */}
            {/* {(!remoteGroups || remoteGroups.length == 0) && <td colSpan="5" className="h-1 bg-gray-400 bg-opacity-60"></td>} */}
          </tr>
        </tbody>
        {groups.map((g, i) => (
        <tbody key={g.name}>
          {g.slot1 == "online" && (
            <tr key={g.name} className={trStyle}>
              <td className="font-medium px-2 py-2">
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className="whitespace-nowrap text-gray-400">({g.persons.length} orang)</span>
              </td>
              <td colSpan="2" className={`${tdStyle} text-center`}>Tes online mandiri</td>
              <td className={tdStyle}>{g.slot3}</td>
              <td className={tdStyle}>{g.slot4}</td>
            </tr>
          )}
          {g.slot1 != "online" && (
            <tr key={g.name} className={trStyle}>
              <td className="font-medium px-2 py-2">
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className="whitespace-nowrap text-gray-400">({g.persons.length} orang)</span>
              </td>
              <td className={tdStyle}>{g.slot1}</td>
              <td className={tdStyle}>{g.slot2}</td>
              <td colSpan="2" className={`${tdStyle} text-center`}>Tes online mandiri</td>
            </tr>
          )}
        </tbody>
          ))}
      </table>
    </div>
  )
}