import { useEffect, useState } from "react"
import { mutate } from "swr"

import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import { generatePOSTData } from "lib/utils"

import PostModal from "components/PostModal"

const months = ("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec").split(" ")

const TestsInfo = ({ batch, mode, setMode }) => {
  const [date1, setDate1] = useState(batch.date1)
  const [date2, setDate2] = useState(batch.date2)
  const [login1, setLogin1] = useState(getWIBTime(batch.login1))
  const [login2, setLogin2] = useState(getWIBTime(batch.login2))
  const [order, setOrder] = useState(batch.order)
  const [token, setToken] = useState(batch.token)
  const [timing, setTiming] = useState(batch.timing)
  const [minDate2, setMinDate2] = useState(getMinDate2())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMinDate2(getMinDate2())
    if (date1 >= date2) setDate2(getMinDate2())
  }, [date1])

  async function saveTestConfig(e) {
    setSubmitting(true)

    await fetchJson(APIROUTES.POST.SAVE_TEST_CONFIG, generatePOSTData({
      id: batch._id,
      date1: date1,
      date2: date2,
      login1: generateWIBDateString(date1, login1),
      login2: generateWIBDateString(date2, login2),
      order: parseInt(order),
      token: token,
      timing: timing,
    }))

    mutate(`${APIROUTES.GET.BATCH}&bid=${batch._id}`)
    setSubmitting(false)
    setMode("reading")
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
    setDate1(batch.date1)
    setDate2(batch.date2)
    setLogin1(getWIBTime(batch.login1))
    setLogin2(getWIBTime(batch.login2))
    setOrder(batch.order)
    setToken(batch.token)
    setTiming(batch.timing)
    setMinDate2(getMinDate2())
  }

  function getMinDate2() {
    const d = new Date(new Date(date1).getTime() + 86400000)
    return d.toISOString().substr(0, 10)
  }

  function getDays() {
    const d1 = new Date(date1).getTime()
    const d2 = new Date(date2).getTime()
    return (d2 - d1 ) / 86400000 + 1
  }

  function getTiming() {
    if (timing == "slot") return "Sesuai jadwal"
    else if (timing == "date1") return "Sepanjang hari"
    else return "Sampai tangal..."
  }

  const readStyle = "flex items-center text-sm font-semibold w-44 h-8 leading-tight pl-2 pr-2 py-1 bg-green-50 border border-green-500 border-opacity-20"
  const editStyle = "text-sm font-semibold w-44 h-8 leading-tight pl-2 pr-2 py-1 bg-green-100 border border-transparent focus:bg-white focus:border-green-500 focus:border-opacity-60 focus:ring-0"

  return <>
    <div className="rounded-md border border-green-500 border-opacity-50 hover:border-opacity-80 hover:shadow-sm">
      {mode == "reading" && <>
        <InfoRow label="Tanggal tes:">
          <div className="">
            <div className={readStyle}>{date1}</div>
          </div>
        </InfoRow>
        <InfoRow label="Waktu tes*:">
          <div className="">
            <div className={readStyle}>{getTiming()}</div>
          </div>
        </InfoRow>
        {timing != "slot" && <>
          <InfoRow label="Login dibuka:">
            <div className="">
              <div className={readStyle}>{login1} WIB</div>
            </div>
          </InfoRow>
          <InfoRow label="Login terakhir:">
            <div className="">
              <div className={readStyle}>{login2} WIB</div>
            </div>
          </InfoRow>
        </>}
        <InfoRow label="Urutan tes:">
          <div className="">
            <div className={readStyle}>{order == 1 ? 'Urut' : 'Bebas'}</div>
          </div>
        </InfoRow>
        <InfoRow label="Token:">
          <div className="">
            <div className={readStyle}>{token}</div>
          </div>
        </InfoRow>
      </>}
      {mode == "editing" && <>
        <InfoRow label="Tanggal tes:">
          <div className="-my--1">
            <input
              type="date" 
              value={date1}
              className={editStyle}
              onChange={e => setDate1(e.target.value)}
            />
          </div>
        </InfoRow>
        <InfoRow label="Waktu tes*:">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={timing}
              className={editStyle}
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
              <option value="date2">Sampai tanggal ...</option>
            </select>
            {/*  */}
            {timing == "date2" && <>
              <input
                type="date"
                value={date2}
                min={minDate2}
                className={editStyle}
                onChange={e => setDate2(e.target.value)}
                />
              <span className="hidden sm:inline-flex items-center h-8">{`(${getDays()} hari)`}</span>
            </>}
          </div>
        </InfoRow>
        {timing != "slot" && <>
          <InfoRow label="Login dibuka:">
            <div className="-my--1">
              <input
                type="time" 
                value={login1}
                className={editStyle}
                onChange={e => setLogin1(e.target.value)}
              />
            </div>
          </InfoRow>
          <InfoRow label="Login terakhir:">
            <div className="-my--1">
              <input
                type="time" 
                value={login2}
                className={editStyle}
                onChange={e => setLogin2(e.target.value)}
              />
            </div>
          </InfoRow>
        </>}
        <InfoRow label="Urutan tes:">
          <div className="-my--1">
            <select
              type="date"
              value={order}
              className={editStyle}
              onChange={e => setOrder(e.target.value)}
            >
              <option value={1}>Urut</option>
              <option value={0}>Bebas</option>
            </select>
          </div>
        </InfoRow>
        <InfoRow label="Token:">
          <div className="-my--1">
            <input
              type="text"
              value={token}
              placeholder="min. 6 karakter"
              className={editStyle}
              onChange={e => setToken(e.target.value)}
            />
          </div>
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
                setMode("reading")
              }}
            >Cancel</button>
          </div>
        </InfoRow>
      </>}
    </div>
    {/* <pre>
      Date  1: {date1}    {getISOString(generateWIBDateString(date1, login1))}<br/>
      Date  2: {date2}    {getISOString(generateWIBDateString(date2 || date1, login2))}<br/>
      Login 1: {login1}  <br/>
      Login 2: {login2}  <br/>
      <br/>
      date1:  {date1}<br/>
      date2:  {date2}<br/>
      login1: {generateWIBDateString(date1, login1)}<br/>
      login2: {generateWIBDateString(date2, login2)}<br/>
      order:  {order}<br/>
      token:  {token}<br/>
      timing: {timing}<br/>
    </pre> */}
    
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