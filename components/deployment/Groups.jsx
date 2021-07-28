import { useEffect, useState } from "react";

import Subhead from "components/project/Subhead"

export default function Groups({
  localGroups, 
  remoteGroups, 
  names, 
  newNames, 
  missingNames,
  isAdmin, 
  setLocalGroups, 
  saveGroupSchedules
}) 
{
  const [selections, setSelections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([])
  const [theGroups, setTheGroups] = useState(localGroups)
  const [showTimes, setShowTimes] = useState(true)
  const [swappingEnabled, setSwappingEnabled] = useState(false)
  const [groupingResolved, setGroupingResolved] = useState(true)
  const [warning, setWarning] = useState([])

  useEffect(() => {
    if (remoteGroups.length >= 1) {
      setTheGroups(remoteGroups)
    } else {
      setTheGroups(localGroups)
    }
  }, [localGroups, remoteGroups])

  useEffect(() => {
    if (newNames.length > 0 || missingNames.length > 0) setGroupingResolved(false)
  }, [newNames, missingNames])

  useEffect(() => {
    if (!swappingEnabled) {
      setSelectedIds([])
      setSelectedIds([])
    }
  }, [swappingEnabled])

  async function saveChanges(e) {
    await saveGroupSchedules(e)
    setGroupingResolved(true)
    setSelectedIds([])
    setSelections([])
    setWarning([])
  }

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

  function exchangeGroup() {
    if (selections.length !== 2) return

    let copy = theGroups
    let g1 = theGroups.filter(g => g._id == selections[0].gid)[0]
    let g2 = theGroups.filter(g => g._id == selections[1].gid)[0]

    console.log("g1", g1)
    console.log("g2", g2)

    let index1 = -1, index2 = -1 // group index

    for (let i = 0; i < copy.length; i ++) {
      if (copy[i]._id == selections[0].gid) index1 = i
      if (copy[i]._id == selections[1].gid) index2 = i
    }

    const p1Index = g1.persons.indexOf(selections[0].person) 
    const p2Index = g2.persons.indexOf(selections[1].person) 

    // change
    g1.persons[p1Index] = selections[1].person
    g2.persons[p2Index] = selections[0].person
    // 
    copy[index1] = g1
    copy[index2] = g2

    setTheGroups(copy)
    setSelections([])
    setLocalGroups(copy)
    // 
    if (!warning.includes("Komposisi anggota grup telah berubah.")) {
      setWarning(w => ([...w, "Komposisi anggota grup telah berubah."]))
    }
  }
  
  const cardStyle = remoteGroups.length > 0 
  ? "rounded-sm border border-green-500 border-opacity-50 px-2 py-2" 
  : "rounded-sm border border-gray-300 px-2 py-2"

  return <div id="batch-grouping">
    <Subhead title="Grouping">
      <label className={`w-auto flex items-center space-x-2 text-gray-${groupingResolved ? '600' : '400'} cursor-pointer`}>
        <input 
          type="checkbox"
          disabled={!groupingResolved}
          className={`rounded-sm text-green-500 focus:outline-none focus:ring-0
          disabled:border-gray-300`}
          onChange={e => setSwappingEnabled(e.target.checked)}
        />
        <span>Enable group swapping</span>
      </label>
    </Subhead>

    <hr className="mt-2 mb-2 border-yellow-500 border-opacity-50"/>

    {!groupingResolved && remoteGroups.length >= 1 && (
      <div className="border--t border-yellow-300 py--2 mb-2">
        <p className="mb-3">
          <span className="font-bold">PERHATIAN: </span> 
          <span className="text-red-500 ml-2">
            {getResolveWarning()}
          </span>
        </p>
        {isAdmin && <p>
          <button 
            className="project-button font-medium px-3 py-1"
            onClick={e => {
              setTheGroups(localGroups)
              setGroupingResolved(true)
              setWarning(["Regrouping & rescheduling berhasil."])
            }}
          >Regroup & Reschedule</button>
        </p>}
      </div>
    )}

    {warning.length > 0 && (
      <div className="border--t border-yellow-300 py--2 mb-2">
        <ul className="list-disc text-red-400 pl-4 mb-3">
          {warning.map(w => <li>{w}</li>)}
        </ul>
        <p>
          <button 
            className="project-button bg-green-400 hover:bg-green-500 text-white font-medium px-4 py-1"
            onClick={saveChanges}
          >Save Changes</button>
        </p>
      </div>
    )}
    
    <div className="hidden">
      <p className="rounded-sm border-green-500 border-opacity-50 px-3 py-2"></p>
      <p className="rounded-sm border-gray-300 px-2 py-2"></p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-3">
      {theGroups.map(group => (
        <div key={group.name} className={cardStyle}>
          <div className="font-bold mb-1 cursor-default select-none"
            onClick={e => setShowTimes(!showTimes)}
          >{group.name}</div>
          <div className={`${showTimes ? '' : 'hidden'} text-xs py-1 mb-2 border-t border-b`}>
            {group.slot1.toLowerCase() == "selftest" && <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      08.00<span className="hidden xs:inline">{``}-12.00</span>
                    </td>
                    <td className="px-3">
                      Selftest
                    </td>
                  </tr>
                  <tr>
                    <td>
                      13.00<span className="hidden xs:inline">{``}-14.30</span>
                    </td>
                    <td className="px-3">{group.slot3}</td>
                  </tr>
                  <tr>
                    <td>
                      15.00<span className="hidden xs:inline">{``}-16.30</span>
                    </td>
                    <td className="px-3">{group.slot4}</td>
                  </tr>
                </tbody>
              </table>
            </div>}
            {group.slot1.toLowerCase() != "selftest" && <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      08.00<span className="hidden xs:inline">{``}-09.30</span>
                    </td>
                    <td className="px-3">{group.slot1}</td>
                  </tr>
                  <tr>
                    <td>
                      10.00<span className="hidden xs:inline">{``}-11.30</span>
                    </td>
                    <td className="px-3">{group.slot2}</td>
                  </tr>
                  <tr>
                    <td>
                      15.00<span className="hidden xs:inline">{``}-17.00</span>
                    </td>
                    <td className="px-3">
                      Selftest
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>}
          </div>
          {group.persons.map(id => <button
            key={id}
            className={`w-full ${names[id] ? '' : 'text-red-500'}
            ${selectedIds.includes(id) ? 'bg-green-200' : 'bg-gray-50'}
            text-left text-xs truncate px-2 py-1 mb-1`}
            onDoubleClick={e => {
              if (selectedIds.includes(id)) exchangeGroup()
            }}
            onClick={e => {
              if (!swappingEnabled) return

              if (selections.length == 0) {
                setSelectedIds([]) // cleanup

                setSelections([{ gid: group._id, person: id, }])
                setSelectedIds([id])
              } else if (selections.length == 1) {
                if (selections[0].person == id) {
                  setSelectedIds([])
                  setSelections([])
                } else if (selections[0].gid == group._id) {
                  setSelections([{ gid: group._id, person: id, }])
                  setSelectedIds([id])
                } else {
                  setSelections([
                    selections[0],
                    { gid: group._id, person: id, }
                  ])
                  setSelectedIds([selectedIds[0], id])
                }
              } else if (selections.length == 2) {
                const s0 = selections[0]
                const s1 = selections[1]

                if (s0.person == id) {
                  setSelections([selections[1]])
                  setSelectedIds([selectedIds[1]])
                } else if (s1.person == id) {
                  setSelections([selections[0]])
                  setSelectedIds([selectedIds[0]])
                } else if (s0.gid == group._id) {
                  setSelections([
                    { gid: group._id, person: id, },
                    s1
                  ])
                  setSelectedIds([id, selectedIds[1]])
                } else if (s1.gid == group._id) {
                  setSelections([
                    s0,
                    { gid: group._id, person: id, },
                  ])
                  setSelectedIds([selectedIds[0], id])
                } else {
                  setSelections([
                    s0,
                    { gid: group._id, person: id, },
                  ])
                  setSelectedIds([selectedIds[0], id])
                }
              }
            }}
          >{names[id] || `- DELETED`}</button>)}
        </div>
      ))}
    </div>

    {remoteGroups.length == 0 && <div className="text-center my-8">
      <button
        className="button-project h-9 bg-green-500 text-white font-medium px-6"
        onClick={e => {
          saveGroupSchedules(e)
          setSelectedIds([])
          setSelections([])
          setGroupingResolved(true)
        }}
      >Confirm grouping & schedules</button>
    </div>}
  </div>
}