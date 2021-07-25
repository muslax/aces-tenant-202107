import { useEffect, useState } from "react"
import Link from "next/link"
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
import RuntimeGroups from "./RuntimeGroups"

/**
 * CASES
 * 1. No modules or no persons  -> BatchNotReady
 * 2. Only sims                 -> SimsOnly
 * 3. Only tests                -> TestsOnly
 * 4. Tests and sims            -> SimsAndTests
 */

/** */

const Deployment = ({ user, project, batch }) => {
  const isAdmin = user.username == project.admin.username
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()
  const { personae, isLoading: personsLoading, isError: personsError, mutate: mutatePeronae } = useBatchPersonae(batch._id, 'fullname, group')

  const [tests, setTests] = useState([])
  const [sims, setSims] = useState([])
  const [mode, setMode] = useState("reading")

  const [groups, setGroups] = useState([])
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    if (personae) {
      const _groups = createGroups(personae)
      setGroups(_groups)
      setSchedules(createSchedules(_groups))
    }
  }, [personae])
  
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

  if (modulesLoading || personsLoading) {
    return <PageLoading 
      project={project} 
      batch={batch} 
      title="Deployment" 
    />
  }

  if (batch.personae == 0 || batch.modules.length == 0) {
    return <BatchNotReady 
      project={project}
      batch={batch}
      isAdmin={isAdmin}
    />
  }

  return <>
    <Hero project={project} title="Deployment" batch={batch} />
    
    <Subhead title="Tes Mandiri (Online)">
      <div className="pr-2">
      {isAdmin && mode == "reading" && (
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
    <hr className="h-2 border-none" />
    <TestsInfo batch={batch} mode={mode} setMode={setMode} />

    <hr className="h-8 border-none" />
    <Subhead title="Skedul Pelaksanaan"></Subhead>
    <hr className="h-2 border-none" />
    {sims.length == 0 && 
      <p>Tidak ada modul temumuka yang memerlukan penjadwalan.</p>
    }
    {sims.length > 0 && (
      <div className="overflow-x-scroll">
        <Schedule groups={schedules} />
      </div>
    )}

    <hr className="h-8 border-none" />
    <Subhead title="Grouping"></Subhead>
    <hr className="h-2 border-none" />
    {sims.length == 0 && 
      <p>Tidak ada modul temumuka yang memerlukan grouping (pengelompokan).</p>
    }
    {sims.length > 0 && (
      <div className="overflow-x-scroll">
        <RuntimeGroups groups={schedules} />
      </div>
    )}

    <pre>
      {/* Persona 1: {JSON.stringify(personae[0], null, 2)}<br/> */}
      {/* GROUPS 1: {JSON.stringify(groups[0], null, 2)}<br/> */}
      {/* SCHEDULE 1: {JSON.stringify(schedules[0], null, 2)}<br/> */}
    </pre>

    {/* <pre>{JSON.stringify(batch, null, 2)}</pre> */}
    {/* <pre>TESTS {JSON.stringify(tests, null, 2)}</pre> */}
    {/* <pre>SIMS {JSON.stringify(sims, null, 2)}</pre> */}
    {/* <pre>BATCH MODULELS{JSON.stringify(batchModules, null, 2)}</pre> */}
  </>
}

export default Deployment
