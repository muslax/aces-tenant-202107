import { useEffect, useState } from "react"

import useBatch from "hooks/useBatch"
import useBatchPersonae from "hooks/useBatchPersonae"
import { getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import BatchMissing from "components/project/BatchMissing"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"

const Deployment = ({ user, project, localBatch }) => {
  const { personae, isLoading, isError, mutate: mutatePeronae } = useBatchPersonae(localBatch?._id)

  const {
    batch: remoteBatch, 
    isLoading: batchLoading, 
    isError: batchError, 
  } = useBatch(getLocalStorageBatch(project._id)?._id)

  // Create state, might be false
  const [currentBatch, setCurrentBatch] = useState(localBatch)

  useEffect(() => {
    if (remoteBatch) {
      window.localStorage.setItem(project._id, JSON.stringify(remoteBatch))
      setCurrentBatch(remoteBatch)
    }
  }, [remoteBatch])

  if (isLoading || batchLoading) return <PageLoading />

  if (batchError) {
    // BatchMissing facilitate reselecting available batch, hence
    // the useBatch hook won't give error result
    return <BatchMissing pid={project._id} setCurrentBatch={setCurrentBatch} />
  }

  return <>
    <Hero project={project} title="Deployment" batch={currentBatch} />
    
    <Subhead title="Test Settings">
      XXX
    </Subhead>
  </>
}

export default Deployment