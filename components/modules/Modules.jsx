import { useEffect, useState } from "react"

import useBatch from "hooks/useBatch"
import useModules from "hooks/useModules"
import { getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import BatchMissing from "components/project/BatchMissing"

const Modules = ({ user, project, localBatch }) => { 
  const { modules, isError: moduleError, isLoading: moduleLoading } = useModules()
  
  // localBatch comes from localStorage, might be false
  // Or might be has just been deleted

  const {
    batch: remoteBatch, 
    isLoading: batchLoading, 
    isError: batchError, 
  } = useBatch(getLocalStorageBatch(project._id)?._id) // useBatch(localBatch?._id)

  // Create state, might be false
  const [currentBatch, setCurrentBatch] = useState(localBatch)

  useEffect(() => {
    if (remoteBatch) {
      window.localStorage.setItem(project._id, JSON.stringify(remoteBatch))
      setCurrentBatch(remoteBatch)
    }
  }, [remoteBatch])

  if (batchLoading || moduleLoading) return <PageLoading />

  if (batchError) {
    // BatchMissing facilitate reselecting available batch, hence
    // the useBatch hook won't give error result
    return <BatchMissing pid={project._id} setCurrentBatch={setCurrentBatch} />
  }

  return <>
    <Hero project={project} title="ACES Modules" batch={currentBatch} />

    <Subhead title="Daftar Modul">
      XXX
    </Subhead>

    <div>
      MODULES / {project.title}
    </div>

    <pre>{JSON.stringify(modules[0], null, 2)}</pre>

    <style jsx>{`
    `}</style>
  </>
}

export default Modules