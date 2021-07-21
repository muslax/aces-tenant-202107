import { useEffect, useState } from "react"
import { StatusOnlineIcon, TrashIcon, PencilAltIcon, XIcon } from '@heroicons/react/solid'
import { CheckCircleIcon } from '@heroicons/react/outline'

import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import { generatePOSTData } from "lib/utils"
import { mutate } from "swr"

import FixedOverlay from "components/FixedOverlay"

const BatchTable = ({ batches, currentBatch, setCurrentBatch }) => {
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

  return <>
    <div className="border-t border-b border-gray-300 hover:border-gray-400 hover:border-opacity-60">
      {batches.map(batch => 
        <div key={batch._id} className="h-12 px-1 flex items-center space-x-3 border-b border-gray-300 last:border-none">
          {batch.protected && <StatusOnlineIcon className={`flex-shrink-0 w-5 h-5 `}/>}
          {!batch.protected && <StatusOnlineIcon className={`flex-shrink-0 w-5 h-5 
            ${batch._id == currentBatch._id ? 'text-green-400' : 'text-gray-400'}`}
          />}
          <div className="flex-shrink-0">{batch.date1}</div>
          
          {(!selected || selected._id != batch._id) && (
            <div className="flex-grow overflow-hidden">
                <p 
                  className="font-bold truncate"
                  onDoubleClick={e => setCurrentBatch(batch)}
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
              className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-blue-500"
              onClick={e => setSelected(batch)}
            >
              <PencilAltIcon className="w-4 h-4 text-blue-500" />
              <span>Rename</span>
            </button>
            <button 
              disabled={batch.protected || batch._id == currentBatch._id}
              className={`flex items-center space-x-1 text-xs font-medium text-gray-500 
              ${batch.protected || batch._id == currentBatch._id ? '' : 'hover:text-red-500'}`}
              onClick={e => setToBeDeleted(batch)}
            >
              <TrashIcon className={`w-4 h-4 ${batch.protected|| batch._id == currentBatch._id ? 'text-gray-400' : 'text-red-500'}`} />
              <span>Delete</span>
            </button>
          </>}
          {(selected && selected._id == batch._id) && (
            <button
              className="text-xs font-semibold text-red-500 hover:text-red-400"
              onClick={e => setSelected(null)}
            >Cancel</button>
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
                  className="rounded text-white font-semibold bg-blue-500 hover:bg-blue-400 px-5 py-1"
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
