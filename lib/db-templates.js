import { createRandomString } from "./utils"

/**
 * Create batch doc.
 * 
 * @param {*} id Batch ID
 * @param {*} pid Project ID
 * @param {*} date Batch date (yyyy-mm-dd)
 * @param {*} user Project admin
 * @returns 
 */
export function BatchTemplate(id, pid, date, user) {
  if (!id || !pid) return false

  // date = '2021-07-23'
  const jsDate = new Date(date)

  const y = jsDate.getFullYear()
  const m = jsDate.toLocaleString('default', {month: 'short'})
  const d = jsDate.getDate()
  const d1 = `${m} ${d} ${y} 07:00:00 GMT+0700 (WIB)`
  const d2 = `${m} ${d} ${y} 22:00:00 GMT+0700 (WIB)`
  const login1 = new Date(d1).toISOString() // Firs login
  const login2 = new Date(d2).toISOString() // Last login
  
  return {
    _id: id,
    pid: pid,
    title: "Default",
    token: createRandomString(),
    modules: [],
    tests: [],
    sims: [],
    order: 1,        //
    timing: "slot",     // "slot" | "date1" | "date2"
    testOpen: d1,
    testClose: d2,
    simDate: date,
    slot1: "08.00",
    slot2: "10.00",
    slot3: "13.00",
    slot4: "15.00",
    protected: true,
    disabled: false,
    creator: user.username,
    created: new Date().getTime(),
    updated: null,
  }
}