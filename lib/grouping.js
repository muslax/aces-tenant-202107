export function createGroupsMeta(pop) {
  let res = {};
  // norm = default team member
  if (pop === undefined || pop === 0 || pop > 124) return false;
  else if (pop < 8)     res = { pop: pop, div: 1, norm: pop, team: pop, grouping: [pop] };
  else if (pop === 8)   res = { pop: pop, div: 1, norm: 4, team: 4, grouping: [4, 4] };
  else if (pop === 9)   res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 4] };
  else if (pop === 13)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 4, 4] };
  else if (pop === 14)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 5, 4] };
  else if (pop === 19)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 5, 5, 4] };

  // else if (pop === 31)  return { pop: pop, div: 2, norm: 6, team: 13, grouping: [6, 6, 6, 6, 7] };
  // else if (pop === 32)  return { pop: pop, div: 2, norm: 6, team: 14, grouping: [6, 6, 6, 7, 7] };

  else {
    const mod = pop % 24;
    const tweak = mod >= 1 && mod <= 4 && (pop < 27 || pop > 28);

    let a = Math.ceil(pop / 6);
    if (tweak) a--;

    const b = (a * 6) - pop;
    let max = 0;

    const array = Array(a).fill(6);
    if (tweak) array.fill(7, a - mod);
    if (b > 0) array.fill(5, (a - b));

    const div = Math.ceil(array.length / 4);
    array.forEach(m => { if (m > max) max = m });

    let team = div * max;
    if (tweak) {
      // let addition = mod > 1 ? 2 : 1;
      // let addition = mod % 2 == 0 ? 2 : mod;
      let addition = mod;
      if (addition > div) addition = div;
      team = div * 6 + addition;
    }

    res = { pop: pop, div: div, norm: max > 6 ? 6 : max, team: team, grouping: array }
  }

  if (pop === 31) res.team = 11;

  return res;
}

export function __createGroups(persons) {
  let start = 0;
  let array = [];
  // const grouping = data.grouping;
  const meta = createGroupsMeta(persons.length)
  const grouping = meta.grouping

  for (let i = 0; i < grouping.length; i++) {
    const idx = i + 1;
    const sfx = idx < 10 ? '0' + idx : idx;
    const name = `GROUP ${sfx}`;
    if (i == grouping.length - 1) {
      array.push({
        name: name,
        persons: persons.slice(start)
      });
    } else {
      array.push({
        name: name,
        persons: persons.slice(start, start + grouping[i])
      });
    }

    start = start + grouping[i];
  }

  return array;
}

export function createGroups(persons) {
  if (!persons) return []

  let start = 0;
  let array = []
  let personIds = []

  persons.forEach(p => { personIds.push(p._id) })

  // const grouping = data.grouping;
  const meta = createGroupsMeta(persons.length)
  const grouping = meta.grouping

  for (let i = 0; i < grouping.length; i++) {
    const idx = i + 1;
    const sfx = idx < 10 ? '0' + idx : idx;
    const name = `GROUP ${sfx}`;
    if (i == grouping.length - 1) {
      array.push({
        _id: name,
        bid: null,
        name: name,
        persons: personIds.slice(start)
      });
    } else {
      array.push({
        _id: name,
        bid: null,
        name: name,
        persons: personIds.slice(start, start + grouping[i])
      });
    }

    start = start + grouping[i];
  }

  return array;
}

export function createSchedules(bid, groups) {
  let pop = 0;
  const div = Math.ceil(groups.length / 4);

  groups.forEach((g) => pop += g.persons.length)
  const norm = createGroupsMeta(pop).norm;

  const schedules = groups.map(({ _id, name, persons }, index) => {
    return {
      _id: name,
      bid: bid,
      name: name,
      persons: persons, // persons.length,
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
      norm: norm,
    }
  })

  const divSlots = [];
  /* Always create 4 slot combinations */
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'Interview', slot2: 'Discussion', slot3: 'Selftest', slot4: 'Selftest'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'Discussion', slot2: 'Interview', slot3: 'Selftest', slot4: 'Selftest'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'Selftest', slot2: 'Selftest', slot3: 'Interview', slot4: 'Discussion'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'Selftest', slot2: 'Selftest', slot3: 'Discussion', slot4: 'Interview'});

  for (let i = 0; i < schedules.length; i++) {
    const slot = divSlots[i];
    const asw = slot.asw;
    if (schedules[i].persons < schedules[i].norm) asw  = divSlots[i].asw + ' (-)';
    if (schedules[i].persons > schedules[i].norm) asw  = divSlots[i].asw + ' (+)';
    schedules[i].slot1 = slot.slot1;
    schedules[i].slot2 = slot.slot2;
    schedules[i].slot3 = slot.slot3;
    schedules[i].slot4 = slot.slot4;
    schedules[i].asd = slot.asd;
    schedules[i].asw = asw;
    // schedules[i].norm = pop;
  }

  return schedules;
}