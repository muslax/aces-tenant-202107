import { useEffect, useState } from "react"
import { mutate } from "swr"

import { PencilAltIcon } from "@heroicons/react/outline"

import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import { generatePOSTData } from "lib/utils"

import PostModal from "components/PostModal"
import Subhead from "components/project/Subhead"

const months = ("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec").split(" ")

const TestsInfo = ({ batch, isAdmin }) => {
  const [order, setOrder] = useState(batch.order)
  const [token, setToken] = useState(batch.token)
  const [timing, setTiming] = useState(batch.timing)
  
  const [simDate, setSimDate] = useState(batch.simDate)
  const [date1, setDate1] = useState(extractDate(batch.testOpen))
  const [date2, setDate2] = useState(extractDate(batch.testClose))
  const [time1, setTime1] = useState(extractWIBTime(batch.testOpen))
  const [time2, setTime2] = useState(extractWIBTime(batch.testClose))

  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    if (timing == "slot" || timing == "date1") {
      setDate2(date1)
    } else {
      setDate2(getMinDate2())
    }
  }, [date1, timing])

  async function saveTestConfig(e) {
    setSubmitting(true)

    await fetchJson(APIROUTES.POST.SAVE_TEST_CONFIG, generatePOSTData({
      id: batch._id,
      token: token,
      timing: timing,
      order: parseInt(order),
      testOpen: generateWIBDateString(date1, time1),
      testClose: generateWIBDateString(date2, time2),
      simDate: simDate,
    }))

    mutate(`${APIROUTES.GET.BATCH}&bid=${batch._id}`)
    setSubmitting(false)
    setEditing(false)
  }

  function extractDate(dateStr) {
    const d = new Date(dateStr)
    return d.toISOString().substr(0, 10)
  }

  function extractWIBTime(dateStr) {
    const dt = new Date(dateStr)
    const idTime = dt.toLocaleString("id-ID", {timeZone: "Asia/Jakarta"}) // "30/7/2021 22.00.00"
    return idTime.split(" ")[1].substr(0, 5).replace(".", ":")
  }

  // Return like this "Jul 30 2021 09:30:00 GMT+0700 (WIB)"
  function generateWIBDateString(date, time) {
    const tokens = date.split("-")
    const month = months[parseInt(tokens[1]) - 1]
    return `${month} ${tokens[2]} ${tokens[0]} ${time}:00 GMT+0700 (WIB)`
  }

  // 22:00
  function getWIBTime(date) {
    const dt = new Date(date)
    const idTime = dt.toLocaleString("id-ID", {timeZone: "Asia/Jakarta"}) // "30/7/2021 22.00.00"
    return idTime.split(" ")[1].substr(0, 5).replace(".", ":")
  }

  function getISOString(dtString) {
    return new Date(dtString).toISOString()
  }

  function reset() {
    setOrder(batch.order)
    setToken(batch.token)
    setTiming(batch.timing)
    setSimDate(batch.simDate)
    setDate1(extractDate(batch.testOpen))
    setDate2(extractDate(batch.testClose))
    setTime1(extractWIBTime(batch.testOpen))
    setTime2(extractWIBTime(batch.testClose))
  }

  function getMinDate2() {
    const t = new Date(date1).getTime() + 86400000
    const d = new Date(t)
    return d.toISOString().substr(0, 10)
  }

  function getTiming() {
    if (timing == "slot") return "Sesuai jadwal"
    else if (timing == "date1") return "Sepanjang hari"
    else return "Lebih dari 1 hari"
  }

  const readStyle = "flex items-center text-sm font-semibold w-44 h-8 leading-tight pl-2 pr-2 py-1 bg-green-50 border border-green-500 border-opacity-20"
  const editStyle = "text-sm font-semibold w-44 h-8 leading-tight pl-2 pr-2 py-1 bg-green-100 border border-transparent focus:bg-white focus:border-green-500 focus:border-opacity-60 focus:ring-0"

  return <>
    <Subhead title="Token, Tanggal & Waktu">
      <div className="pr-2">
      {isAdmin && batch.tests.length > 0 && !editing && (
        <button 
          className="group text-green-500 hover:text-green-600 flex items-center space-x-1 h--7"
          onClick={e => setEditing(true)}
        >
          <PencilAltIcon className="w-5 h-5" /> 
          <span className="">Edit</span>
        </button>
      )}
      </div>
    </Subhead>
    
    <hr className="h-2 border-none" />

    {!editing && (
    <div className="rounded-md border border-green-500 border-opacity-50 hover:border-opacity-80 hover:shadow-sm">
      <InfoRow label="Token:">
          <div className={readStyle}>{token}</div>
      </InfoRow>
      <InfoRow label="Urutan tes:">
        <div className={readStyle}>{order == 1 ? 'Urut' : 'Bebas'}</div>
      </InfoRow>
      <InfoRow label="Waktu tes:">
        <div className={readStyle}>{getTiming()}</div>
      </InfoRow>
      <InfoRow label="Mulai:">
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
          <div className={readStyle}>
            {date1}
          </div>
          <div className={readStyle}>
            {time1} WIB
          </div>
        </div>
      </InfoRow>
      <InfoRow label="Sampai:">
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
          <div className={readStyle}>
            {date2}
          </div>
          <div className={readStyle}>
            {time2} WIB
          </div>
        </div>
      </InfoRow>
      <InfoRow label="Temumuka:">
        <div className={readStyle}>
          {simDate}
        </div>
      </InfoRow>
    </div>
    )}

    {editing && (
    <div className="rounded-md border border-green-500 border-opacity-50 hover:border-opacity-80 hover:shadow-sm">
      <InfoRow label="Token:">
        <input
          type="text" readOnly
          value={token}
          placeholder="min. 6 karakter"
          className={editStyle}
          onChange={e => setToken(e.target.value)}
        />
      </InfoRow>
      <InfoRow label="Urutan tes:">
        <select
          value={order} 
          className={editStyle}
          onChange={e => setOrder(e.target.value)}
        >
          <option value={1}>Urut</option>
          <option value={0}>Bebas</option>
        </select>
      </InfoRow>
      <InfoRow label="Waktu tes:">
        <select value={timing} className={editStyle}
          onChange={e => {
            const v = e.target.value
            setTiming(v)
            if (v == "slot" || v == "date1") {
              setDate2(date1)
            } else {
              setDate2(getMinDate2())
              e.target.blur()
            }
          }}
        >
          <option value="slot">Sesuai jadwal</option>
          <option value="date1">Sepanjang hari</option>
          <option value="date2">Lebih dari 1 hari</option>
        </select>
      </InfoRow>
      <InfoRow label="Mulai:">
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
          <input 
            type="date" 
            value={date1} 
            className={editStyle}
            onChange={e => setDate1(e.target.value)}
          />
          <input 
            type="time" value={time1} 
            className={editStyle}
            onChange={e => setTime1(e.target.value)}
          />
        </div>
      </InfoRow>
      <InfoRow label="Sampai:">
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
          {timing == "date2" && (<input 
            type="date" disabled={timing == "slot" || timing == "date1"}
            value={date2} 
            className={editStyle}
            onChange={e => setDate2(e.target.value)}
          />)}
          {timing != "date2" && (<div className={readStyle}>&nbsp;{date2}</div>)}
          <input
            type="time" 
            value={time2} 
            className={`${editStyle} disabled:text-blue-500`}
            onChange={e => setTime2(e.target.value)}
          />
        </div>
      </InfoRow>
      <InfoRow label="Temumuka:">
        <input 
          type="date" value={simDate} 
          className={editStyle}
          onChange={e => setSimDate(e.target.value)}
        />
      </InfoRow>
      <InfoRow>
        <div className="w-24 xs:w-28 sm:w-32"></div>
        <div className="flex-grow flex space-x-4 py-1">
          <button
            className={`rounded text-sm font-medium text-white px-6 h-8
            bg-green-500 hover:bg-green-600 focus:border--blue-300 focus:outline-none
            focus:ring-1 focus:ring-offset-1 focus:ring-green-400`}
            onClick={saveTestConfig}
          >Save</button>
          <button
            className={`rounded text-sm font-medium text-red-400 px-4 h-8
            border border-gray-300 focus:outline-none
            focus:ring-1 focus:ring-offset-1 focus:ring-green-400`}
            onClick={e => {
              reset()
              setEditing(false)
            }}
          >Cancel</button>
        </div>
      </InfoRow>
    </div>
    )}
    
    {submitting && <PostModal />}
  </>
}

export default TestsInfo

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center h--12 px-4 py-2 border-b border-green-500 border-opacity-50 last:border-none">
      <label className="w-24 xs:w-28 sm:w-32 text-gray-500">
        {label}
      </label>
      <div className="flex-grow">
        <div className="truncate-">
          {children}
        </div>
      </div>
    </div>
  )
}
