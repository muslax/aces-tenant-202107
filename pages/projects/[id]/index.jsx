import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";
import useBatches from "hooks/useBatches";
import { getLocalStorageBatch } from "lib/utils";

import ProjectLayout from "components/layout/ProjectLayout";
import Overview from "components/project/Overview";
import Prefetch from "components/Prefetch";
import ProjectNotFound from "components/ProjectNotFound";
import BatchMissing from "components/project/BatchMissing";

const IndexPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query

  const _batch_ = getLocalStorageBatch(pid)
  console.log("LS batch type:", typeof _batch_)

  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)
  const { batches, isError: batchesError, isLoading: batchesLoading, mutate: mutateBatches } = useBatches(pid)

  const [currentBatch, setCurrentBatch] = useState(_batch_)

  useEffect(() => {
    if (batches) {
      // First visit: set default localStorage batch
      if (getLocalStorageBatch(pid) === false) {
        // console.log("getLocalStorageBatch(pid) === false")
        const mostRecentBatch = batches[0]
        setCurrentBatch(mostRecentBatch)
        window.localStorage.setItem(pid, JSON.stringify(mostRecentBatch))
      } else {
        console.log("getLocalStorageBatch(pid) NOT false")
        // Not first visit,
        // check localStorage against batches
        let found = false
        batches.forEach(batch => {
          if (batch._id == _batch_._id) {
            found = true
            setCurrentBatch(batch)
            window.localStorage.setItem(pid, JSON.stringify(batch))
            // console.log("LS batch replaced")
          }
        })

        if (!found) {
          // Make it null to trigger BatchMissing
          setCurrentBatch(null)
        }
      }
    }
  }, [batches])

  if (isLoading || batchesLoading) return null

  if (isError) return <ProjectNotFound pid={pid} />

  if (!currentBatch) return <BatchMissing pid={pid} setCurrentBatch={setCurrentBatch} />

  return (
    <div>
      <Head>
        <title>Overview: {project.title} - ACES</title>
      </Head>
      
      <Overview user={user} project={project} batches={batches} mutate={mutateBatches} />

      <div className="prefetch hidden">
        <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} />
      </div>
    </div>
  )
}

IndexPage.redirectUnAuthenticatedTo = ROUTES.Login;
IndexPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default IndexPage
