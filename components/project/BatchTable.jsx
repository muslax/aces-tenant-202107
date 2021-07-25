import { useEffect, useState } from "react"
import { BeakerIcon, StatusOnlineIcon, TrashIcon, PencilAltIcon, UsersIcon, XIcon } from '@heroicons/react/solid'
import { CheckCircleIcon } from '@heroicons/react/outline'

import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import { generatePOSTData } from "lib/utils"
import { mutate } from "swr"

import FixedOverlay from "components/FixedOverlay"

const BatchTable = ({ batches, currentBatch, setCurrentBatch, isAdmin }) => {
  const [selected, setSelected] = useState(null)
  const [toBeDeleted, setToBeDeleted] = useState(null)

  async function renameBatch(e) {
    const copy = selected
    setSelected(null)

    await fetchJson(APIROUTES.POST.UPDATE_BATCH, generatePOSTData({
      id: copy._id,
      title: e.target.value,
      date1: copy.date1,
    }))

    mutate(`${APIROUTES.GET.BATCHES}&pid=${copy.pid}`)
  }

  async function deleteBatch(e) {
    await fetchJson(APIROUTES.POST.DELETE_BATCH, generatePOSTData({
      id: toBeDeleted._id
    }))

    mutate(`${APIROUTES.GET.BATCHES}&pid=${toBeDeleted.pid}`)
    setToBeDeleted(null)
  }

  function isDisabled(batch) {
    return batch.protected || batch._id == currentBatch._id
  }

  return <>
    <div className="border-t border-b border-green-500 border-opacity-50 hover:border-opacity-80">
      {batches.map(batch => 
        <div key={batch._id} className="h-12 px-1 flex items-center space-x-2 border-b border-green-500 border-opacity-50 last:border-none">
          {batch.protected && <StatusOnlineIcon className={`flex-shrink-0 w-5 h-5 text-gray-600`}/>}
          {!batch.protected && <StatusOnlineIcon className={`flex-shrink-0 w-5 h-5 
            ${batch._id == currentBatch._id ? 'text-green-500' : 'text-gray-300'}`}
          />}
          <BeakerIcon className={`flex-shrink-0 w-4 h-4 ${batch.modules.length > 0 ? 'text-indigo-400' : 'text-gray-300'}`}/>
          <UsersIcon className={`flex-shrink-0 w-4 h-4 ${batch.personae > 0 ? 'text-gray-500' : 'text-gray-300'}`}/>
          <div className="hidden xs:block flex-shrink-0">{batch.date1}</div>
          
          {(!selected || selected._id != batch._id) && (
            <div className="flex-grow overflow-hidden">
                <p 
                  className={`font-bold truncate cursor-default select-none
                  ${batch._id == currentBatch._id ? 'text-green-600' : ''}`}
                  onDoubleClick={e => {
                    setCurrentBatch(batch)
                    window.localStorage.setItem(batch.pid, JSON.stringify(batch))
                  }}
                >
                  {batch.title}
                </p>
            </div>
          )}
          {selected && selected._id == batch._id && (
            <div className="flex-grow">
              <div className="max-w-md">
                <input
                  type="text"
                  autoFocus
                  value={selected.title}
                  className="w-full h-8 text-sm leading-tight px-2 py-1 rounded bg-gray--50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                  onChange={e => setSelected(s => ({...s, title: e.target.value}))}
                  onKeyPress={e => {
                    if (e.code == "Enter") {
                      // alert("V: " + e.target.value + " " + selected._id)
                      renameBatch(e)
                    }
                    if (e.key === 'Escape') {
                      alert("ESC")
                    }
                  }}
                />
              </div>
            </div>
          )}

          {(!selected || selected._id != batch._id) && <>
            <button 
              disabled={!isAdmin}
              className={`flex items-center space-x-1 text-xs font-medium ${!isAdmin ? 'text-gray-300' : 'text-gray-500 hover:text-green-500'}`}
              onClick={e => setSelected(batch)}
            >
              <PencilAltIcon className={`w-4 h-4 ${!isAdmin ? 'text-gray-300' : 'text-green-500'}`} />
              <span className="hidden xs:block">Rename</span>
            </button>
            <button 
              disabled={!isAdmin || isDisabled(batch)}
              className={`group flex items-center space-x-1 text-xs font-medium  
              ${!isAdmin || isDisabled(batch) ? 'text-gray-300' : 'text-gray-500 hover:text-red-600'}`}
              onClick={e => setToBeDeleted(batch)}
            >
              <TrashIcon className={`w-4 h-4 ${!isAdmin || isDisabled(batch) ? 'text-gray-300' : 'text-red-400'}`} />
              <span className="hidden xs:block">Delete</span>
            </button>
          </>}
          {(selected && selected._id == batch._id) && (
            <div className="px-4 sm:px-8">
            <button
              className="text-xs font-semibold text-red-500 hover:text-red-400"
              onClick={e => setSelected(null)}
            >Cancel</button>
            </div>
          )}
          
          {/* {batch._id != currentBatch?._id && (
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
              <button 
                className="w-5 h-5 rounded-full border hover:border-2 border-gray-400 hover:border-green-500" 
                onClick={e => setCurrentBatch(batch)}
              >&nbsp;</button>
            </div>
          )}
          {batch._id == currentBatch?._id && (
            <button className="flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </button>
          )} */}
        </div>
      )}
    </div>

    {/* Delete */}
    {toBeDeleted && (
      <FixedOverlay>
        <div 
          className="bg-white rounded shadow-md hover:shadow-lg p-1"
          style={{ minWidth: '220px' }}
        >
          <div className="rounded-sm border hover:border-gray-300 pb-5">
            <div className="flex items-center justify-end rounded-t p--1">
              <button 
                className="text-white rounded-bl-sm bg-gray-200 p-px text-center hover:text-gray-600"
                onClick={e => setToBeDeleted(null)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 pt-3 pb-3">
              <div className="message text-center pb-5">
                Click OK to delete Batch<br/>
                <span className="font-bold">{toBeDeleted.title}</span>
              </div>
              <div className="text-center pt-4">
                <button 
                  className="rounded text-white font-semibold bg-green-500 hover:bg-green-400 px-8 py-1"
                  onClick={deleteBatch}
                >OK</button>
              </div>
            </div>
          </div>
        </div>
      </FixedOverlay>
    )}
    {/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
  </>
}

export default BatchTable
