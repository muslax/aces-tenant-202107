import bcrypt from 'bcryptjs';

import { API } from "config/api";
import { DB } from "config/db";
import { ObjectId, ObjectID } from "mongodb";
import { connect } from "./database";
import { BatchTemplate } from './db-templates';
import { createRandomPassword, createRandomUsername } from "./utils";

export async function saveNewUser(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { fullname, email, username } = req.body;
    const { password, hashed_password, xfpwd } = createRandomPassword();
    const id = ObjectID().toString();
    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).insertOne({
      _id: id,
      lid: apiUser.license._id,
      fullname: fullname,
      username: username.trim().toLowerCase(),
      email: email,
      // licenseOwner: false,
      verified: false,
      disabled: false,
      deleted: false,
      gender: null,
      phone: null,
      roles: [],
      xfpwd: xfpwd,
      hashed_password: hashed_password,
      creator: apiUser.username,
      created: new Date().getTime(),
      updated: null,
    })

    if (rs) {
      return res.json({
        _id: id,
        lid: apiUser.licenseOwner,
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function disableUser(req, res) {
  try {
    const id = req.body.id;
    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: true, updated: new Date().getTime() }}
    )

    if (rs) {
      return res.json({ message: 'User disabled' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function activateUser(req, res) {
  try {
    const id = req.body.id;
    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: false, updated: new Date().getTime() }}
    )

    if (rs) {
      return res.json({ message: 'User reactivated' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.body.id;
    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: false, deleted: true, updated: new Date().getTime() }}
    )

    if (rs) {
      return res.json({ message: 'User deleted' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function resetUser(req, res) {
  try {
    const id = req.body.id;
    const { password, hashed_password, xfpwd } = createRandomPassword();

    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).findOneAndUpdate(
      { _id: id },
      { $set: {
        xfpwd: xfpwd,
        hashed_password: hashed_password,
        updated: new Date().getTime()
        }
      }
    )

    if (rs) {
      const user = rs.value;
      return res.json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        password: password,
      });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function changePassword(req, res) {
  const apiUser = req.session.get("user")
  try {
    const id = apiUser._id
    const { oldPassword, newPassword } = req.body
    console.log(oldPassword, newPassword)
    const { dba } = await connect()

    const user = await dba.collection(DB.USERS).findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const verified = bcrypt.compareSync(oldPassword, user.hashed_password)
    console.log("VERIFIED")
    if (!verified) return res.json({
      ok: false,
      message: "Anda memasukkan password yang salah."
    })

    const saltRounds = 5
    const hash = bcrypt.hashSync(newPassword, saltRounds)
    console.log("HASH", hash)
    const rs = await dba.collection(DB.USERS).findOneAndUpdate(
      { _id: id},
      { $set : {
        hashed_password: hash,
        updated: new Date().getTime()
        }
      },
    )

    console.log("RS", rs)
    if (rs) {
      return res.json({
        ok: true,
        message: "Berhasil mengganti password."
      })
    } else {
      return res.status(500).json({ message: 'Internal server error' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function updateLogo(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { imageUrl } = req.body
    const { dba } = await connect()
    const rs = await dba.collection(DB.LICENSES).findOneAndUpdate(
      { _id: apiUser.license._id },
      { $set: {
        logoUrl: imageUrl,
        updated: new Date().getTime(),
      }}
    )
    console.log('updateLogo', rs)

    // Update cookie
    const user = apiUser
    user.license.logoUrl = imageUrl
    req.session.set("user", user);
    await req.session.save();

    return res.json({ message: 'Logo saved' })
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveProject(req, res) {
  try {
    const apiUser = req.session.get("user");
    const lid = apiUser.license._id;
    const { dba, client } = await connect();
    const session = client.startSession();
    console.log(req.body)

    await session.withTransaction(async () => {
      const cid = ObjectID().toString();

      const client = await dba.collection(DB.CLIENTS).insertOne({
        _id: cid,
        lid: lid,
        name: req.body.clientName,
        address: req.body.clientAddress,
        city: req.body.clientCity,
        phone: null,
        contacts: [],
        creator: apiUser.username,
        created: new Date().getTime(),
        updated: null,
      });

      const pid = ObjectID().toString();
      const project = await dba.collection(DB.PROJECTS).insertOne({
        _id: pid,
        lid: lid,
        cid: cid,
        status: null,
        batchMode: req.body.batchMode,
        title: req.body.title,
        fullTitle: req.body.fullTitle,
        description: req.body.description,
        contractDate: req.body.contractDate,
        admin: apiUser.username,
        contacts: [],
        creator: apiUser.username,
        created: new Date().getTime(),
        updated: null,
      });

      const bid = ObjectID().toString();
      const doc = BatchTemplate(bid, pid, req.body.batchDate, apiUser)
      await dba.collection(DB.BATCHES).insertOne(doc)

      return res.json({ message: 'OK' });
    })
    //
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveClientProject(req, res) {
  try {
    const apiUser = req.session.get("user");
    const lid = apiUser.license._id;
    const { dba, client } = await connect();
    const session = client.startSession();
    console.log(req.body)

    await session.withTransaction(async () => {
      const pid = ObjectID().toString();
      await dba.collection(DB.PROJECTS).insertOne({
        _id: pid,
        lid:lid,
        cid: req.body.cid,
        status: null,
        batchMode: req.body.batchMode,
        title: req.body.title,
        fullTitle: req.body.fullTitle,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        admin: apiUser.username,
        contacts: [],
        creator: apiUser.username,
        created: new Date().getTime(),
        updated: null,
      });

      const bid = ObjectID().toString();
      const doc = BatchTemplate(bid, pid, req.body.batchDate, apiUser)
      await dba.collection(DB.BATCHES).insertOne(doc)

      return res.json({ message: 'OK' });
    })
    //
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function changeProjectAdmin(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const { id, admin: username } = req.body;

    const rs = await dba.collection(DB.PROJECTS).findOneAndUpdate(
      { _id: id },
      { $set: {
        admin: username,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Admin changed' });
    } else {
      return res.status(404).json({ message: 'Project not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function updateProject(req, res) {
  try {
    const { dba } = await connect();
    const { id, title, description, contractDate, admin } = req.body;

    const rs = await dba.collection(DB.PROJECTS).findOneAndUpdate(
      { _id: id },
      { $set: {
        title: title,
        description: description,
        contractDate: contractDate,
        admin: admin,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Project updated' });
    } else {
      return res.status(404).json({ message: 'Project not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveNewBatch(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { pid, title, date1 } = req.body;
    const id = ObjectID().toString();
    const { dba } = await connect();
    const doc = BatchTemplate(id, pid, date1, apiUser)
    doc.title = title
    doc.protected = false
    await dba.collection(DB.BATCHES).insertOne(doc)

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function updateBatch(req, res) {
  try {
    const { dba } = await connect();
    const { id, title, date1 } = req.body;

    const rs = await dba.collection(DB.BATCHES).findOneAndUpdate(
      { _id: id },
      { $set: {
        title: title,
        date1: date1,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Batch updated' });
    } else {
      return res.status(404).json({ message: 'Batch not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveTestConfig(req, res) {
  try {
    const { dba } = await connect();
    const { id, order, token, timing, testOpen, testClose, simDate } = req.body;

    // id: batch._id,
    // token: token,
    // timing: timing,
    // order: parseInt(order),
    // testOpen: generateWIBDateString(date1, time1),
    // testClose: generateWIBDateString(date2, time2),
    // simDate: simDate,
    const rs = await dba.collection(DB.BATCHES).findOneAndUpdate(
      { _id: id },
      { $set: {
        order: order,
        token: token,
        timing: timing,
        testOpen: testOpen,
        testClose: testClose,
        simDate: simDate,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Batch updated' });
    } else {
      return res.status(404).json({ message: 'Batch not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function __renameBatch(req, res) {
  try {
    const { dba } = await connect();
    const { id, title, date1 } = req.body;

    const rs = await dba.collection(DB.BATCHES).findOneAndUpdate(
      { _id: id },
      { $set: {
        title: title,
        date1: date1,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Batch updated' });
    } else {
      return res.status(404).json({ message: 'Batch not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function updatePersona(req, res) {
  try {
    const { dba } = await connect();
    const {
      id, fullname, gender, birth, email, nip, position, currentLevel, targetLevel
    } = req.body;

    const rs = await dba.collection(DB.PERSONAE).findOneAndUpdate(
      { _id: id },
      { $set: {
        fullname: fullname,
        gender: gender,
        birth: birth,
        email: email,
        nip: nip,
        position: position,
        currentLevel: currentLevel,
        targetLevel: targetLevel,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Person updated' });
    } else {
      return res.status(404).json({ message: 'Person not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function deleteBatch(req, res) {
  try {
    const id = req.body.id;
    const { dba } = await connect();
    const rs = await dba.collection(DB.BATCHES).findOneAndDelete({ _id: id });

    if (rs) {
      return res.json({ message: 'Batch deleted' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function deletePersona(req, res) {
  try {
    const { id } = req.body;
    const { dba } = await connect();
    const rs = await dba.collection(DB.PERSONAE).findOneAndDelete({ _id: id });

    if (rs) {
      return res.json({ message: 'Person deleted' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveBatchModules(req, res) {
  try {
    const { dba } = await connect();
    const { id, modules, tests, sims } = req.body;

    const rs = await dba.collection(DB.BATCHES).findOneAndUpdate(
      { _id: id },
      { $set: {
        modules: modules,
        tests: tests,
        sims: sims,
        updated: new Date().getTime()
      }}
    )

    if (rs) {
      return res.json({ message: 'Batch updated' });
    } else {
      return res.status(404).json({ message: 'Project not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveCSVData(req, res) {
  const apiUser = req.session.get("user");
  const { bid, data, replace } = req.body;
  const { dba, client } = await connect();
  const session = await client.startSession();
  // Should use withTransaction
  try {
    await session.withTransaction(async () => {
      if (replace) {
        await dba.collection(DB.PERSONAE).deleteMany({ bid: bid });
      }

      // Delete batch groups
      await dba.collection(DB.GROUPS).deleteMany({ bid: bid });

      const isoDate = new Date().toISOString();
      const docs = [];

      data.forEach(person => {
        const { password, xfpwd, hashed_password } = createRandomPassword();
        const doc = person;
        doc._id = ObjectID().toString();
        doc.xfpwd = xfpwd;
        doc.hashed_password = hashed_password;
        doc.created = isoDate;
        doc.updated = null;
        docs.push(doc);
      })

      const rs = await dba.collection(DB.PERSONAE).insertMany(docs);
      if (rs) {
        return res.json({ message: 'OK' });
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).end(error.message)
  } finally {
    await session.endSession();
  }
}

export async function addNames(req, res) {
  try {
    console.log("addNames")
    const apiUser = req.session.get("user");
    const { pid, bid, names } = req.body;
    console.log(apiUser)
    const { dba } = await connect();
    const docs = [];

    names.forEach(name => {
      const { password, xfpwd, hashed_password } = createRandomPassword();
      docs.push({
        _id: ObjectID().toString(),
        lid: apiUser.license._id,
        pid: pid,
        bid: bid,
        disabled: false,
        fullname: name,
        username: createRandomUsername(),
        email: null,
        gender: null,
        birth: null,
        phone: null,
        nip: null,
        position: null,
        currentLevel: null,
        targetLevel: null,
        group: "",
        tests: [],
        sims: [],
        workingOn: null,
        xfpwd: xfpwd,
        hashed_password: hashed_password,
        creator: apiUser.username,
      })
    })

    console.log(docs)

    const rs = await dba.collection(DB.PERSONAE).insertMany(docs);
    if (rs) {
      return res.json({ message: 'OK' });
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

// save-group-schedules
export async function saveGroupSchedules(req, res) {
  console.log("saveGroupSchedules", new Date());
  const apiUser = req.session.get("user");
  const { bid, slots, groups } = req.body;
  console.log(slots)
  console.log(groups[0])
  const { dba, client } = await connect();
  const session = await client.startSession();
  // Should use withTransaction
  try {
    await session.withTransaction(async () => {
      // update batch slots
      await dba.collection(DB.BATCHES).updateOne(
        { _id: bid },
        { $set: {
          slot1: slots[0],
          slot2: slots[1],
          slot3: slots[2],
          slot4: slots[3],
          updated: new Date().getTime()
        }}
      );

      const docs = [];
      groups.forEach(g => {
        const doc = g;
        doc._id = ObjectId().toString();
        doc.created = new Date().getTime();
        doc.updated = null;
        docs.push(doc);
      })

      // Delete existing batch groups
      await dba.collection(DB.GROUPS).deleteMany({ bid: bid });

      // Save groups
      await dba.collection(DB.GROUPS).insertMany(docs);

      const personUpdates = [];
      docs.forEach(doc => {
        doc.persons.forEach(id => {
          personUpdates.push({ updateOne: {
            "filter": { _id: id },
            "update": { $set: { "group": doc._id }}
          }})
        })
      })

      // console.log(personUpdates);

      // Update persons
      const rs = await dba.collection(DB.PERSONAE).bulkWrite(personUpdates);

      // console.log("RS", rs);



      if (rs) {
        console.log("saveGroupSchedules", new Date());
        return res.json({ message: 'OK' });
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).end(error.message)
  } finally {
    await session.endSession();
  }
}

export async function __saveDeployment(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const { batch, groups } = req.body;

    const docs = [];
    groups.forEach(g => {
      const doc = g;
      doc._id = ObjectId().toString();
      doc.created = new Date().getTime();
      doc.updated = null;
      docs.push(doc);
    })

    const personUpdates = [];
    docs.forEach(doc => {
      doc.persons.forEach(id => {
        personUpdates.push({ updateOne: {
          "filter": id,
          "update": { $set: { "group": doc._id }}
        }})
      })
    })

    console.log(personUpdates);

    const rs = await dba.collection(DB.PERSONAE).bulkWrite(personUpdates);
    console.log(rs);

  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).end(error.message)
  }
}

export async function saveTestMode(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { id, token, order, timing, date1, date2 } = req.body;
    const { dba } = await connect();

    const rs = dba.collection(DB.BATCHES).findOneAndUpdate(
      { _id: id },
      { $set: {
        token: token,
        order: order,
        timing: timing,
        date1: date1,
        date2: date2,
        updated: new Date().getTime(),
      }}
    )

    if (rs) {
      return res.json({ message: 'Batch updated' });
    }

  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

/** saveTestMode
export async function CHANGE_ME(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();

  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}
*/

export const MUTATION = {}

MUTATION[API.POST.NEW_USER] = saveNewUser
MUTATION[API.POST.DISABLE_USER] = disableUser
MUTATION[API.POST.ACTIVATE_USER] = activateUser
MUTATION[API.POST.DELETE_USER] = deleteUser
MUTATION[API.POST.RESET_USER] = resetUser
MUTATION[API.POST.CHANGE_PASSWORD] = changePassword

MUTATION[API.POST.SAVE_PROJECT] = saveProject
MUTATION[API.POST.SAVE_CLIENT_PROJECT] = saveClientProject
MUTATION[API.POST.CHANGE_PROJECT_ADMIN] = changeProjectAdmin
MUTATION[API.POST.UPDATE_PROJECT] = updateProject
MUTATION[API.POST.SAVE_NEW_BATCH] = saveNewBatch
MUTATION[API.POST.UPDATE_BATCH] = updateBatch
MUTATION[API.POST.DELETE_BATCH] = deleteBatch
MUTATION[API.POST.SAVE_MODULES] = saveBatchModules
MUTATION[API.POST.SAVE_CSV_DATA] = saveCSVData
// MUTATION[API.POST.SAVE_DEPLOYMENT] = saveDeployment
MUTATION[API.POST.UPDATE_PERSONA] = updatePersona
MUTATION[API.POST.DELETE_PERSONA] = deletePersona
MUTATION[API.POST.ADD_NAMES] = addNames
MUTATION[API.POST.SAVE_TEST_MODE] = saveTestMode
MUTATION[API.POST.UPDATE_LOGO] = updateLogo
MUTATION[API.POST.SAVE_TEST_CONFIG] = saveTestConfig
MUTATION[API.POST.SAVE_GROUP_SCHEDULES] = saveGroupSchedules