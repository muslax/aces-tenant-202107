import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import { getLocalStorageBatch } from "lib/utils";

import ProjectLayout from "components/layout/ProjectLayout";
import XModules from "components/modules/XModules";
import Prefetch from "components/Prefetch";
import { useEffect, useState } from "react";
import PageLoading from "components/PageLoading";
import ProjectNotFound from "components/ProjectNotFound";
import useBatch from "hooks/useBatch";
import BatchMissing from "components/project/BatchMissing";

// Project routes must provide user and project props
// to its main component

const ModulesPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

  // localStorage
  const _batch_ = getLocalStorageBatch(pid)

  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)
  const { batch, isError: batchError, isLoading: batchLoading } = useBatch(_batch_?._id)

  const [currentBatch, setCurrentBatch] = useState(_batch_)

  useEffect(() => {
    if (batch) {
      setCurrentBatch(batch)
      window.localStorage.setItem(pid, JSON.stringify(batch))
    }
  }, [batch])

  
  if (!currentBatch) return null
  if (isLoading) return <PageLoading />
  if (isError) return <ProjectNotFound pid={pid} />
  if (batchError) {
    return <>
      <Head>
        <title>Modules: {project.title} - ACES</title>
      </Head>
      <BatchMissing pid={pid} setCurrentBatch={setCurrentBatch} />
    </>
  }

  return (
    <div>
      <Head>
        <title>Modules: {project.title} - ACES</title>
      </Head>

      {/* {batchError && <BatchMissing pid={pid} setCurrentBatch={setCurrentBatch} />} */}
      
      <XModules user={user} project={project} batch={currentBatch} />

      <div className="prefetch hidden">
        {/* <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} /> */}
      </div>
    </div>
  )
}

ModulesPage.redirectUnAuthenticatedTo = ROUTES.Login;
ModulesPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ModulesPage
