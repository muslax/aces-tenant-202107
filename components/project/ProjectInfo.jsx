import { useState } from "react"
import { mutate } from "swr"

import fetchJson from "lib/fetchJson"
import { APIROUTES } from "config/routes"
import { generatePOSTData } from "lib/utils"

import FixedOverlay from "components/FixedOverlay"

export default function ProjectInfo({ user, users, project, editing, setEditing }) {
  const [copy, setCopy] = useState(project)
  const [submitting, setSubmitting] = useState(false)

  async function updateProjectInfo(e) {
    setSubmitting(true)

    await fetchJson(APIROUTES.POST.UPDATE_PROJECT, generatePOSTData({
      id: project._id,
      title: copy.title,
      description: copy.description,
      contractDate: copy.contractDate,
      admin: copy.admin.username,
    }))

    mutate(`${APIROUTES.GET.PROJECT}&pid=${project._id}`)
    setSubmitting(false)
    setEditing(false)
  }

  const isAdmin = user.username == project.admin.username

  const inputStyle = "text-sm leading-tight px-2 py-1 rounded bg-gray-100 border-transparent hover:border-gray-300 hover:border-opacity-90 focus:bg-white focus:border-gray-400 focus:border-opacity-70 focus:ring-0 disabled:border-gray-200 disabled:text-gray-700 disabled:bg-gray-200"

  return <>
    <div className="rounded-md border border-green-500 border-opacity-50 hover:border-opacity-80 hover:shadow-sm">
      {editing && <>
        <InfoRow label="ID Proyek:" form>
          <input disabled
            type="text"
            value={copy._id}
            className={`w-auto h-8 ${inputStyle}`}
            onChange={e => setCopy(s => ({...s, contractDate: e.target.value}))}
          />
        </InfoRow>
        <InfoRow label="Judul:" form>
          <input disabled={!isAdmin || submitting}
            type="text"
            value={copy.title}
            autoFocus
            className={`w-full h-8 ${inputStyle}`}
            onChange={e => setCopy(s => ({...s, title: e.target.value}))}
          />
        </InfoRow>
        <InfoRow label="Deskripsi:" truncate={false} form>
          <textarea disabled={!isAdmin || submitting}
            value={copy.description}
            rows="3"
            className={`w-full ${inputStyle} -mb-1`}
            style={{ resize: 'none' }}
            onChange={e => setCopy(s => ({...s, description: e.target.value}))}
          ></textarea>
        </InfoRow>
        <InfoRow label="Tanggal Kontrak:" form>
          <input id={!isAdmin ? 'DATE-DISABLED' : ''}
            disabled={!isAdmin || submitting}
            type="date"
            value={copy.contractDate}
            className={`w-40 disabled:text-red-500 ${inputStyle}`}
            style={{ resize: 'none' }}
            onChange={e => setCopy(s => ({...s, contractDate: e.target.value}))}
          />
        </InfoRow>
        <InfoRow label="Admin:" form>
          {/* <input disabled
            type="text"
            value={copy.admin.fullname}
            className={`w-auto ${inputStyle}`}
            onChange={e => setCopy(s => ({...s, contractDate: e.target.value}))}
          /> */}
          <select disabled={!user.licenseOwner || submitting}
            value={copy.admin.username}
            className={`w-auto h-8 pr-12 ${inputStyle}`}
            onChange={e => setCopy(s => ({
              ...s, admin: {
                ...s.admin, username: e.target.value
              }
            }))}
          >
            {users.map(person => (
              <option key={person._id} value={person.username}>{person.fullname}</option>
            ))}
          </select>
        </InfoRow>
        <InfoRow label="">
          <div className="flex space-x-4">
            <div className="flex-grow">
              <button 
                className="rounded h-8 bg-green-500 hover:bg-opacity-80 text-white font-semibold px-10"
                onClick={updateProjectInfo}
              >Save</button>
            </div>
            <div className="">
              <button onClick={e => setEditing(false)} className="rounded h-8 border text-red-500 font-medium px-5">Cancel</button>
            </div>
          </div>
        </InfoRow>
      </>}
      {!editing && <>
        <InfoRow label="ID Proyek:">
          <span className="">{project._id}</span>
        </InfoRow>
        <InfoRow label="Judul:">
          <span className="font-bold">{project.title}</span>
        </InfoRow>
        <InfoRow label="Deskripsi:" truncate={false}>
          <p className="">{project.description}</p>
        </InfoRow>
        <InfoRow label="Tanggal Kontrak:">
          <span className="font-bold">{project.contractDate}</span>
        </InfoRow>
        <InfoRow label="Admin:">
          <span className="">{project.admin.fullname}</span>
        </InfoRow>
      </>}
    </div>
    
    {/* <pre>{JSON.stringify(copy, null, 2)}</pre> */}

    {submitting &&
      <FixedOverlay>
        <div className="w-2/5 rounded bg-white p-1 shadow-md">
          <div className="rounded-sm border p-2">
            <div className="progress border border-gray-400 h-2"></div>
          </div>
        </div>
      </FixedOverlay>
    }
    <style jsx>{`
    input[type="date"]#DATE-DISABLED {
      color:red;
    }
    `}</style>
  </>
}

function InfoRow({ children, label, form = false, truncate = true }) {
  return (
    <div className={`flex items-center px-4 ${form ? 'py-2' : 'py-3'} border-b border-green-500 border-opacity-50 last:border-none`}>
      <label className="flex-shrink-0 w-36 sm:w-40 text-gray-500">
        {label}
      </label>
      <div className="flex-grow">
        <div className={truncate ? 'truncate' : ''}>
          {children}
        </div>
      </div>
    </div>
  )
}
