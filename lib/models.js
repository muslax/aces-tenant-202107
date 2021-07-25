import { createRandomString } from "./utils"

// d = new Date("Aug 2 2021 05:00:01 GMT+0700 (WIB)")
// > Mon Aug 02 2021 05:00:01 GMT+0700 (WIB)
// d.toISOString()
// > "2021-08-01T22:00:01.000Z"
// dd.toLocaleString('default', {month: 'short'})

// > ds = new Date("Jan 3 2021 05:00:01 GMT+0700 (WIB)")
// < Sun Jan 03 2021 05:00:01 GMT+0700 (WIB)

export function BatchTemplate(id, pid, date, user) {
  if (!id || !pid) return false

  const y = date.getFullYear()
  const m = date.toLocaleString('default', {month: 'short'})
  const d = date.getDate()
  const d1 = `${m} ${d} ${y} 07:00:00 GMT+0700 (WIB)`
  const d2 = `${m} ${d} ${y} 22:00:00 GMT+0700 (WIB)`
  const login1 = new Date(d1).toISOString()
  const login2 = new Date(d2).toISOString()
  
  return {
    _id: id,
    pid: pid,
    title: "Default",
    token: createRandomString(),
    modules: [],
    tests: [],
    sims: [],
    order: true,        //
    timing: "slot",     // "slot" | "date1" | "date2"
    date1: date,
    date2: null,        // Desfaul. Not null if and only if timing == "date2"
    login1: login1,     // Login open
    login2: login2,     // Last accepted login
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


BATCH = {
  "_id": "60e4e3276eb73aa16f3cb68e",
  "pid": "60f252beca3b9cc32773d885",
  "title": "Lumbir Honda Brio DX",
  "token": "serumah",
  "modules": [],
  "tests": [],            /* ID */ 
  "sims": [],             /* ID */ 
  "order": true,
  "timing": "slot",       /* slot|oneday|multidays */ 
  "date1": "2021-07-23",
  "date2": "2021-07-24",  /* null | datestr */ 
  "time1": "1625613095254",  /* ISO string date: test open */ 
  "time2": "1625613095254",  /* ISO string date: test close */ 
  "slot1": "08.00",
  "slot2": "10.00",
  "slot3": "13.00",
  "slot4": "15.00",
  "protected": true,
  "disabled": false,
  "creator": "lidias",
  "created": 1625613095254,
  "updated": 1626846911978
}

GROUP = {
  _id: '6081b509f477883e2c26b2f8',
  batchId: '6081b155f477883e2c26b2ee',
  label: "B",
  persons: [
    '60996c5cd01b480b0232d4dc',
    '60996c5cd01b480b0232d4dc',
    '60996c5cd01b480b0232d4dc',
    '60996c5cd01b480b0232d4dc',
    '60996c5cd01b480b0232d4dc',
  ],
  slot1 : {
    type: "online",
    t1: 1625529809100,
    t2: 1625529809100,
  },
  slot2 : null,
  slot3 : {
    type: "interview",
  },
  slot4 : {
    type: "discussion",
  },
  schedules: [
    {
      type: 'selftest',
      mode: '',
      order: true,
      open: 1620675400025,
      duration: 900000, // in milliseconds
    },
    {
      type: 'discussion',
      start: 1620675400025,
      duration: 900000,
      experts: [...exp],
    },
    {
      type: 'interview',
      start: 1620675400025,
      duration: 900000,
      experts: [...exp],
    },
  ],
}

PERSONA = {
  "_id": "6...bef1",
  "lid": "6...2ff6",
  "pid": "6...4dc7",
  "bid": "6...b68e",
  "disabled": false,
  "fullname": "Deborah Jaka Wasis",
  // etc
  "group": "666...2ffa",
  "tests": [
    "608b...",
    "608b...",
    "608e..."
  ],
  "sims": [
    "602...",
    "602..."
  ],
  "workingOn": null,
  "xfpwd": "jvugah",
  "updated": null
}


sample_batches = [
  {
    "_id": "60e39dd1b984bc479cbd4dc8",
    "pid": "60f252beca3b9cc32773d885",
    "title": "Lumbir Suzuki",
    "token": null,
    "modules": [
      "608b268d5959bf263a6eccdf",
      "608b29105959bf263a6ecce0",
      "608b35325959bf263a6ecce3",
      "6026c27f985b1417b005d374",
      "6026c27f985b1417b005d375"
    ],
    "order": "0",
    "timing": "date1",
    "date1": "2021-07-06",
    "date2": null,
    "slot1": "08.00",
    "slot2": "10.00",
    "slot3": "13.00",
    "slot4": "15.00",
    "protected": true,
    "disabled": false,
    "creator": "system",
    "created": 1625529809100,
    "updated": 1626246720569
  },
  {
    "_id": "60e39e1db984bc479cbd4dca",
    "pid": "60e39e1db984bc479cbd4dc9",
    "title": "Batch Wasaret",
    "token": null,
    "modules": [
      "608b268d5959bf263a6eccdf",
      "608b29105959bf263a6ecce0",
      "608b35325959bf263a6ecce3",
      "6026c27f985b1417b005d375"
    ],
    "order": 1,
    "timing": "slot",
    "date1": "2021-07-16",
    "date2": null,
    "slot1": "08.00",
    "slot2": "10.00",
    "slot3": "13.00",
    "slot4": "15.00",
    "protected": true,
    "disabled": false,
    "creator": "system",
    "created": 1625529885635,
    "updated": 1626123094038
  },
  {
    "_id": "60e4e3276eb73aa16f3cb68e",
    "pid": "60f252beca3b9cc32773d885",
    "title": "Lumbir Honda 2020",
    "token": "serumah",
    "modules": [
      "608b268d5959bf263a6eccdf",
      "608b29105959bf263a6ecce0",
      "608b35325959bf263a6ecce3",
      "6026c27f985b1417b005d374",
      "6026c27f985b1417b005d375"
    ],
    "order": "0",
    "timing": "2days",
    "date1": "2021-07-23",
    "date2": "2021-07-24",
    "slot1": "08.00",
    "slot2": "10.00",
    "slot3": "13.00",
    "slot4": "15.00",
    "protected": false,
    "disabled": false,
    "creator": "lidias",
    "created": 1625613095254,
    "updated": 1626273162384
  }
]