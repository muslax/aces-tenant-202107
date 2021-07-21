import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import { getLocalStorageBatch } from "lib/utils";

import ProjectLayout from "components/layout/ProjectLayout";
import Modules from "components/modules/Modules";
import Prefetch from "components/Prefetch";
import { useEffect, useState } from "react";
import PageLoading from "components/PageLoading";
import ProjectNotFound from "components/ProjectNotFound";

// Project routes must provide user and project props
// to its main component

const ModulesPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

  const [currentBatch, setCurrentBatch] = useState(getLocalStorageBatch(pid))
  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     console.log("Checking LS...")
  //     if (false === getLocalStorageBatch(pid)) {
  //       console.log("Batch missing...")
  //       setCurrentBatch(null)
  //     } else {
  //       console.log("OK")
  //     }
  //   }, 5000) // every 5 second

  //   return () => { clearInterval(interval) }
  // }, [])

  useEffect(() => {
    setCurrentBatch(getLocalStorageBatch(pid))
  }, [project])

  
  if (!currentBatch) return null
  if (isLoading) return <PageLoading />
  if (isError) return <ProjectNotFound pid={pid} />

  return (
    <div>
      <Head>
        <title>Modules: {project.title} - ACES</title>
      </Head>
      
      <Modules user={user} project={project} localBatch={currentBatch} />

      <div className="prefetch hidden">
        {/* <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} /> */}
      </div>
    </div>
  )
}

ModulesPage.redirectUnAuthenticatedTo = ROUTES.Login;
ModulesPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ModulesPage
