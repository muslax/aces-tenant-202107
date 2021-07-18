BATCH = {
  "_id": "60e...4dc8",
  "pid": "60e...4dc7",
  "title": "DEF ALS 89 GY",
  "token": null,
  "modules": [
    "608b26...",
    "608b57...",
    "608b5a...",
    "6026c2..."
  ],
  "order": 1,
  // slot = as scheduled
  // date1 = one day as date1
  // date2 = date1 up to date2 --> date2 mustn't be empty
  "timing": "slot/date1/date2",
  "date1": "2021-07-06",      // Tanggal skedul diskusi, wawancara
  "date2": null,              // Tanggal berakhir tes online
  "protected": true,          // default / additional
  "grouping": [],
  "slot1": "08.00",
  "slot2": "10.00",
  "slot3": "13.00",
  "slot4": "15.00",
  "disabled": false,
  "creator": "system",
  "created": 1625529809100,
  "updated": 1625701539373
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