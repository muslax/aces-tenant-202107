import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import { getLocalStorageBatch } from "lib/utils";
import useBatch from "hooks/useBatch";

import ProjectLayout from "components/layout/ProjectLayout";
import Modules from "components/modules/Modules";
import Prefetch from "components/Prefetch";
import { useEffect, useState } from "react";
import PageLoading from "components/PageLoading";
import ProjectNotFound from "components/ProjectNotFound";
import BatchMissing from "components/project/BatchMissing";

const ModulesPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

  const _batch_ = getLocalStorageBatch(pid)

  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)
  const { batch, isError: batchError, isLoading: batchLoading } = useBatch(_batch_?._id)

  const [currentBatch, setCurrentBatch] = useState(_batch_)

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
    if (batch) {
      setCurrentBatch(batch)
      window.localStorage.setItem(pid, JSON.stringify(batch))
    }
  }, [batch])
  
  if (isLoading) return null

  if (isError) return <ProjectNotFound pid={pid} />

  if (batchError) return <BatchMissing pid={pid} setCurrentBatch={setCurrentBatch} />

  return (
    <div>
      <Head>
        <title>Modules: {project.title} - ACES</title>
      </Head>
      
      <Modules user={user} project={project} batch={currentBatch} />

      <div className="prefetch hidden">
        {/* <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} /> */}
      </div>
    </div>
  )
}

ModulesPage.redirectUnAuthenticatedTo = ROUTES.Login;
ModulesPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ModulesPage
