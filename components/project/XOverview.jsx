import { useEffect, useState } from "react"

import useBatches from "hooks/useBatches"
import useModules from "hooks/useModules"
import { generatePOSTData, getLocalStorageBatch } from "lib/utils"
import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import useUsers from "hooks/useUsers"

import PageLoading from "components/PageLoading"
import Hero from "./Hero"
import Subhead from "./Subhead"
import BatchInfo from "./BatchInfo"
import BatchTable from "./BatchTable"
import ProjectInfo from "./ProjectInfo"
import BatchMissing from "./BatchMissing"

const Overview = ({ user, project }) => {
  const pid = project._id
  const { batches, isError, isLoading, mutate: mutateBatches } = useBatches(pid)
  const { modules, isLoading: mLoading } = useModules()
  const { users, isLoading: usersLoading } = useUsers()

  const [info, setInfo] = useState("batch")
  const [batchIsMissing, setBatchIsMissing] = useState(false)
  const [editProjectInfo, setEditProjectInfo] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(getLocalStorageBatch(pid))

  const [batchForm, setBatchForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [date1, setDate1] = useState('')

  useEffect(() => {
    if (batches && batches.length > 0) { // setCurrentBatch(batches[0]) // TEMPORARY, JUST FOR TEST
      if (currentBatch && currentBatch._id) {
        let found = false
  
        batches.forEach(b => {
          // Update localStorage
          if (b._id == currentBatch._id) {
            found = true
            window.localStorage.setItem(pid, JSON.stringify(b))
            setCurrentBatch(getLocalStorageBatch(pid))
          }
        })
  
        if (!found) { // Batch has been deleted
          // alert("Current Batch has been deleted from other device.")
          // const mostRecentBatch = batches[0]
          // setCurrentBatch(mostRecentBatch)
          // window.localStorage.setItem(pid, JSON.stringify(mostRecentBatch))
          setBatchIsMissing(true)
        }
      }
    }
  }, [batches])

  if (isLoading || mLoading) return <PageLoading />

  // Set default localStorage batch
  if (getLocalStorageBatch(pid) === false) {
    const mostRecentBatch = batches[0]
    setCurrentBatch(mostRecentBatch)
    window.localStorage.setItem(pid, JSON.stringify(mostRecentBatch))
  }

  function isReady() {
    return title.length > 5 && date1.length == 10
  }

  async function saveNewBatch(e) {
    setSubmitting(true)

    await fetchJson(APIROUTES.POST.SAVE_NEW_BATCH, generatePOSTData({
      pid: project._id,
      title: title,
      date1: date1,
    }))

    mutateBatches()
    setTitle('')
    setDate1('')
    setBatchForm(false)
    setSubmitting(false)
  }

  const inputStyle = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-gray-200 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  const inputError = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-red-300 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  if (batchIsMissing) return (
    <BatchMissing 
      pid={project._id} 
      setCurrentBatch={setCurrentBatch} 
      callback={setBatchIsMissing} 
    />
  )
  
  return <>
    <Hero project={project} isIndex />

    {/*  */}
    <div className="relative">
      <div 
        className="absolute left-0 flex items-center text-xs font-medium"
        style={{ top: '-48px' }}
      >
        {info == "batch" && <>
          <span className="flex items-center h-7 rounded-l bg-gray-400 text-white px-3 cursor-default">
            Batch Info
          </span>
          <button 
            className="flex items-center h-7 rounded-r bg-gray-200 bg-opacity-75 hover:bg-opacity-100 font-medium px-3" 
            onClick={e => setInfo("project")}
          >Project Info</button>
        </>}
        {info != "batch" && <>
          <button 
            className="flex items-center h-7 rounded-l bg-gray-200 bg-opacity-75 hover:bg-opacity-100 font-medium px-3" 
            onClick={e => setInfo("batch")}
          >Batch Info</button>
          <span className="flex items-center h-7 rounded-r bg-gray-400 text-white px-3 cursor-default">Project Info</span>
        </>}
      </div>
    </div>
    
    {info == "batch" && (
      <>
        <Subhead title="Active Batch">
          <select className="project-select leading-none pr-10"
            value={currentBatch._id}
            onChange={e => {
              const batch = batches.filter(b => b._id == e.target.value)[0]
              window.localStorage.setItem(pid, JSON.stringify(batch))
              setCurrentBatch(batch)
            }}
          >
            {batches.map(({ _id, title }) => (
              <option key={_id} value={_id}>{title}</option>
            ))}
          </select>
        </Subhead>

        {currentBatch && <BatchInfo batch={currentBatch} modules={modules} />}
      </>
    )}
    {info != "batch" && (
      <>
        <Subhead title="Project Info">
          {!editProjectInfo 
          && (user.licenseOwner || user.username == project.admin.username )
          && (
            <button 
              className="project-button px-4"
              onClick={e => {
                setEditProjectInfo(!editProjectInfo)
              }}
            >Edit Info</button>
          )}
        </Subhead>
        <ProjectInfo 
          user={user} 
          users={users}
          project={project}
          editing={editProjectInfo}
          setEditing={setEditProjectInfo}
        />
      </>
    )}

    <br/><br/>

    <Subhead title="Batch List">
      <button 
        className="project-button px-4"
        onClick={e => {
          setBatchForm(true)
          setTimeout(window.scrollBy(0, 500), 2000)
        }}
      >New Batch</button>
    </Subhead>

    {batchForm && 
    <div className="border-t pt-3 pb-1">
      <div className="max-w-sm mx-auto pt-3">
        <FormRow label="Nama Batch:" width="">
          <input 
            type="text" 
            value={title}
            disabled={submitting}
            placeholder="min. 6 karakter"
            autoFocus={true}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setTitle(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setTitle(val)
              if (val.length < 6) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        <FormRow label="Tgl mulai:" width="">
          <input 
            type="date" 
            value={date1}
            disabled={submitting}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setDate1(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setDate1(val)
              if (val.length != 10) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        <FormRow label="" width="" forButton>
          <div className="pt-2 pb-4">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <button 
                  disabled={!isReady()}
                  className={`text-white font-bold px-10 py-2
                  focus:outline-none 
                  focus:ring-1 focus:ring-offset-2 focus:ring-red-400
                  rounded border border-transparent disabled:border-gray-200
                  disabled:text-gray-400 disabled:bg-white
                  bg-blue-400 hover:bg-blue-500 hover:bg-opacity-80`}
                  onClick={saveNewBatch}
                >Save</button>
              </div>
              <div className="">
                <button 
                  className={`text-white font-medium px-5 py-2
                  rounded border text-red-400 hover:border-red-300
                  focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-red-400
                  `}
                  onClick={e => setBatchForm(false)}
                >Cancel</button>
              </div>
            </div>
          </div>
        </FormRow>
      </div>
      {/* <pre>
        PID: {project._id}<br/>
        TITLE: {title}<br/>
        DATE: {date1}
      </pre> */}
    </div>
    }

    <BatchTable 
      batches={batches} 
      currentBatch={currentBatch}
      setCurrentBatch={setCurrentBatch}
    />
  </>
}

export default Overview

const FormRow = ({ label, width, forButton, children }) => {
  const inputUnderline = `absolute left-0 bottom-0 right-0 w-0 opacity-0
  border-b-2 border-blue-400 transition duration-150 ease-out linear
  peer-focus:w-full peer-focus:opacity-100 peer-focus:transition 
  peer-focus:origin-center peer-focus:duration-150 peer-focus:ease-in`

  return <>
    {/* row */}
    <div className="flex flex-col sm:flex-row sm:space-x-4 pb-1 sm:pb-3">
      <div className="w-[90px] py-1">
        {label && <label className="text-xs text-gray-500 font-medium uppercase">
          {label}
        </label>}
      </div>
      <div className="sm:flex-grow">
        <div className={`input-container relative rounded ${width} ${forButton ? '' : 'overflow-hidden'}`}>
          {children}
          <div className={inputUnderline} style={{ transition: 'width 150ms' }}></div>
        </div>
      </div>
    </div>
  </>
}
