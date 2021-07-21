import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import { getLocalStorageBatch } from "lib/utils";

import ProjectLayout from "components/layout/ProjectLayout";
import Personae from "components/persona/Personae";
import Prefetch from "components/Prefetch";

// Project routes must provide user and project props
// to its main component

const PersonaPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)

  const [currentBatch, setCurrentBatch] = useState(getLocalStorageBatch(pid)) 

  useEffect(() => {
    setCurrentBatch(getLocalStorageBatch(pid))
  }, [project])

  if (!currentBatch) return null
  if (isLoading) return <PageLoading />
  if (isError) return <ProjectNotFound pid={pid} />

  return (
    <div>
      <Head>
        <title>Personae: {project.title} - ACES</title>
      </Head>
      
      <Personae user={user} project={project} localBatch={currentBatch} />

      <div className="prefetch hidden">
        <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} />
      </div>
    </div>
  )
}

PersonaPage.redirectUnAuthenticatedTo = ROUTES.Login;
PersonaPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default PersonaPage
