import { useRouter } from "next/router"

import { XIcon } from "@heroicons/react/outline"
import { ROUTES } from "config/routes"

const NewProject = ({ user }) => {
  const router = useRouter()

  const cancel = (e) => {
    router.push(ROUTES.Dashboard)
  } 

  const inputStyle = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-gray-200 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`
  const inputUnderline = `absolute left-0 bottom-0 right-0 w-0 opacity-0
  border-b-2 border-blue-400 transition duration-150 ease-out linear
  peer-focus:w-full peer-focus:opacity-100 peer-focus:transition 
  peer-focus:origin-center peer-focus:duration-150 peer-focus:ease-in`

  return <>
    <div className="flex h-16 pt-1 items-center border-b border-blue-200">
      <h2 className="flex-grow text-xl text-gray-400 font-bold my-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-400">
          New ACES Project
        </span>
      </h2>
      <button onClick={cancel} className="rounded-sm text-gray-500 hover:text-red-600">
        <XIcon className="w-7 h-7" />
      </button>
    </div>

    <div className="max-w-2xl mx-auto border--r py-10">
      {/* row */}
      <div className="bg-yellow--100 flex flex-col sm:flex-row sm:space-x-4 pb-2 sm:pb-4">
        <div className="sm:w-40 bg--gray-100 py-1">
          <label className="text-xs text-blue-400 font-medium uppercase">Judul Proyek</label>
        </div>
        <div className="sm:flex-grow bg-red--100">
          <div className="input-container relative overflow-hidden rounded">
            <input 
              type="text" 
              autoFocus="true"
              autoComplete="false"
              autoCorrect="false"
              className={inputStyle}
            />
            <div className={inputUnderline} style={{ transition: 'width 300ms' }}></div>
          </div>
        </div>
      </div>
      {/* row */}
      <div className="bg-yellow--100 flex flex-col sm:flex-row sm:space-x-4 pb-2 sm:pb-4">
        <div className="sm:w-40 bg--gray-100 py-1">
          <label className="text-xs text-blue-400 font-medium uppercase">Deskripsi</label>
        </div>
        <div className="sm:flex-grow bg-red--100">
          <div className="input-container relative font-medium overflow-hidden rounded">
            <textarea 
              type="text" 
              rows="3"
              autoCorrect="false"
              className={`${inputStyle} h-auto -mb-1`}
              style={{ resize: 'none' }}
            ></textarea>
            <div className={inputUnderline} style={{ transition: 'width 300ms' }}></div>
          </div>
        </div>
      </div>
      {/* row */}
      <div className="bg-yellow--100 flex flex-col sm:flex-row sm:space-x-4 pb-2 sm:pb-4">
        <div className="sm:w-40 bg--gray-100 py-1">
          <label className="text-xs text-blue-400 font-medium uppercase">Tanggal kontrak</label>
        </div>
        <div className="sm:flex-grow bg-red--100">
          <div className="input-container w-52 relative overflow-hidden rounded">
            <input 
              type="date" 
              autoComplete="false"
              autoCorrect="false"
              className={`${inputStyle}`}
            />
            <div className={inputUnderline} style={{ transition: 'width 300ms' }}></div>
          </div>
        </div>
      </div>
      {/* row */}
      <div className="bg-yellow--100 flex flex-col sm:flex-row sm:space-x-4 pb-2 sm:pb-4">
        <div className="sm:w-40 bg--gray-100 py-1">
          <label className="text-xs text-blue-400 font-medium uppercase">Pilih klien</label>
        </div>
        <div className="sm:flex-grow bg-red--100">
          <div className="input-container w-52 relative overflow-hidden rounded">
            <select
              className={`${inputStyle} pr-9 truncate`}
            >
              <option>Pertama</option>
              <option>Kedua</option>
              <option>Yayasan Obor Indonesia</option>
              <option>Keempat</option>
            </select>
            <div className={inputUnderline} style={{ transition: 'width 300ms' }}></div>
          </div>
        </div>
      </div>

      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  </>
}

export default NewProject