import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CSVReader } from "react-papaparse";
import { XIcon } from "@heroicons/react/solid";

import { createRandomPassword, createRandomUsername, generatePOSTData, getCurrentBatch, isAdmin } from "lib/utils";
import { APIROUTES } from "config/routes";
import NoPersonae from "./NoPersonae";
import useModules from "hooks/useModules";

import { TableCSV } from "./TableCSV";
import fetchJson from "lib/fetchJson";
import PostModal from "components/PostModal";
import { mutate } from "swr";
import SubmitProgress from "components/SubmitProgress";
import FixedOverlay from "components/FixedOverlay";

const buttonRef = React.createRef()

const ImportCSV = ({ user, project,batch }) => {
  const router = useRouter();

  const { modules, isError, isLoading } = useModules();

  const [warning, setWarning] = useState(batch.personae > 0);
  const [testIds, setTestIds] = useState([]);
  const [simIds, setSimIds] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [personaData, setPersonaData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hashing, sethashing] = useState(false);
  const [hashingFlag, setHashingFlag] = useState(false);

  async function handleSubmit(e) {
    setSubmitting(true);

    // const body = { personae: personaData };
    const res = await fetchJson(APIROUTES.POST.SAVE_CSV_DATA,
      generatePOSTData({
        bid: batch._id,
        data: personaData,
        replace: true,
      })
    );

    // if (res) {
      mutate(`${APIROUTES.GET.BATCH_PERSONAE}&bid=${batch._id}&fields=fullname,group`)
      mutate(`${APIROUTES.GET.BATCH_GROUPS}&bid=${batch._id}`)
      // mutate(`${APIROUTES.GET.BATCHES}&bid=${batch._id}`)
      setSubmitting(false);
      router.push(`/projects/${project._id}/persona`)
    // }
  }

  function handleOnFileLoad(data) {
    populate(data)
  }

  function handleOnError(err, file, inputElem, reason) {
    console.log(err);
  }

  function handleOnRemoveFile(data) {
    reset()
    console.log(data);
  }

  function handleOpenDialog (e) {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  function handleRemoveFile(e) {
    document.querySelectorAll('input[type="checkbox]').forEach(elm => {
      elm.checked = true
    })

    document.querySelectorAll('.col-email, .col-gender, .col-birth, .col-phone, .col-nip, .col-position').forEach(elm => {
      elm.classList.remove('hidden')
    })

    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  }

  function populate (data) {
    setCsvData(data)
  }

  function reset () {
    setCsvData(null)
    setPersonaData([])
  }

  // Collect module ids from batch
  useEffect(() => {
    if (!modules) return;

    const tests = [];
    const sims = [];
    modules.forEach(mod => {
      if (batch.modules.includes(mod._id)) {
        // let obj = {};
        // Tests and sims format
        // <moduleId>: [ <module.lngth>, 0 ]
        // "608b29105959bf263a6ecce0": [ 45, 0 ]
        // obj[mod._id] = [mod.length, 0];
        if (mod.method == 'selftest') {
          tests.push(mod._id);
        } else if (mod.method == 'guided') {
          sims.push(mod._id);
        }
      }
    })

    setTestIds(tests);
    setSimIds(sims);

    return () => {}
  }, [modules])

  useEffect(() => {
    if (csvData && csvData.length > 1) {
      let array = [];
      let usernames = [];

      csvData.forEach(({ data }, index) => {
        if (data.length == 10 && data[0] && data[0].toLowerCase() !== 'fullname') {
          const fn = data[0].toLowerCase().trim().split(" ");
          let username = data[1].toLowerCase();

          if (!username) username = fn[0];

          const sfx = createRandomUsername();

          if (usernames.includes(username)) {
            // username = fn[0];
            if (username.length < 5) {
              username = username + sfx.substr(0, 6 - username.length);
            }
            if (usernames.includes(username)) {
              username = username.substr(0, 3);
              username =  username + sfx.substr(0, 3);
            }
          }

          if (username.length < 5) {
            username =  username + sfx.substr(0, 6 - username.length);
          }

          usernames.push(username);

          array.push({
            _id: null,
            lid: user.license._id,
            pid: project._id,
            bid: batch._id,
            disabled: false,
            fullname: data[0].trim(),
            username: username,
            email: data[2].trim().toLowerCase(),
            gender: data[3].trim(),
            birth: data[4].trim(),
            phone: data[5].trim(),
            nip: data[6].trim(),
            position: data[7].trim(),
            currentLevel: data[8].trim(),
            targetLevel: data[9].trim(),
            group: "",
            tests: testIds,
            sims: simIds,
            workingOn: null,
            // currentSim: null,
            // testsPerformed: [],
            // simsPerformed: [],
            xfpwd: null,
            hashed_password: null,
            creator: user.username,
            // date will be generated on server
            // created: new Date(),
            // updated: null,
          })
        }
      })

      setPersonaData(array)
      setHashingFlag(!hashingFlag)
    } else {
      setPersonaData([])
    }
    return () => {}
  }, [csvData]);

  if (isLoading) return <>...</>;

  return <>
    <div className="">
      {warning && (
        <div className="h--60 bg-green-50 my-4">
          <div className="text-right">
            <button 
              className="p-1 text-green-600 text-opacity-50 hover:bg-green-500 hover:text-white"
              onClick={e => router.push(`/projects/${project._id}/persona`)}

            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="max-w-2xl mx-auto text-center pt-4 pb-12 px-8">
            <h2 className="text-lg text-green-600 font-medium mb-3 mb-8">
              Anda akan menggantikan <span className="font-extrabold">seluruh
              data peserta</span> dengan data baru dari file CSV.
              Klik OK untuk melanjutkan.
            </h2>
            <div className="">
              <button
                className="bg-green-500 rounded px-10 py-1 text-lg text-white font-medium"
                onClick={e => setWarning(false)}
              >OK</button>
            </div>
          </div>
        </div>
      )}

      {!warning && (
        <div className="py-4">
          {/* <br/> */}
    <h2 className="text-2xl text-gray-600 font-light">
      Upload CSV File
    </h2>
          <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            noProgressBar
            onRemoveFile={handleOnRemoveFile}
          >
            {({ file }) => (
              <>
              <div className="mb-3 pt-6">
                {/* <h2 className="text-lg font-bold text-green-600 mb-5">Pilih file CSV</h2> */}
                {/* <p>Pilih file </p> */}
                
                <div className="flex items-center">
                  <div className="w-3/5 flex">
                    <div className="flex-grow flex items-center overflow-hidden h-8 bg-gray-50 rounded-l border-l border-t border-b border-green-500 border-opacity-60 px-3">
                      <div className="w-full truncate">
                        File: {(file && file.name) ? file.name : '...'}
                      </div>
                    </div>
                    {!file && (
                      <button 
                        className="flex-shrink-0 h-8 px-4 rounded-r bg-green-500 text-white hover:bg-opacity-80"
                        onClick={handleOpenDialog}
                      >Select file</button>
                    )}
                    {file && (
                      <button 
                        className="flex-shrink-0 h-8 px-4 rounded-r bg-green-500 text-white hover:bg-opacity-80"
                        onClick={handleRemoveFile}
                      >Remove</button>
                    )}
                  </div>
                  <div className="w-2/5 flex-shrink-0 pl-4 flex space-x-3 justify-end">
                    {file && (
                      <button
                        className="h-8 px-5 rounded bg-green-500 text-white font-medium"
                        onClick={handleSubmit}
                      >Save</button>
                    )}
                    <button
                      className="h-8 px-3 rounded border border-green-500 border-opacity-60 text-green-500"
                      onClick={e => {
                        router.push(`/projects/${project._id}/persona`)
                      }}
                    >Cancel</button>
                  </div>
                </div>
              </div>
              
              </>
            )}
          </CSVReader>
        </div>
      )}

      {personaData.length > 0 && (
        <div className="relative overflow-x-scroll border border-green-500 border-opacity-70">
          <TableCSV data={personaData} />
        </div>
      )}

      {/* <SubmitProgress message="Uploading data... " /> */}
      {submitting && <FixedOverlay>
        <div className="w-2/5 rounded bg-white p-1 shadow-md">
          <div className="rounded-sm border p-2">
            <div className="progress border border-gray-400 h-2"></div>
          </div>
        </div>
      </FixedOverlay>}
      {/* {submitting && <PostModal message="Uploading data... " />} */}

    </div>
    {/* <pre>{JSON.stringify(batch, null, 2)}</pre> */}
  </>
}

export default ImportCSV
