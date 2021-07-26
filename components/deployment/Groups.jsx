import { useEffect, useState } from "react";

export default function Groups({ groups, remoteGroups, names, isAdmin, setSchedules }) {

  // const [names, setNames] = useState([]);
  const [selections, setSelections] = useState([]);
  const [theGroups, setTheGroups] = useState(groups)

  useEffect(() => {
    if (remoteGroups && remoteGroups.length > 0) {
      setTheGroups(remoteGroups)
    }
  }, [remoteGroups])

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

    // console.log("g1", g1)
    // console.log("g2", g2)

    // 
    copy[index1] = g1
    copy[index2] = g2


    setTheGroups(copy)
    setSelections([])
    setSchedules(copy)
  }
  
  // const theGroups = remoteGroups && remoteGroups.length > 0 ? remoteGroups : groups
  // const usingRemote = remoteGroups && remoteGroups.length > 0 ? true : false

  const cardStyle = remoteGroups && remoteGroups.length > 0 
  ? "rounded-sm border border-green-500 border-opacity-50 px-3 py-2" 
  : "rounded-sm border border-gray-300 px-3 py-2"

  if (!theGroups) return <>NOP</>

  return (
    <div className="">
      <pre>THE GROUPS: {theGroups.length}</pre>
      <div className="hidden">
        <p className="rounded-sm border-green-500 border-opacity-50 px-3 py-2"></p>
        <p className="rounded-sm border-gray-300 px-3 py-2"></p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {theGroups.map(group => (
          <div key={group.name} className={cardStyle}>
            <div className="font-bold mb-2">{group.name}</div>
            <div className="text-xs py-1 mb-2 border-t border-b">
              {group.slot1 == "selftest" && <div>
                <table>
                  <tbody>
                    <tr>
                      <td>08.00 - 12.00</td><td className="px-3">Online test</td>
                    </tr>
                    <tr>
                      <td>13.00 - 14.30</td><td className="px-3">{group.slot3}</td>
                    </tr>
                    <tr>
                      <td>15.00 - 16.30</td><td className="px-3">{group.slot4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>}
              {group.slot1 != "selftest" && <div>
                <table>
                  <tbody>
                    <tr>
                      <td>08.00 - 09.30</td><td className="px-3">{group.slot1}</td>
                    </tr>
                    <tr>
                      <td>10.00 - 11.30</td><td className="px-3">{group.slot2}</td>
                    </tr>
                    <tr>
                      <td>13.00 - 17.00</td><td className="px-3">Online test</td>
                    </tr>
                  </tbody>
                </table>
              </div>}
            </div>
            {group.persons.map(id => <button
              key={id}
              className={`${names[id] ? '' : 'text-red-500'}
              w-full bg-gray-50 text-left text-xs truncate px-2 py-1 mb-1`}
              onClick={e => {
                if (selections.length == 0) {
                  setSelections([{
                    gid: group._id,
                    person: id,
                  }])
                } else if (selections.length == 1) {
                  if (group.name !== selections[0].group) {
                    setSelections(p => ([...p, {
                      gid: group._id,
                      person: id,
                    }]))
                  }
                }

                console.log(selections)
              }}
            >{names[id] || `- DELETED`}</button>)}
            {/* <pre>{JSON.stringify(group.persons, null, 1)}</pre> */}
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(selections, null, 1)}</pre> */}
      
      <br/>
      {selections.length == 2 && <button
        className="project-button px-3 py-1"
        onClick={e => exchangeGroup()}
      >EXCHANGE GROUP</button>}
    </div>
  );
}