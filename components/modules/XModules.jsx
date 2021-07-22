import { useEffect, useState } from "react"
import Link from "next/link"

import useBatch from "hooks/useBatch"
import useModules from "hooks/useModules"
import { getBatchModules, getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import BatchMissing from "components/project/BatchMissing"
import NoModules from "./NoModules"

const XModules = ({ user, project, batch }) => { 
  const isAdmin = user.username == project.admin.username
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()
  const batchModules = getBatchModules(batch, modules);
  
  if (batch.modules.length == 0) {
    return <>
      <Hero project={project} title="ACES X Modules" batch={batch} />
      <NoModules project={project} isAdmin={isAdmin} />
    </>
  }

  return <>
    <Hero project={project} title="ACES X Modules" batch={batch} />

    <Subhead title="Daftar Modul">
      {isAdmin && 
        <Link href={`/projects/${project._id}/setup-modules`}>
          <a className="project-button px-3">Add / Remove</a>
        </Link>
      }
    </Subhead>

    <hr className="mt-2 mb-4"/>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4- gap-4">
    {batchModules.map(m => (
      <div key={m._id} className="rounded border hover:shadow-sm">
        <div className="bg-gray-100 rounded-t font-bold px-3 py-2">{m.title}</div>
        <div className="text-gray-500 px-3 py-3">
          <div className="mb-2">{m.description}</div>
          <div className="">Waktu: {m.maxTime}</div>

        </div>
      </div>
    ))}
    </div>

    <pre>{JSON.stringify(batchModules, null, 2)}</pre>

    <style jsx>{`
    `}</style>
  </>
}

export default XModules