import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import useBatch from "hooks/useBatch";
import { getLocalStorageBatch } from "lib/utils";

import ProjectLayout from "components/layout/ProjectLayout";
import ProjectNotFound from "components/ProjectNotFound";
import ImportCSV from "components/persona/ImportCSV";
import Prefetch from "components/Prefetch";
import BatchMissing from "components/project/BatchMissing";
import NotAuthorized from "components/NotAuthorized";

const ImportCSVPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

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
  
  if (isLoading) return null
  
  if (isError) return <ProjectNotFound pid={pid} />
  
  if (batchError) return <BatchMissing pid={pid} setCurrentBatch={setCurrentBatch} />
  
  if (user.username != project.admin.username) {
    return <NotAuthorized user={user} sendBackUrl={`/projects/${project._id}/persona`} />
  }

  return (
    <div>
      <Head>
        <title>Import CSV: {project ? project.title : '...'} - ACES</title>
      </Head>
      
      <ImportCSV 
        user={user} 
        project={project} 
        batch={currentBatch} 
      />

      <div className="prefetch hidden">
        <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} />
      </div>
    </div>
  )
}

ImportCSVPage.redirectUnAuthenticatedTo = ROUTES.Login;
ImportCSVPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ImportCSVPage
