import { useEffect, useState } from "react"
import { PencilAltIcon } from "@heroicons/react/outline"

import useModules from "hooks/useModules"
import useBatchPersonae from "hooks/useBatchPersonae"
import { createGroups, createSchedules } from "lib/grouping"

import PageLoading from "components/project/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import BatchNotReady from "./BatchNotReady"
import TestsInfo from "./TestsInfo"
import Schedule from "./Schedule"
import Groups from "./Groups"
import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import { generatePOSTData } from "lib/utils"
import useBatchGroups from "hooks/useBatchGroups"
import FixedOverlay from "components/FixedOverlay"

const Deployment = ({ user, project, batch }) => {
  const isAdmin = user.username == project.admin.username
  const { groups: remoteGroups, isError: groupsError, isLoading: groupsLoading, mutate: mutateGroups } = useBatchGroups(batch._id)
  const { personae, isLoading: personsLoading, isError: personsError, mutate: mutatePeronae } = useBatchPersonae(batch._id, 'fullname,group')
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()

  const [tests, setTests] = useState([])
  const [sims, setSims] = useState([])
  const [mode, setMode] = useState("reading")

  const [groups, setGroups] = useState([])
  const [schedules, setSchedules] = useState([])
  const [names, setNames] = useState({})
  const [missingNames, setMissingNames] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [swappingEnabled, setSwappingEnabled] = useState(false)

  useEffect(() => {
    if (remoteGroups && personae) {
      const _groups = createGroups(personae)
      setGroups(_groups)
      setSchedules(createSchedules(batch._id, _groups))

      // Populate names key-val
      const namesKV = {}
      personae.forEach(({ _id, fullname }) => {
        namesKV[_id] = fullname
      })
      setNames(namesKV)

      // Find deleted names
      let array = []
      remoteGroups.forEach(g => {
        g.persons.forEach(id => {
          if (!namesKV[id]) array.push(id)
        })
      })
      setMissingNames(array)
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
  
      setTests(_tests)
      setSims(_sims)
    }

  }, [batch, modules])

  async function saveGroupSchedules(e) {
    setSubmitting(true)

    // Tentative: using default slots
    const slots = ['08.00', '10.00', '13.00', '15.00']
    // const body = generateSchedulesData(batch._id, slots, schedules)
    // console.log(body)
    const resp = await fetchJson(
      APIROUTES.POST.SAVE_GROUP_SCHEDULES, 
      generatePOSTData({
        bid: batch._id,
        slots: slots,
        groups: schedules, // with fake ids
      })
    )
    console.log(resp)
    mutateGroups()
    setSubmitting(false)
    setSwappingEnabled(false)
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

  // 
  if (schedules.length == 0) return <>OOOOOOO</>

  return <>
    <Hero project={project} title="Deployment" batch={batch} />

    <Subhead title="Tes Mandiri (Online)">
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
        <TestsInfo batch={batch} mode={mode} setMode={setMode} />
      </>
    }

    <hr className="h-8 border-none" />

    { batch.sims.length == 0
      ? <>
        <Subhead title="Grouping & Skedul Pelaksanaan"></Subhead>
        <p>Batch ini tidak memerlukan grouping dan penjadwalan.</p>
      </>
      : <>
        <Subhead title="Skedul Pelaksanaan"></Subhead>
        <hr className="h-2 border-none" />
        
        <div className="overflow-x-scroll">
          <Schedule 
            groups={schedules} 
            remoteGroups={remoteGroups} 
            names={names} 
            isAdmin={isAdmin}
            saveGroupSchedules={saveGroupSchedules}
          />
        </div>

        <hr className="h-8 border-none" />

        <Subhead title="Grouping">
          {missingNames.length == 0 && 
          <label className="w-auto flex items-center space-x-2 text-gray-600 cursor-pointer">
            <input type="checkbox"
              className="rounded-sm text-green-500 focus:outline-none focus:ring-0"
              onChange={e => setSwappingEnabled(e.target.checked)}
            />
            <span>Enable group swapping</span>
          </label>}
        </Subhead>

        <hr className="mt-2 mb-2 border-yellow-500 border-opacity-50"/>

        <Groups 
          groups={schedules} 
          remoteGroups={remoteGroups} 
          swappingEnabled={swappingEnabled}
          names={names} 
          isAdmin={isAdmin} 
          setSchedules={setSchedules}
          saveGroupSchedules={saveGroupSchedules}
        />
      </>
    }

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

    {/* <pre>BATCH ID {batch._id}</pre> */}
    {/* <pre>Group 1: {JSON.stringify((groups[0]), null, 2)}</pre> */}
    {/* <pre>Schedule 1: {JSON.stringify((schedules[0]), null, 2)}</pre> */}
    {/* <pre>Remote group: {JSON.stringify((remoteGroups), null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(schedules[0], null, 2)}</pre> */}
    {/* <pre>Person 1: {JSON.stringify((personae[0] || personae), null, 2)}</pre> */}
    {/* <pre>Names KV {JSON.stringify(names, null, 2)}</pre> */}
  </>
}

export default Deployment
