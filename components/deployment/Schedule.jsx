import { useEffect, useState } from "react";

import Subhead from "components/project/Subhead";

export default function Schedule({ localGroups, remoteGroups, names, newNames, missingNames, isAdmin, saveGroupSchedules }) {
  const [theGroups, setTheGroups] = useState(localGroups)
  const [missingGroupIds, setMissingGroupIds] = useState([])
  const [useRemote, setUseRemote] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (remoteGroups && remoteGroups.length >= 1) {
      setTheGroups(remoteGroups)
      setUseRemote(true)

      // Detect which group has missing names
      let gids = []
      remoteGroups.forEach(g => {
        g.persons.forEach(id => {
          if (!names[id]) {
            gids.push(g._id)
          }
        })
      })
      setMissingGroupIds(gids)
    } else {
      setTheGroups(localGroups)
    }
  }, [localGroups, remoteGroups, names])

  useEffect(() => {
    if (newNames.length > 0 || missingNames.length > 0) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [newNames, missingNames])

  function getResolveWarning() {
    if (missingNames.length == 0 && newNames.length == 0) return false

    const m = missingNames.length == 0 ? '' 
    : <><span className="font-bold">{missingNames.length}</span> nama yang telah terhapus</>
    const f = newNames.length == 0 ? ''
    : <><span className="font-bold">{newNames.length}</span> nama baru (tambahan)</>

    if (missingNames.length > 0 && newNames.length > 0) {
      return (
        <span className="text-red-400">Terdapat {m} dan {f}.</span>
      ) 
    } else if (missingNames.length > 0) {
      return (
        <span className="text-red-400">Terdapat {m}.</span>
      ) 
    } else if (newNames.length > 0) {
      return (
        <span className="text-red-400">Terdapat {f}.</span>
      ) 
    }
  }

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
      <Subhead title="Skedul Pelaksanaan"></Subhead>
      <hr className="h-2 border-none" />

      {showWarning && (
        <div className="border-t border-yellow-300 pt-2 mb-4">
          <p className="mb-3">
            <span className="font-bold">PERHATIAN: </span> 
            <span className="text-red-500 ml-2">
              {getResolveWarning()}
            </span>
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
