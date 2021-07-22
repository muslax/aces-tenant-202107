import { useState } from "react"
import router, { useRouter } from "next/router";
import Link from "next/link";
import { 
  ExclamationCircleIcon, 
  UserCircleIcon, 
  KeyIcon,
  PhotographIcon, 
  PlusCircleIcon,
  TrashIcon, 
  XIcon 
} from '@heroicons/react/solid';

import useLicense from "hooks/useLicense"
import useUsers from "hooks/useUsers"
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";

import PageHeading from "./PageHeading";
import FixedOverlay from 'components/FixedOverlay';
import PageLoading from "components/PageLoading"
import { generatePOSTData } from "lib/utils";

const Settings = ({ user }) => {
  const router = useRouter()
  const { license, isError: erro1, isLoading: loading1, mutate: mutateLicense } = useLicense()
  const { users, isError: error2, isLoading: loading2, mutate: mutateUsers } = useUsers()

  const [modal, setModal] = useState(null);
  const [resetResponse, setResetResponse] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [toBeReset, setToBeReset] = useState(null)
  const [toBeDeleted, setToBeDeleted] = useState(null)
  const [toBeDisabled, setToBeDisabled] = useState(null)
  const [toBeActivated, setToBeActivated] = useState(null)

  async function deleteUser() {
    await fetchJson(APIROUTES.POST.DELETE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: toBeDeleted._id}),
    })

    mutateUsers();
    setToBeDeleted(null);
  }

  async function disableUser() {
    await fetchJson(APIROUTES.POST.DISABLE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: toBeDisabled._id}),
    })

    mutateUsers();
    setToBeDisabled(null);
  }

  async function activateUser() {
    await fetchJson(APIROUTES.POST.ACTIVATE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: toBeActivated._id}),
    })

    mutateUsers();
    setToBeActivated(null);
  }

  async function resetUser() {
    const resp = await fetchJson(APIROUTES.POST.RESET_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: toBeReset._id}),
    })

    mutateUsers()
    setToBeReset(null)
    setResetResponse(resp)
  }

  function Icon({ person }) {
    return person.username == user.username
    ? <UserCircleIcon className="h-5 w-5 text-blue-500"/>
    : <UserCircleIcon className="h-5 w-5 text-gray-400"/>
  }

  if (loading1 || loading2) return <PageLoading />

return <>
    <div className="h-3"></div>
    <PageHeading heading="ACES License">
      {user.licenseOwner && (
        <button 
          className="group h-9 flex items-center rounded border text-blue-500 border-blue-300 hover:shadow-sm hover:border-blue-400 pl-2 pr-3"
          onClick={e => router.push('/upload-logo')}
        >
          <PhotographIcon className="w-5 h-5 text-yellow-400 group-hover:text-pink-400" />
          <span className="h-8 flex items-center font-semibold pl-2">Upload Logo</span>
        </button>
      )}
    </PageHeading>

    <div className="rounded-md border border-blue-200 hover:border-blue-300 hover:shadow-sm">
      <DataRow label="License ID" content={license._id} />
      <DataRow label="License Name" content={license.title} />
      <DataRow label="License Type" content={license.type} />
      <DataRow label="Contact" content={license.contact.fullname} />
      <DataRow label="Published" content={license.publishDate} />
    </div>

    <div className="h-8"></div>

    <PageHeading heading="License Users">
      {user.licenseOwner && (
        <button 
          className="group h-9 flex items-center rounded border text-blue-500 border-blue-300 hover:shadow-sm hover:border-blue-400 pl-2 pr-3"
          onClick={e => router.push('/new-user')}
        >
          <PlusCircleIcon className="w-5 h-5 text-yellow-400 group-hover:text-pink-400" />
          <span className="h-8 flex items-center font-semibold pl-2">Add User</span>
        </button>
      )}
    </PageHeading>

    <div className="rounded-md border border-blue-200 hover:border-blue-300 hover:shadow-sm">
      {users.map(person => (
        <div key={person._id} className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-4 border-b border-blue-200 last:border-none">
          <Icon person={person} />
          <div className={`${person.disabled ? 'text-gray-400' : ''} font-medium`}>{person.fullname}</div>
          <div className="flex-grow flex items-center justify-end space-x-3 text-xs">
            {/* self */}
            {person.username == user.username && (
              <button 
                className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-400"
                onClick={e => setShowPasswordDialog(true)}
              >
                <KeyIcon className="w-4 h-4" />
                <span>Change password</span>
              </button>
            )}
            {user.licenseOwner && person.username != user.username && <>
              {!person.disabled && <>
                <button 
                  className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400"
                  onClick={e => setToBeReset(person)}
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button 
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-400"
                  onClick={e => setToBeDisabled(person)}
                >
                  <ExclamationCircleIcon className="w-4 h-4" />
                  <span>Disable</span>
                </button>
              </>}
              {person.disabled && <>
                <button 
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-400"
                  onClick={e => setToBeActivated(person)}
                >
                  <ExclamationCircleIcon className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              </>}
              <button 
                className="flex items-center space-x-1 text-pink-500 hover:text-pink-400"
                onClick={e => setToBeDeleted(person)}
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>}
            {!user.licenseOwner && user.username !== person.username && <>
              <button disabled
                className="flex items-center space-x-1 text-gray-300">
                <KeyIcon className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button disabled
                className="flex items-center space-x-1 text-gray-300"
              >
                <ExclamationCircleIcon className="w-4 h-4" />
                <span>{person.disabled ? 'Activate' : 'Disable'}</span>
              </button>
              <button disabled
                className="flex items-center space-x-1 text-gray-300"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>}
          </div>
        </div>
      ))}
    </div>

    {toBeDeleted && <EditDialog 
      person={toBeDeleted}
      action="delete"
      onCancel={e => setToBeDeleted(null)}
      onOke={deleteUser}
    />}

    {toBeDisabled && <EditDialog 
      person={toBeDisabled}
      action="disable"
      onCancel={e => setToBeDisabled(null)}
      onOke={disableUser}
    />}

    {toBeActivated && <EditDialog 
      person={toBeActivated}
      action="activate"
      onCancel={e => setToBeActivated(null)}
      onOke={activateUser}
    />}

    {toBeReset && <EditDialog 
      person={toBeReset}
      action="reset password of"
      onCancel={e => setToBeReset(null)}
      onOke={resetUser}
    />}

    {resetResponse && <ResetResponse 
      response={resetResponse} 
      onClose={e => {setResetResponse(null)}}
    />}

    {showPasswordDialog && <ChangePasswordDialog 
      onClose={e => {setShowPasswordDialog(false)}}
    />}
    
    {/* <pre>LICENSE {JSON.stringify(license, null, 2)}</pre> */}
  </>
}

export default Settings

const DataRow = ({ label, content }) => {
  return (
    <div className="flex items-center px-5 py-3 border-b border-blue-200 last:border-none">
      <label className="w-32 sm:w-36 text-gray-500">
        {label || '[LABEL]'}:
      </label>
      <div className="flex-grow">
        <div className="truncate">
          {content}
        </div>
      </div>
    </div>
  )
}

const ChangePasswordDialog = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function isReady() {
    return oldPassword.length >= 4 && newPassword.length >= 5
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    // { oldPassword: oldPassword, newPassowrd: newPassowrd }

    const response = await fetchJson(
      APIROUTES.POST.CHANGE_PASSWORD,
      generatePOSTData({
        oldPassword: oldPassword, 
        newPassword: newPassword,
      })
    )

    if (response) {
      setSubmitting(false);
      if (response.ok) {
        setSuccess(true)
      } else {
        setErrorMsg(response.message)
        // setNewPassword('')
        // setOldPassword('')
      }
    }

  }

  const inputStyle = `peer relative w-full text-sm font--medium w-full h-8 px-2 pb-2 
  caret-blue-400 border border-gray-200 focus:border-blue-200 rounded bg-gray-50 focus:bg-blue-50 focus:bg-opacity-70 focus:ring-0`

  const inputUnderline = `absolute left-0 bottom-0 right-0 w-0 opacity-0
  border-b-2 border-blue-400 transition duration-150 ease-out linear
  peer-focus:w-full peer-focus:opacity-100 peer-focus:transition 
  peer-focus:origin-center peer-focus:duration-150 peer-focus:ease-in`

  return (
    <FixedOverlay>
      <div
        className="bg-white rounded shadow-md hover:shadow-lg p-1"
        style={{ width: '220px' }}
      >
        <div className="rounded-sm border hover:border-gray-300 pb-2">
          <div className="pl-3 flex items-center space-x-3 justify-end rounded-t p--1">
            {submitting && <div className="progress flex-grow h-1"></div>}
            <button 
              disabled={submitting}
              className="text-white rounded-bl-sm bg-gray-200 p-px text-center hover:text-gray-600"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Main */}
          <div className="px-3 pb-3">
            {success && <>
              <h3 className="font-bold my-2">Berhasil memperbarui password Anda</h3>
              <div className="text-center pt-2">
                <button 
                  className="rounded text-white font-semibold bg-green-500 hover:bg-green-400 px-5 py-1"
                  onClick={onClose}
                >OK</button>
              </div>
            </>}
            
            {!success && <div>
              <h3 className="font-bold my-2">Memperbarui password</h3>

              {errorMsg && <p className="text-xs text-red-600 mb-2">{errorMsg}</p>}

              <div className="relative rounded overflow-hidden mb-2">
                <label className="text-xs text-gray-500 uppercase">Password sekarang:</label>
                <input 
                  type="password"
                  disabled={submitting}
                  autoFocus={true}
                  className={inputStyle}
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
                <div className={inputUnderline} style={{ transition: 'width 150ms' }}></div>
              </div>

              <div className="relative rounded overflow-hidden mb-2">
                <label className="text-xs text-gray-500 uppercase">Password baru:</label>
                <input 
                  type="password"
                  placeholder="min. 6 karakter"
                  disabled={submitting}
                  className={inputStyle}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <div className={inputUnderline} style={{ transition: 'width 150ms' }}></div>
              </div>

              <div className="text-center pt-2">
                <button 
                  disabled={!isReady()}
                  className={`rounded text-white font-semibold bg-blue-500 hover:bg-blue-400 px-5 py-1
                  disabled:bg-gray-400`}
                  onClick={handleSubmit}
                >OK</button>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </FixedOverlay>
  )
}

const ResetResponse = ({ response, onClose }) => {
  return (
    <FixedOverlay>
      <div 
        className="bg-white rounded shadow-md hover:shadow-lg p-1"
        style={{ minWidth: '250px' }}
      >
        <div className="rounded-sm border hover:border-gray-300 pb-5">
          <div className="flex items-center justify-end rounded-t p--1">
            <button 
              className="text-white rounded-bl-sm bg-gray-200 p-px text-center hover:text-gray-600"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          {/*  */}
          <div className="px-5 pt-3 pb-3">
            <p className="mb-2">
              Reset password berhasil.
            </p>
            <table className="w-full">
              <tbody>
                <tr className="">
                  <td className="py-1">Fullname:</td>
                  <td className="p-1">{response.fullname}</td>
                </tr>
                <tr className="">
                  <td className="py-1">Username:</td>
                  <td className="p-1">{response.username}</td>
                </tr>
                <tr className="">
                  <td className="py-1">Password:</td>
                  <td className="p-1">{response.password}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FixedOverlay>
  )
}

const EditDialog = ({ person, action, onCancel, onOke }) => {
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
                onClick={onOke}
              >OK</button>
            </div>
          </div>
        </div>
      </div>
    </FixedOverlay>
  )
}