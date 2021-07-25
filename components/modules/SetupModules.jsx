import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router";
import { ChevronDownIcon, ChevronRightIcon, EyeIcon, EyeOffIcon, InformationCircleIcon } from "@heroicons/react/solid";
// import { InformationCircleIcon } from "@heroicons/react/outline";

import useBatch from "hooks/useBatch"
import useModules from "hooks/useModules"
import fetchJson from "lib/fetchJson";
import { generatePOSTData, getBatchModules, getLocalStorageBatch } from "lib/utils"

import PageLoading from "components/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import BatchMissing from "components/project/BatchMissing"
import { APIROUTES } from "config/routes";

const SetupModules = ({ user, project, localBatch }) => { 
  const router = useRouter()
  const isAdmin = user.username == project.admin.username
  const { modules, isError: moduleError, isLoading: modulesLoading } = useModules()
  const batchModules = getBatchModules(localBatch, modules);
  
  // localBatch comes from localStorage, might be false
  // Or might be has just been deleted

  const {
    batch: remoteBatch, 
    isLoading: batchLoading, 
    isError: batchError, 
    mutate: mutateBatch
  } = useBatch(getLocalStorageBatch(project._id)?._id) // useBatch(localBatch?._id)

  // Create state, might be false
  const [currentBatch, setCurrentBatch] = useState(localBatch)
  const [showDescription, setShowDescription] = useState(false)
  const [selection, setSelection] = useState(currentBatch?.modules) // CHECK localBatch, remoteBatch?
  const [orderedSelection, setOrderedSelection] = useState([])
  const [cognitives, setCognitives] = useState([])
  const [flag, setFlag] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (remoteBatch) {
      window.localStorage.setItem(project._id, JSON.stringify(remoteBatch))
      setCurrentBatch(remoteBatch)
    }
  }, [remoteBatch])

  useEffect(() => {
    if (!modules) return
    const array = [];
    modules.forEach(m => {
      if (m.domain == 'Cognitive' && currentBatch.modules.includes(m._id)) { // CHECK localBatch, remoteBatch?
        array.push(m._id);
        if (m.type == "MATE") setFlag(m.type);
        else setFlag(m.domain);
      }
    })

    setCognitives(array);
  }, [modules, currentBatch]) // CHECK localBatch, remoteBatch?

  // Create ordered selection based on module's order property
  useEffect(() => {
    if (!modules) {
      setOrderedSelection(selection);
      return;
    }

    let array = [];
    modules.forEach(m => {
      if (selection.includes(m._id)) {
        array.push({
          _id: m._id,
          order: m.order,
        })
      }
    });

    array.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    })

    let ordered = []
    array.forEach(({ _id }) => {
      ordered.push(_id);
    })

    setOrderedSelection(ordered);

    return () => {}
  }, [selection])

  // Warning: Maximum update depth exceeded. This can happen when a component
  // calls setState inside useEffect, but useEffect either doesn't have a
  // dependency array, or one of the dependencies changes on every render.
  // useEffect(() => {
  //   if (!modules) return;

  //   setSelection(batch.modules)

  //   modules.forEach(m => {
  //     if (batch.modules.includes(m._id)) {
  //       if (m.type == "MATE") {
  //         setFlag(m.type);
  //         setCognitives(s => ([...s, m._id]))
  //       } else if (m.domain == "Cognitive") {
  //         setFlag(m.domain);
  //         setCognitives(s => ([...s, m._id]))
  //       }
  //     }
  //   })
  // }, [batch])

  function checkFlag(domain, type) {
    if (type == "MATE" && flag == "Cognitive") return true;
    if (type != "MATE" && domain == "Cognitive" && flag == "MATE") return true;
    return false;
  }

  function getClass(domain, type) {
    if (type == "MATE") return type;
    if (type != "MATE" && domain == "Cognitive") return domain;
    return "";
  }

  function changeHandler(e, m) {
    const isMate = m.type == 'MATE';
    const isCognitive = m.type != 'MATE' && m.domain == 'Cognitive';

    if (e.target.checked) {
      setSelection(s => ([...s, m._id]))

      if (isMate) setFlag(m.type)
      else if (isCognitive) setFlag(m.domain)

      if (isMate || isCognitive) setCognitives(s => ([...s, m._id]))
    }
    else {
      if (isMate || isCognitive) {
        setCognitives(cognitives.filter((s) => {return s != m._id}))

        if (isMate && flag == 'MATE') setFlag(null);
        if (isCognitive && flag == 'Cognitive' && cognitives.length == 1) {
          setFlag(null);
        }
      }

      setSelection(selection.filter((s) => {return s != m._id}))
    }
  }

  async function saveBatchModules(e) {
    setSubmitting(true);

    // Fill tests & sims
    const tests = [], sims =[]
    modules.forEach(m => {
      if (selection.includes(m._id)) {
        if (m.method == 'selftest') tests.push(m._id)
        else sims.push(m._id)
      }
    })

    const res = await fetchJson(APIROUTES.POST.SAVE_MODULES, generatePOSTData({
      id: currentBatch._id,
      modules: orderedSelection,
      tests: tests,
      sims: sims,
    }))

    if (res) {
      mutateBatch();
      
      // optimistic update
      const lsBatch = getLocalStorageBatch(project._id)
      lsBatch.modules = orderedSelection
      window.localStorage.setItem(project._id, JSON.stringify(lsBatch))
      setCurrentBatch(lsBatch)

      router.push(`/projects/${project._id}/modules`);
    }
  }

  if (batchLoading || modulesLoading) return <PageLoading />

  if (batchError) {
    // BatchMissing facilitate reselecting available batch, hence
    // the useBatch hook won't give error result
    return <BatchMissing pid={project._id} setCurrentBatch={setCurrentBatch} />
  }

  // if (currentBatch.modules.length == 0) {
  //   return <>
  //     <Hero project={project} title="ACES Modules" batch={currentBatch} />
  //     <NoModules project={project} isAdmin={isAdmin} />
  //   </>
  // }

  return <>
    {/* <Hero project={project} title="ACES Modules" batch={currentBatch} /> */}
    <br/>
    <h2 className="text-2xl text-gray-600 font-light">
      Select Modules
    </h2>

    {/* <hr className="mt-2 mb-3 border-yellow-500 border-opacity-50"/> */}
    <hr className="mt-2 mb-3 border-none"/>

    <div className="flex items-center space-x-4 mb-5 px-1">
      <div className="flex-grow pt-2">
      {showDescription && <button
          className="flex items-center space-x-1 text-gray-600"
          onClick={e => setShowDescription(!showDescription)}
        >
          <InformationCircleIcon className="w-5 h-5 text-green-500" />
          <span>Show Description</span>
          {/* <ChevronDownIcon className="w-5 h-5" /> */}
        </button>}
        {!showDescription && <button
          className="flex items-center space-x-1 text-gray-600"
          onClick={e => setShowDescription(!showDescription)}
        >
          <InformationCircleIcon className="w-5 h-5 text-gray-400" />
          <span>Show Description</span>
          {/* <ChevronRightIcon className="w-5 h-5" /> */}
        </button>}
      </div>
      <div className="text--xs">
        <Link href={`/projects/${project._id}/modules`}>
          <a className="inline-flex items-center px-3 pt-2 text-red-600 text-opacity-80 hover:text-opacity-100">Cancel</a>
        </Link>
      </div>
    </div>

    <div className="border-t border-green-500 border-opacity-60">
    {modules.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    }).map(m => (
      <div
        key={m._id}
        className="flex items-start space-x-4 border-b border-green-500 border-opacity-60 px-2 py-2"
      >
        <div className="flex-shrink-0 flex space-x-3 py-px">
          {currentBatch.modules.length > 0 && <input
            type="checkbox"
            checked={currentBatch.modules.includes(m._id)}
            disabled
            className={`w-5 h-5 rounded border-gray-200 border-gray-400 hover:border-gray-500
            text-gray-200 focus:ring-blue-200 focus:ring-offset-1`}
          />}
          <input
            type="checkbox"
            id={m._id}
            disabled={checkFlag(m.domain, m.type)}
            defaultChecked={currentBatch.modules.includes(m._id)}
            className={`${getClass(m.domain, m.type)}
            w-5 h-5 rounded border-gray-400 hover:border-gray-500
            text-green-500 focus:ring-blue-200 focus:ring-offset-1`}
            onChange={(e) => changeHandler(e, m)}
          />
        </div>

        <div className={`flex-grow
            ${checkFlag(m.domain, m.type) ? 'text-gray-400' : ''}`}>
          <label
            htmlFor={m._id}
            className={`${checkFlag(m.domain, m.type)
            ? '' : 'hover:text-blue-500'} font-bold cursor-pointer`}
          >{m.title}</label>
          {showDescription && <div className="mt-1">{m.description}</div>}
        </div>
      </div>
    ))}
    </div>

    <div className="text-center pt-10">
      <button
        className="inline-flex font-semibold text-white rounded-sm bg-green-500 hover:bg-green-600 active:bg-green-700 px-5 py-2"
        onClick={saveBatchModules}
      >Save Modules</button>
    </div>

    {/* <pre>orderedSelection {JSON.stringify(orderedSelection, null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(currentBatch, null, 2)}</pre> */}

    <style jsx>{`
    `}</style>
  </>
}

export default SetupModules