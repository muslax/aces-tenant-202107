// import { FolderIcon, IdentificationIcon } from '@heroicons/react/solid'
import useUsers from "hooks/useUsers"
import { useState } from 'react';
import { CogIcon, ExclamationCircleIcon, UserCircleIcon, KeyIcon, PencilAltIcon, TrashIcon, XIcon } from '@heroicons/react/solid';

import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";

import PageHeading from "./PageHeading";
import { ItemContainer } from "./ItemContainer"
import FixedOverlay from 'components/FixedOverlay';
import PageLoading from "components/PageLoading";

const Users = ({ user }) => {
  const { users, isError, isLoading, mutate: mutateUsers } = useUsers()

  const [modal, setModal] = useState(null);
  const [resetResponse, setResetResponse] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [toBeDeleted, setToBeDeleted] = useState(null)
  const [toBeDisabled, setToBeDisabled] = useState(null);
  const [toBeActivated, setToBeActivated] = useState(null)

  function canEdit(person) {
    return user.licenseOwner && user.username != person.username;
  }

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
    if (!toBeDisabled) return false;
    setModal('Resetting user...');

    const response = await fetchJson(APIROUTES.POST.RESET_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: toBeDisabled._id}),
    })

    setResetResponse(response);
    mutate();
    setToBeDisabled(null);
    setModal(null);
  }

  if (isLoading) return <PageLoading />

  function Icon({ person }) {
    return person.username == user.username
    ? <UserCircleIcon className="h-5 w-5 text-blue-500"/>
    : <UserCircleIcon className="h-5 w-5 text-gray-400"/>
  }

  const icon = <UserCircleIcon className="h-6 w-6 text-gray-600"/>;
  const iconSelf = <UserCircleIcon className="h-6 w-6 text-yellow-500"/>;

  return <>
    <PageHeading heading="Users" />

    <div className="rounded-md border border-blue-200 hover:border-blue-300 hover:shadow-sm">
      {users.map(person => (
        <div key={person._id} className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-4 border-b border-blue-200 last:border-none">
          <Icon person={person} />
          <div className="text-gray-600 font-medium">{person.fullname}</div>
          <div className="flex-grow flex items-center justify-end space-x-3 text-xs">
            {/* self */}
            {person.username == user.username && (
              <button className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-400">
                <KeyIcon className="w-4 h-4" />
                <span>Change password</span>
              </button>
            )}
            {user.licenseOwner && person.username != user.username && <>
              {!person.disabled && <>
                <button 
                  className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400">
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
                <button disabled
                  className="flex items-center space-x-1 text-gray-300">
                  <KeyIcon className="w-4 h-4" />
                  <span>Reset</span>
                </button>
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
  </>
}

export default Users

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


/*
<div className="flex flex-col space-y-2">
      {users.map(person => (
        <ItemContainer 
          key={person._id} 
          bg={person.username == user.username ? "bg-yellow-50 bg-opacity-20" : ""}
          icon={person.username == user.username ? iconSelf : icon}
        >
          <div className="flex">
            <div className="h-6 flex-grow text-base text-gray-600 font-semibold mb-1">{person.fullname}</div>
          </div>

          <div className=" text-gray-600">
            {person.email}
          </div>
          <div className="pt-2 pb-1">
            {person.username == user.username && (
              <button className="flex items-center space-x-1 text-xs text-yellow-500 hover:text-yellow-400">
                <KeyIcon className="w-4 h-4" />
                <span>Change password</span>
              </button>
            )}

            {user.licenseOwner && user.username !== person.username && (
              <div className="flex items-center space-x-3 text-xs">
                {!person.disabled && <>
                  <button 
                    className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400">
                    <KeyIcon className="w-4 h-4" />
                    <span>Reset password</span>
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
              </div>
            )}

            {!user.licenseOwner && user.username !== person.username && (
              <div className="flex items-center space-x-3 text-xs">
                {!person.disabled && <>
                  <button disabled className="flex items-center space-x-1 text-gray-300">
                    <KeyIcon className="w-4 h-4" />
                    <span>Reset password</span>
                  </button>
                  <button disabled className="flex items-center space-x-1 text-gray-300">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>Disable</span>
                  </button>
                </>}
                {person.disabled && <>
                  <button disabled className="flex items-center space-x-1 text-gray-300">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>Activate</span>
                  </button>
                </>}  
                <button disabled className="flex items-center space-x-1 text-gray-300">
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </ItemContainer>
      ))}
    </div>

*/