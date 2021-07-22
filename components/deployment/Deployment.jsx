import { useEffect, useState } from "react"

import useBatch from "hooks/useBatch"
import useModules from "hooks/useModules"
import useBatchPersonae from "hooks/useBatchPersonae"
import { getBatchModules, getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import BatchMissing from "components/project/BatchMissing"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"

const Deployment = ({ user, project, batch }) => {
  const isAdmin = user.username == project.admin.username
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()
  const { personae, isLoading: personsLoading, isError: personsError, mutate: mutatePeronae } = useBatchPersonae(batch._id)
  
  const batchModules = getBatchModules(batch, modules);

  const hero = <Hero project={project} title="ACES Persona" batch={batch} />

  if (modulesLoading || personsLoading) return <>
    {hero}
    <PageLoading />
  </>
  

  return <>
    {hero}
    
    <Subhead title="Test Settings">
      XXX
    </Subhead>

    <pre>{JSON.stringify(batch, null, 2)}</pre>
    <pre>{JSON.stringify(modules, null, 2)}</pre>
    <pre>{JSON.stringify(batchModules, null, 2)}</pre>
  </>
}

export default Deployment