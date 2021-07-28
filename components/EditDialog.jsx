import { XIcon } from "@heroicons/react/outline";

import FixedOverlay from "./FixedOverlay"

const EditDialog = ({ person, action, onCancel, onConfirm }) => {
  return (
    <FixedOverlay>
      <div 
        className="bg-white rounded shadow-md hover:shadow-lg p-1"
        style={{ minWidth: '220px' }}
      >
        <div className="rounded-sm border hover:border-gray-300 pb-5">
          <div className="flex items-center justify-end rounded-t p--1">
            <button 
              className="text-white rounded-bl-sm bg-gray-200 p-px text-center hover:text-gray-600"
              onClick={onCancel}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="px-5 pt-3 pb-3">
            <div className="message text-center pb-5">
              Click OK to {action}<br/>
              <span className="font-bold">{person.fullname}</span>
            </div>
            <div className="text-center pt-4">
              <button 
                className="rounded text-white font-semibold bg-blue-500 hover:bg-blue-400 px-5 py-1"
                onClick={onConfirm}
              >OK</button>
            </div>
          </div>
        </div>
      </div>
    </FixedOverlay>
  )
}

export default EditDialog