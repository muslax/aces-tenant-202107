import Link from "next/link"

import useModules from "hooks/useModules"
import { getBatchModules } from "lib/utils"

import PageLoading from "components/project/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import NoModules from "./NoModules"

const Modules = ({ user, project, batch }) => { 
  const isAdmin = user.username == project.admin.username
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()
  const batchModules = getBatchModules(batch, modules);
  
  if (modulesLoading || !batch) {
    return <PageLoading 
      project={project} 
      batch={batch}
      title="ACES Modules"
    />
  }

  if (batch.modules.length == 0) {
    return <NoModules 
      project={project} 
      batch={batch}
      isAdmin={isAdmin} 
    />
  }

  return <>
    <Hero project={project} title="ACES Modules" batch={batch} />

    <Subhead title="Modul Mandiri">
      {isAdmin && 
        <Link href={`/projects/${project._id}/setup-modules`}>
          <a className="project-button px-3">Add / Remove</a>
        </Link>
      }
    </Subhead>

    <hr className="mt-2 mb-4 border-yellow-500 border-opacity-50"/>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4- gap-4">
    {modules.filter(m => batch.tests.includes(m._id)).map(m => (
      <div key={m._id} className="rounded border hover:shadow-sm">
        <div className="bg-gray-100 rounded-t font-bold px-3 py-2">{m.title}</div>
        <div className="text-gray-500 px-3 py-3">
          <div className="mb-2">{m.description}</div>
          <div className="">Waktu: {m.maxTime}</div>

        </div>
      </div>
    ))}
    </div>

    <br/>

    <Subhead title="Modul Temumuka" />

    <hr className="mt-2 mb-4 border-yellow-500 border-opacity-50"/>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4- gap-4">
    {modules.filter(m => batch.sims.includes(m._id)).map(m => (
      <div key={m._id} className="rounded border hover:shadow-sm">
        <div className="bg-gray-100 rounded-t font-bold px-3 py-2">{m.title}</div>
        <div className="text-gray-500 px-3 py-3">
          <div className="mb-2">{m.description}</div>
          <div className="">Waktu: {m.maxTime}</div>

        </div>
      </div>
    ))}
    </div>

    {/* <pre>BATCH {JSON.stringify(batch, null, 2)}</pre> */}

    <style jsx>{`
    `}</style>
  </>
}

export default Modules
