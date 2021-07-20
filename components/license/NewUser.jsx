import { useRouter } from "next/router"
import { useState } from "react"
import { mutate } from "swr"

import { XIcon } from "@heroicons/react/outline"

import { APIROUTES, ROUTES } from "config/routes"
import { generatePOSTData, validateEmail } from "lib/utils"
import fetchJson from "lib/fetchJson"

import NotAuthorized from "components/NotAuthorized"

const NewUser = ({ user }) => {
  const router = useRouter()
  
  const [submitting, setSubmitting] = useState(false)
  const [createdUser, setCreatedUser] = useState(null)

  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = async (e) => {
    setSubmitting(true);

    const url = APIROUTES.POST.NEW_USER;
    const response = await fetchJson(url, generatePOSTData({
      fullname: fullname,
        username: username,
        email: email
    }))

    mutate(APIROUTES.GET.USERS)
    setSubmitting(false)
    router.push(ROUTES.Users)
  }

  const cancel = (e) => {
    router.push(ROUTES.Users)
  } 

  const isReady = () => {
    return fullname.length > 2
    && validateEmail(email)
    && username.length > 5
  }

  if (!user.licenseOwner) return <NotAuthorized user={user} sendBackUrl={ROUTES.Users} />

  const inputStyle = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-gray-200 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  const inputError = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-red-300 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  return <>
    <div className="flex h-16 pt-1 items-center border-b border-blue-200">
      <h2 className="flex-grow text-xl text-gray-400 font-bold my-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-400">
          Add New User
        </span>
      </h2>
      <button 
        disabled={submitting}
        onClick={cancel} 
        className="rounded-sm text-gray-500 hover:text-red-600 disabled:text-gray-300"
      >
        <XIcon className="w-7 h-7" />
      </button>
    </div>

    {/* Message */}
    <p className={`py-3 ${submitting ? 'text-center text-pink-600 font-bold' : 'text-gray-500'}`}>
      {!submitting && <span>
        Judul proyek dan tanggal kontrak harus diisi. Untuk klien baru,
        nama perusahaan/lembaga dan kota harus diisi.
      </span>}
      {submitting && <span>
        Mohon tunggu...
      </span>}
    </p>
    <div className={`${submitting ? 'progress' : ''} h-2`}></div>

    <div className="max-w-2xl mx-auto py-3">
      <div className="relative py-5">
        {/* Fullname */}
        <FormRow label="Nama lengkap" width="">
          <input 
            type="text" 
            value={fullname}
            placeholder="min. 3 karakter"
            disabled={submitting}
            autoFocus="true"
            autoComplete="false"
            autoCorrect="false"
            className={`${inputStyle}`}
            onChange={e => setFullname(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setFullname(val)
              if (val.length < 3) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        {/* Email */}
        <FormRow label="Email" width="">
          <input 
            type="text" 
            value={email}
            disabled={submitting}
            autoComplete="false"
            autoCorrect="false"
            className={`${inputStyle}`}
            onChange={e => setEmail(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setEmail(val)
              if (!validateEmail(val)) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        {/* Username */}
        <FormRow label="Username" width="w-52">
          <input 
            type="text" 
            value={username}
            placeholder="min. 6 karakter"
            disabled={submitting}
            autoComplete="false"
            autoCorrect="false"
            className={`${inputStyle}`}
            onChange={e => setUsername(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setUsername(val)
              if (val.length == 0) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        {/* Button */}
        <FormRow label="" width="" forButton>
          <div className="p-2 -mx-2">
            <button 
              disabled={!isReady()}
              className={`text-white font-bold px-10 py-2
              focus:outline-none 
              focus:ring-1 focus:ring-offset-2 focus:ring-red-400
              rounded border border-transparent disabled:border-gray-200
              disabled:text-gray-400 disabled:bg-white
              bg-blue-400 hover:bg-blue-500 hover:bg-opacity-80`}
              onClick={handleSubmit}
            >Save</button>
          </div>
        </FormRow>

        {submitting && (
          <div onClick={e => setSubmitting(false)}
          className="absolute flex items-center justify-center bg-white bg-opacity-20 top-0 left-0 right-0 bottom-0"></div>
        )}
      </div>
    </div>
  </>
}

export default NewUser

const FormRow = ({ label, width, forButton, children }) => {
  const inputUnderline = `absolute left-0 bottom-0 right-0 w-0 opacity-0
  border-b-2 border-blue-400 transition duration-150 ease-out linear
  peer-focus:w-full peer-focus:opacity-100 peer-focus:transition 
  peer-focus:origin-center peer-focus:duration-150 peer-focus:ease-in`

  return <>
    {/* row */}
    <div className="flex flex-col sm:flex-row sm:space-x-4 pb-2 sm:pb-4">
      <div className="sm:w-40 py-1">
        <label className="text-xs text-blue-400 font-medium uppercase">
          {label}
        </label>
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