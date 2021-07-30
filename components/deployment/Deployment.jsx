import { useEffect, useState } from "react"
import { PencilAltIcon } from "@heroicons/react/outline"

import useModules from "hooks/useModules"
import useBatchPersonae from "hooks/useBatchPersonae"
import useBatchGroups from "hooks/useBatchGroups"
import { createGroups, createSchedules } from "lib/grouping"
import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import { generatePOSTData } from "lib/utils"

import PageLoading from "components/project/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import BatchNotReady from "./BatchNotReady"
import TestsInfo from "./TestsInfo"
import Schedule from "./Schedule"
import Groups from "./Groups"
import FixedOverlay from "components/FixedOverlay"

const Deployment = ({ user, project, batch }) => {
  const isAdmin = user.username == project.admin.username
  const { groups: remoteGroups, isError: groupsError, isLoading: groupsLoading, mutate: mutateGroups } = useBatchGroups(batch._id)
  const { personae, isLoading: personsLoading, isError: personsError, mutate: mutatePeronae } = useBatchPersonae(batch._id, 'fullname,group')
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()

  const [mode, setMode] = useState("reading")

  const [names, setNames] = useState({})
  const [newNames, setNewNames] = useState([])
  const [missingNames, setMissingNames] = useState([])
  const [localGroups, setLocalGroups] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (remoteGroups && personae && personae.length > 0) {
      const _groups = createGroups(personae)
      setLocalGroups(createSchedules(batch._id, _groups))

      // Populate names key-val
      const namesKV = {}
      personae.forEach(({ _id, fullname }) => {
        namesKV[_id] = fullname
      })
      setNames(namesKV)

      // Find deleted names
      let found = []
      let missing = []
      remoteGroups.forEach(g => {
        g.persons.forEach(id => {
          if (!namesKV[id]) missing.push(id)
          else found.push(id)
        })
      })
      setMissingNames(missing)

      // Find new names
      let _newNames = []
      personae.forEach(({ _id }) => {
        if (!found.includes(_id)) _newNames.push(_id)
      })
      setNewNames(_newNames)
    }
  }, [remoteGroups, personae])
  
  useEffect(() => {
    if (batch && modules) {
      const _tests = [], _sims = []
      modules.forEach(m => {
        if (batch.modules.includes(m._id)) {
          if (m.method == 'selftest') _tests.push(m)
          else _sims.push(m)
        }
      })
    }

  }, [batch, modules])

  async function saveGroupSchedules(e) {
    setSubmitting(true)

    // Tentative: using default slots
    const slots = ['08.00', '10.00', '13.00', '15.00']
    const resp = await fetchJson(
      APIROUTES.POST.SAVE_GROUP_SCHEDULES, 
      generatePOSTData({
        bid: batch._id,
        slots: slots,
        groups: localGroups, // with fake ids
      })
    )
    console.log(resp)
    mutateGroups()
    setSubmitting(false)
  }

  if (modulesLoading || groupsLoading || personsLoading) {
    return <PageLoading 
      project={project} 
      batch={batch} 
      title="Deployment" 
    />
  }

  // Not ready
  if (batch.personae == 0 || batch.modules.length == 0) {
    return <BatchNotReady 
      project={project}
      batch={batch}
      isAdmin={isAdmin}
    />
  }

  return <>
    <Hero project={project} title="Deployment" batch={batch} />

    {/* <pre>
      NEW: {JSON.stringify(newNames, null)}<br/>
      MISSING: {JSON.stringify(missingNames, null)}<br/>
    </pre> */}

    {/* <Subhead title="Tes Mandiri (Online)">
      <div className="pr-2">
      {isAdmin && batch.tests.length > 0 && mode == "reading" && (
        <button 
        className="group text-green-500 hover:text-green-600 flex items-center space-x-1 h--7"
        onClick={e => {
          if (mode == "editing") setMode("reading")
          else setMode("editing")
        }}
      >
        <PencilAltIcon className="w-5 h-5" /> 
        <span className="">Edit</span>
      </button>
      )}
      </div>
    </Subhead>

    { batch.tests.length == 0
      ? <p>Batch ini tidak memiliki modul test mandiri.</p>
      : <>
        <hr className="h-2 border-none" />
        <TestsInfo batch={batch} mode={mode} setMode={setMode} isAdmin={isAdmin} />
      </>
    } */}
    <TestsInfo batch={batch} isAdmin={isAdmin} />

    <hr className="h-8 border-none" />

    { batch.sims.length == 0
      ? <>
        <Subhead title="Grouping & Skedul Pelaksanaan"></Subhead>
        <p>Batch ini tidak memerlukan grouping dan penjadwalan.</p>
      </>
      : <>
        <div className="overflow-x-scroll">
          <Schedule 
            localGroups={localGroups} 
            remoteGroups={remoteGroups} 
            names={names} 
            newNames={newNames}
            missingNames={missingNames}
            isAdmin={isAdmin}
            saveGroupSchedules={saveGroupSchedules}
          />
        </div>

        <hr className="h-8 border-none" />

        <Groups 
          localGroups={localGroups} 
          remoteGroups={remoteGroups}
          names={names} 
          newNames={newNames}
          missingNames={missingNames}
          isAdmin={isAdmin} 
          setLocalGroups={setLocalGroups}
          saveGroupSchedules={saveGroupSchedules}
        />
      </>
    }

    <hr className="h-8 border-none" />

    {/* Deployment action */}
    <Subhead title="Deployment Status" />

    <hr className="mt-2 mb-2 border-yellow-500 border-opacity-50"/>

    {submitting && <FixedOverlay>
      <div className="w-2/5 rounded bg-white p-1 shadow-md">
        <div className="rounded-sm border p-2">
          <div className="progress border border-gray-400 h-2"></div>
        </div>
      </div>
    </FixedOverlay>}
  </>
}

export default Deployment
