import { useEffect, useState } from "react"

import useBatch from "hooks/useBatch"
import useBatchPersonae from "hooks/useBatchPersonae"
import { getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import BatchMissing from "components/project/BatchMissing"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import NoPersonae from "./NoPersonae"

const Personae = ({ user, project, batch, isLoading }) => {
  const isAdmin = user.username == project.admin.username
  const { personae: persons, isLoading: personsLoading, isError: personsError, mutate: mutatePeronae } = useBatchPersonae(batch._id)

  const hero = <Hero project={project} title="ACES Persona" batch={batch} />

  if (isLoading || personsLoading) return <>
    {hero}
    <PageLoading />
  </>

if (batch.modules.length == 0) {
  return <>
    {hero}
    <NoPersonae project={project} isAdmin={isAdmin} />
  </>
}

  return <>
    {hero}

    <Subhead title="Daftar Persona">
      XXX
    </Subhead>

    <pre>{JSON.stringify(persons, null, 2)}</pre>
  </>
}

export default Personae