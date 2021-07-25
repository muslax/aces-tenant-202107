import { useEffect, useState } from "react"
import Link from "next/link";
import { mutate } from "swr";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";

import useBatchPersonae from "hooks/useBatchPersonae"
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import { generatePOSTData } from "lib/utils";

import PageLoading from "components/project/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import NoPersonae from "./NoPersonae"
import PersonDetail from "./PersonDetail"
import FixedOverlay from "components/FixedOverlay"
import PostModal from "components/PostModal"

const prefetchFields='fullname,username,email,gender,birth,phone,group,nip,position,currentLevel,targetLevel';

const Personae = ({ user, project, batch, isLoading }) => {
  const isAdmin = user.username == project.admin.username
  const { 
    personae: personae, 
    isLoading: personaeLoading, 
    isError: personaeError, 
    mutate: mutatePersonae 
  } = useBatchPersonae(batch._id, prefetchFields)

  const [persons, setPersons] = useState([])
  const [form, setForm] = useState(false)
  const [rawNames, setRawNames] = useState("")
  const [viewStack, setViewStack] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [modal, setModal] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (personae) {
      const copy = [];
      let n = 1;
      personae.forEach(p => {
        copy.push({...p, order: n });
        n++;
      })

      setPersons(copy);
    }
  }, [personae])

  if (isLoading || personaeLoading) {
    return <PageLoading 
      project={project} 
      batch={batch} 
      title="ACES Persona" 
    />
  }

  if (persons.length == 0) {
    return <NoPersonae 
      project={project} 
      batch={batch}
      isAdmin={isAdmin} 
    />
  }

  function getList() {
    return persons.filter(person => person.fullname.toLowerCase().includes(filter));
  }

  function showRow(e, id) {
    if (!form) setViewStack(vs => ([...vs, id]));
  }

  function hideRow(e, id) {
    setViewStack(viewStack.filter(item => item !== id))
  }

  async function deletePersona(e) {
    const body = generatePOSTData({ id: toDelete._id });
    setToDelete(null);
    setModal('Deleting...');
    const res = await fetchJson(APIROUTES.POST.DELETE_PERSONA, body);
    if (res) {
      mutatePersonae();
      setModal(null);
    }
    mutate(`${APIROUTES.GET.PROJECT}&pid=${project._id}`);
  }

  async function saveNames(e) {
    const raws = rawNames.split("\n");
    const names = [];
    raws.forEach(r => { if (r.trim().length > 2) names.push(r.trim()) })

    if (names.length == 0) return;

    setModal('Processing...');

    const res = await fetchJson(APIROUTES.POST.ADD_NAMES, generatePOSTData({
      pid: project._id,
      bid: batch._id,
      tests: personae[0].tests, // Just take from first person
      sims: personae[0].sims,   //
      names: names,
    }))

    mutatePersonae();
    mutate(`${APIROUTES.GET.PROJECT}&pid=${project._id}`);
    setForm(false);
    setRawNames("");
    setModal(null);
  }

  return <>
    <Hero project={project} title="ACES Persona" batch={batch}>
      {isAdmin && 
        <Link href={`/projects/${project._id}/import-csv`}>
          <a
            disabled={form}
            className="project-button px-4"
          >Upload<span className="hidden xs:inline">&nbsp;CSV</span></a>
        </Link>
      }
    </Hero>

    <div className="">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow flex items-center border--r pr--4">
          <input
            type="text"
            disabled={form}
            value={filter}
            className={`text-sm w-full h-8 leading-tight pl-16 pr-3 rounded caret-green-500
            border-green-500 border-opacity-50 focus:bg-white focus:border-green-500 focus:border-opacity-70 focus:ring-green-100`}
            onChange={e => setFilter(e.target.value.toLowerCase())}
            onKeyDown={e => {
              if (e.keyCode === 27) setFilter("")
            }}
          />
          <div className="absolute top-0 left-0 text-xs text-gray-500 leading-none">
            <span className="flex items-center h-8 px-2 pt-px border-r border-green-500 border-opacity-50">Search:</span>
          </div>
          <button
            disabled={form}
            className="absolute top-1 right-2 pt-px text-gray-300 hover:text-green-600 focus:outline-none focus:ring-0"
            onClick={e => setFilter('')}
          >
            <XCircleIcon className="w-5 h-5 "/>
          </button>
        </div>
        <div className="flex space-x-3 text-xs">
        {isAdmin && <>
          <button
            className="project-button px-4"
            onClick={e => {
              if (!form) {
                setForm(true);
                setViewStack([]);
              }
            }}
          >Add<span className="hidden sm:inline">&nbsp;Names</span></button>
          {/* <Link href={`/projects/${project._id}/import-csv`}>
            <a
              disabled={form}
              className="project-button px-4"
            >Import<span className="hidden sm:inline">&nbsp;CSV</span></a>
          </Link> */}
        </>}
        {!isAdmin && <>
          <button
            className="project-button px-4 border-gray-300 text-gray-300"
            disabled
          >Add<span className="hidden sm:inline">&nbsp;Names</span></button>
          <button
            disabled={form}
            className="project-button px-4 border-gray-300 text-gray-300"
          >Import<span className="hidden sm:inline">&nbsp;CSV</span></button>
        </>}
        </div>
      </div>

      <hr className="mt-2 mb-4 border-yellow-500 border-opacity-50"/>

      

      <div className="border-b border-green-500 border-opacity-50 pb-4">
        {getList().length > 0 && (
          <span className="text-gray-500">
            Daftar nama dan ID atau nomor induk. Klik setiap baris untuk menampilkan atau mengedit.
          </span>
        )}
        {getList().length == 0 && (
          <span className="text-red-400">
            Tidak menemukan nama peserta dengan keyword di atas.
          </span>
        )}
      </div>
      <table className="w-full border--t">

        {getList().map((p, index) => (
        <tbody key={p._id}>
          {!viewStack.includes(p._id) && (
            <tr className="border-b border-green-500 border-opacity-30 hover:bg-green-50 hover:bg-opacity-30">
              <td onClick={e => showRow(e, p._id)} className="w-10 p-2 text-center">{p.order}</td>
              <td onClick={e => showRow(e, p._id)} className="p-2 whitespace-nowrap cursor-pointer">{p.fullname}</td>
              {/* <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer">{p.nip || <div className="text-centertext-gray-400">-</div>}</td> */}
              <td
                onClick={e => showRow(e, p._id)}
                className="w-20 sm:w-32 text-xs p-2 whitespace-nowrap cursor-pointer"
              >
                <div className="w-20 sm:w-32 text-gray-400 truncate">
                  {p.nip ? p.nip : '-'}
                </div>
              </td>
              <td className="w-10 px-2 py-0">
                <div className="flex items-center h-6 pl-2 pr-1 border-l">
                    <button
                      disabled={!isAdmin}
                      className={isAdmin ? 'text-gray-400 hover:text-red-500' : 'text-gray-200'}
                      onClick={e => setToDelete(p)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
              </td>
            </tr>
          )}

          {viewStack.includes(p._id) && <>
            <tr
              className="bg-yellow-50 bg-opacity-50 hover:bg-opacity-70 border-b border-yellow-100 border--opacity-80 cursor-pointer"
              onClick={e => hideRow(e, p._id)}
            >
              <td className="w-10 p-2 text-center">{p.order}</td>
              <td colSpan="3" className="p-2 font-semibold whitespace-nowrap">{p.fullname}</td>
            </tr>
            <tr className="border-b border-green-500 border-opacity-20 bg-yellow-50 bg-opacity-90 bg-gradient-to-b from-white">
              <td className="w-10 p-2 text-center">&nbsp;</td>
              <td colSpan="3" className="px-2 pt-2">
                <PersonDetail
                  person={p}
                  mutate={mutatePersonae}
                  callback={() => setViewStack(viewStack.filter(item => item !== p._id))}
                  setModal={setModal}
                  isAdmin={isAdmin}
                />
              </td>
            </tr>
          </>}
        </tbody>
      ))}
      </table>

      <br/><br/>

      {isAdmin && !form && (
        <div className="text-center">
          <button
            className="project-button px-4"
            onClick={e => {
              if (!form) {
                setForm(true);
                setViewStack([]);
              }
            }}
          >Add<span className="hidden sm:inline">&nbsp;Names</span></button>
        </div>
      )}

      {form && (
      <div className="mb-4">
        <p className="font--light mb-1">
          Masukkan satu atau lebih nama lengkap.
          Setiap baris mewakili satu nama.
        </p>
        <textarea
          rows={4}
          autoFocus
          value={rawNames}
          onChange={e => setRawNames(e.target.value)}
          className={`w-full rounded border border-gray-300 text-sm px-3 py-2
          border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100
          `}
        ></textarea>
        <div className="pt-2 flex items-center justify-center space-x-3">
          <button
            className={`rounded text-xs font-bold text-white px-5 h-8
            bg-green-500 hover:bg-green-600 focus:border--blue-300 focus:outline-none
            focus:ring-1 focus:ring-offset-1 focus:ring-green-400`}
            onClick={saveNames}
          >Save Names</button>
          <button
            className={`rounded text-xs font-medium text-gray-500 hover:text-red-400 px-5 h-8
          border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-none`}
          onClick={e => setForm(false)}
          >Cancel</button>
        </div>
      </div>
      )}

      

      {/* <pre>{JSON.stringify(currentBatch, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(viewStack, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(personae[0], null, 2)}</pre> */}

      {modal && <PostModal message={modal} />}

      {toDelete && (
        <FixedOverlay>
          <div className="w-3/5 sm:w-80 rounded bg-yellow-200 border border-white shadow-md">
            <div className="flex items-center space-x-3 rounded-t bg--red-300 pl-3 pr-2 py-1">
              <div className="flex-grow">
                Delete {toDelete.fullname}?
              </div>
              <button className="" onClick={e => setToDelete(null)}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-b bg-gray-50 border-t border-yellow-300 px-5 py-10 text-center">
              <button
                className="rounded border border-gray-300 hover:border-gray-400 px-5 py-2"
                onClick={deletePersona}
              >OK, Delete</button>
            </div>
          </div>
        </FixedOverlay>
      )}
    </div>

    {/* <pre>{JSON.stringify(persons, null, 2)}</pre> */}
  </>
}

export default Personae