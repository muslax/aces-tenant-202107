import { useEffect, useState } from "react";

export default function Schedule({ groups, remoteGroups, names, isAdmin, saveGroupSchedules }) {
  const [theGroups, setTheGroups] = useState(groups)
  const [missingNames, setMissingNames] = useState([])
  const [missingGroupIds, setMissingGroupIds] = useState([])
  const [useRemote, setUseRemote] = useState(false)
  const [groupHasChanged, setGroupHasChanged] = useState(false)

  useEffect(() => {
    if (remoteGroups && remoteGroups.length > 0) {
      setTheGroups(remoteGroups)
      setUseRemote(true)

      // Find deleted names
      let array = []
      let gids = []
      remoteGroups.forEach(g => {
        g.persons.forEach(id => {
          if (!names[id]) {
            array.push(id)
            gids.push(g._id)
          }
        })
      })
      setMissingNames(array)
      setMissingGroupIds(gids)
    }
  }, [remoteGroups, names])

  async function saveChanges(e) {
    await saveGroupSchedules(e)
    setMissingNames([])
    setGroupHasChanged(false)
  }

  if (!theGroups || theGroups.length == 0) return <p className="text-red-500">EMPTY</p>;

  let headStyle = useRemote
  ? "bg-green-50 border-t border-green-500 border-opacity-30"
  : "bg-gray-50 border-t border-gray-300 border-opacity-50"

  // if (missingNames.length > 0) 
  // headStyle = "bg-red-50 border-t border-red-300 border-opacity-50"

  let headTdStyle = useRemote
  ? "border-l border-green-500 border-opacity-10 font-medium p-2"
  : "border-l border-gray-300 border-opacity-20 font-medium p-2"

  // if (missingNames.length > 0) 
  // headTdStyle = "border-l border-red-300 border-opacity-20 font-medium p-2"

  let tdStyle = useRemote
  ? "border-l border-green-500 border-opacity-20 px-2 py-1"
  : "border-l border-gray-300 border-opacity-50 px-2 py-1"

  // if (missingNames.length > 0) 
  // tdStyle = "border-l border-red-300 border-opacity-50 px-2 py-1"

  let trStyle = useRemote
  ? "border-b border-green-500 border-opacity-20"
  : "border-b border-gray-300 border-opacity-50"

  // if (missingNames.length > 0) 
  // trStyle = "border-b border-red-300 border-opacity-50"

  let boldLine = useRemote
  ? "h-1 bg-green-500 bg-opacity-60"
  : "h-1 bg-gray-400 bg-opacity-60"

  // if (missingNames.length > 0) 
  // boldLine = "h-1 bg-red-400 bg-opacity-30"

  return (
    <div className="">
      {!groupHasChanged && missingNames.length > 0 && (
        <div className="border-t border-yellow-300 pt-2 mb-4">
          <p className="mb-3">
            <span className="font-bold">PERHATIAN: </span> 
            <span className="text-red-500 ml-2">
            Terdapat {missingNames.length} nama yang telah terhapus.
            </span>
          </p>
          {isAdmin && <p>
            <button 
              className="project-button font-medium px-3 py-1"
              onClick={e => {
                setTheGroups(groups)
                setGroupHasChanged(true)
              }}
            >Regroup & Reschedule</button>
          </p>}
        </div>
      )}
      {groupHasChanged && (
        <div className="border-t border-yellow-300 py-2 mb-4">
          <p className="mb-3">
            {/* <span className="font-bold">PERHATIAN: </span>  */}
            <span className="text-gray-600 ml--2">
            Regrouping & rescheduling berhasil. Klik tombol di bawah untuk menyimpan perubahan.
            </span>
          </p>
          <p>
            <button 
              className="project-button bg-green-400 hover:bg-green-500 text-white font-medium px-4 py-1"
              onClick={saveChanges}
            >Save Changes</button>
          </p>
        </div>
      )}
      {/* Preload Tailwinds styles in order to be available conditionally */}
      <div className="hidden">
        <div className="bg-gray-50 border-b border-gray-300 border-opacity-50"></div>
        <div className="bg-green-50 border-b border-green-500 border-opacity-20"></div>
        <div className="bg-red-50 border-t border-gray-300 border-opacity-50"></div>
      </div>
      <table className="w-full text-xs">
        <tbody>
          <tr className={headStyle}>
            <td className="font-medium p-2">Group<span className="hidden xs:inline">{` `}x Slot</span></td>
            <td width="" className={headTdStyle}>08.00</td>
            <td width="" className={headTdStyle}>10.00</td>
            <td width="" className={headTdStyle}>13.00</td>
            <td width="" className={headTdStyle}>15.00</td>
          </tr>
          <tr>
            <td colSpan="5" className={boldLine}></td>
          </tr>
        </tbody>
        {theGroups.map((g, i) => (
        <tbody key={g.name}>
          {g.slot1.toLowerCase() == "selftest" && (
            <tr key={g.name} className={trStyle}>
              <td className={`${missingGroupIds.includes(g._id) ? 'text-red-500' : ''} font-medium px-2 py-2`}>
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className={`whitespace-nowrap ${missingGroupIds.includes(g._id) ? '' : 'text-gray-400'}`}>({g.persons.length} orang)</span>
              </td>
              <td colSpan="2" className={`${tdStyle} text-center`}><span className="hidden xs:inline">Online</span> Selftest</td>
              <td className={`${tdStyle} text-center`}>{g.slot3}</td>
              <td className={`${tdStyle} text-center`}>{g.slot4}</td>
            </tr>
          )}
          {g.slot1.toLowerCase() != "selftest" && (
            <tr key={g.name} className={trStyle}>
              <td className={`${missingGroupIds.includes(g._id) ? 'text-red-500' : ''} font-medium px-2 py-2`}>
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className={`whitespace-nowrap ${missingGroupIds.includes(g._id) ? '' : 'text-gray-400'}`}>({g.persons.length} orang)</span>
              </td>
              <td className={`${tdStyle} text-center`}>{g.slot1}</td>
              <td className={`${tdStyle} text-center`}>{g.slot2}</td>
              <td colSpan="2" className={`${tdStyle} text-center`}><span className="hidden xs:inline">Online</span> Selftest</td>
            </tr>
          )}
        </tbody>
          ))}
      </table>
    </div>
  )
}