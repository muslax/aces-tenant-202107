import { useState } from "react";

import { APIROUTES } from "config/routes";
import fetchJson from "lib/fetchJson";
import { generatePOSTData } from "lib/utils";

const PersonDetail = ({ person, mutate, setModal, callback, isAdmin }) => {
  const [personData, setPersonData] = useState({
    id: person._id,
    fullname: person.fullname,
    gender: person.gender,
    birth: person.birth,
    email: person.email,
    nip: person.nip,
    position: person.position,
    currentLevel: person.currentLevel,
    targetLevel: person.targetLevel,
  })

  const inputClass = `text-xs w-full rounded border-yellow-400 border-opacity-50 h-7 px-2 py-0
  hover:border-opacity-80 focus:border-yellow-400 focus:border-opacity-100
  focus:ring-yellow-100 focus:ring-2`;

  async function updatePerson(e) {
    setModal('Updating...')

    const res = await fetchJson(
      APIROUTES.POST.UPDATE_PERSONA,
      generatePOSTData(personData)
    )

    if (res) {
      mutate();
      setModal(null);
      callback();
    }
  }

  return <>
    <div className="pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 py-1">
        <table className="w-full text-xs">
          <tbody>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Nama lengkap:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="fullname"
                  onChange={e => setPersonData(p => ({...p, fullname: e.target.value}))}
                  defaultValue={personData.fullname}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Jenis kelamin:</td>
              <td className="p-1">
                <select
                  className={`text-xs w-full rounded border-yellow-400 border-opacity-50 h-7 px-2 py-0
                  hover:border-opacity-80 focus:border-yellow-400 focus:border-opacity-100
                  focus:ring-yellow-100 focus:ring-2`}
                  defaultValue={personData.gender}
                  name="gender"
                  onChange={e => setPersonData(p => ({...p, gender: e.target.value}))}
                >
                  <option>- Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Tanggal lahir:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="birth"
                  onChange={e => setPersonData(p => ({...p, birth: e.target.value}))}
                  defaultValue={personData.birth}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Email:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="email"
                  onChange={e => setPersonData(p => ({...p, email: e.target.value}))}
                  defaultValue={personData.email}
                  className={inputClass}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full text-xs">
          <tbody>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">NIP / NIK:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="nip"
                  onChange={e => setPersonData(p => ({...p, nip: e.target.value}))}
                  defaultValue={personData.nip}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Jabatan:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="position"
                  onChange={e => setPersonData(p => ({...p, position: e.target.value}))}
                  defaultValue={personData.position}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Level sekarang:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="currentLevel"
                  onChange={e => setPersonData(p => ({...p, currentLevel: e.target.value}))}
                  defaultValue={personData.currentLevel}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Level target:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="targetLevel"
                  onChange={e => setPersonData(p => ({...p, targetLevel: e.target.value}))}
                  defaultValue={personData.targetLevel}
                  className={inputClass}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-span-1 md:col-span-2 text-center border--t  pt-3 pb-4">
        <button
          disabled={!isAdmin}
          className={`rounded-sm ${isAdmin ? 'bg-green-500 hover:bg-opacity-80 active:bg-green-600' : 'border border-yellow-200 text-yellow-300'} text-white h-7 px-5 text-xs font-bold`}
          onClick={updatePerson}
        >Save</button>
      </div>
    </div>
  </>
}

export default PersonDetail
