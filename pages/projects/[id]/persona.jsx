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
import Personae from "components/persona/Personae";
import Prefetch from "components/Prefetch";
import BatchMissing from "components/project/BatchMissing";

const PersonaPage = () => {
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

  return (
    <div>
      <Head>
        <title>Personae: {project ? project.title : '...'} - ACES</title>
      </Head>
      
      <Personae 
        user={user} 
        project={project} 
        batch={currentBatch} 
        isLoading={isLoading} 
      />

      <div className="prefetch hidden">
        <Prefetch uri={`${APIROUTES.GET.BATCH_GROUPS}&bid=${batch?._id}`} />
      </div>
    </div>
  )
}

PersonaPage.redirectUnAuthenticatedTo = ROUTES.Login;
PersonaPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default PersonaPage
