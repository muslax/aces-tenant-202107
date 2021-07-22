import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { XIcon } from "@heroicons/react/outline"

import { APIROUTES, ROUTES } from "config/routes"
import useClients from "hooks/useClients"
import fetchJson from "lib/fetchJson"
import { generatePOSTData } from "lib/utils"
import { mutate } from "swr"
import NotAuthorized from "components/NotAuthorized"

const NewProject = ({ user }) => {
  const router = useRouter()
  const { clients, isLoading } = useClients()

  const [options, setOptions] = useState([{
    _id: '',
    name: '- Loading...',
    address: '',
    city: ''
  }])
  const [selected, setSelected] = useState(options[0])
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [fullTitle, setFullTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contractDate, setContractDate] = useState('')

  const [cid, setClientId] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  useEffect(() => {
    if (!clients) return;

    let array = [{
      _id: '',
      name: '- New Client',
      address: '',
      city: ''
    }];
    clients.forEach(c => array.push({
      _id: c._id,
      name: c.name,
      address: c.address,
      city: c.city,
    }));
    setOptions(array);
    setSelected(array[0]);

    return () => {}
  }, [clients])

  useEffect(() => {
    setClientId(selected._id);
    setClientName(selected._id ? selected.name : '');
    setClientCity(selected.city);
    setClientAddress(selected.address);

    return () => {}
  }, [selected])

  const cancel = (e) => {
    router.push(ROUTES.Dashboard)
  } 

  const isReady = () => {
    return title.length > 10 && contractDate && clientName && clientCity
  }

  const handleSubmit = async (e) => {
    setSubmitting(true);

    const url = cid
      ? APIROUTES.POST.SAVE_CLIENT_PROJECT
      : APIROUTES.POST.SAVE_PROJECT

    await fetchJson(url, generatePOSTData({
      status: null,
      batchMode: 'multiple',
      title: title,
      fullTitle: title, // fullTitle,
      description: description,
      contractDate: contractDate,
      contacts: [],
      cid: cid,
      clientName: clientName,
      clientCity: clientCity,
      clientAddress: clientAddress,
    }))

    mutate(APIROUTES.GET.PROJECTS)
    setSubmitting(false)
    router.push(ROUTES.Dashboard)
  }

  // if (!user.licenseOwner) return <NotAuthorized user={user} sendBackUrl={ROUTES.Dashboard} />

  const inputStyle = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-gray-200 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  const inputError = `peer relative text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-red-300 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`


  return <>
    <div className="flex h-16 pt-1 items-center border-b border-blue-200">
      <h2 className="flex-grow text-xl text-gray-400 font-bold my-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-400">
          New ACES Project
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
        {/* Title */}
        <FormRow label="Judul proyek" width="">
          <input 
            type="text" 
            value={title}
            disabled={submitting}
            autoFocus={true}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setTitle(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setTitle(val)
              if (val.length == 0) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        {/* Description */}
        <FormRow label="Deskripsi" width="">
          <textarea 
            disabled={submitting}
            value={description}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle} h-auto -mb-1`}
            style={{ resize: 'none' }}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </FormRow>
        {/* Kontrak */}
        <FormRow label="Tanggal kontrak" width="w-52">
          <input 
            type="date" 
            value={contractDate}
            disabled={submitting}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setContractDate(e.target.value)}
            onBlur={e => {
              const val = e.target.value
              setContractDate(val)
              if (val.length == 0) {
                e.currentTarget.className = inputError
              } else {
                e.currentTarget.className = inputStyle
              }
            }}
          />
        </FormRow>
        {/* Klien */}
        <FormRow label="Pilih klien" width="">
          <select
            disabled={submitting}
            className={`${inputStyle} pr-9 truncate`}
            onChange={e => {
              setSelected(options.filter(c => c._id == e.target.value)[0])
              if (e.target.value.length > 0) {
                document.querySelectorAll('.client').forEach(item => item.className = `client ${inputStyle}`)
              }
            }}
          >
            {options.map(c => (
              <option key={c.name} value={c._id}>{c.name}</option>
            ))}
          </select>
        </FormRow>
        {/* Organisasi */}
        <FormRow label="Perusahaan / Lembaga" width="">
          <input 
            type="text" 
            disabled={submitting || selected._id != ''}
            value={clientName}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setClientName(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setClientName(val)
              if (val.length == 0) {
                e.currentTarget.className = `client ${inputError}`
              } else {
                e.currentTarget.className = `client ${inputStyle}`
              }
            }}
          />
        </FormRow>
        {/* Alamat */}
        <FormRow label="Alamat" width="">
          <input 
            type="text" 
            disabled={submitting || selected._id != ''}
            value={clientAddress}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setClientAddress(e.target.value)}
          />
        </FormRow>
        {/* Kota */}
        <FormRow label="Kota" width="">
          <input 
            type="text" 
            disabled={submitting || selected._id != ''}
            value={clientCity}
            autoComplete={false}
            autoCorrect={false}
            className={`${inputStyle}`}
            onChange={e => setClientCity(e.target.value)}
            onBlur={e => {
              const val = e.target.value.trim()
              setClientCity(val)
              if (val.length == 0) {
                e.currentTarget.className = `client ${inputError}`
              } else {
                e.currentTarget.className = `client ${inputStyle}`
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
          <div
          className="absolute flex items-center justify-center bg-white bg-opacity-20 top-0 left-0 right-0 bottom-0"></div>
        )}
      </div>

      {/* <pre>
        JUDUL:{title} KONTRAK:{contractDate}<br/>
        CID: {cid}<br/>
        ORG:{clientName} ADDR:{clientAddress} CITY:{clientCity}
      </pre> */}
      {/* <pre>{JSON.stringify(clients, null, 2)}</pre> */}
      
      {/* <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  </>
}

export default NewProject

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
