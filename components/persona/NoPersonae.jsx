import Head from "next/head";
import Link from "next/link"

import Hero from "components/project/Hero";

export default function NoPersonae({ project, batch, isAdmin }) {
  return <>
    <Head>
      <title>Personae: {project.title} - ACES</title>
    </Head>

    <Hero project={project} batch={batch} title="ACES Persona" />

    <div id="no-personae" 
      className="px-5 py-6 -mb-36 bg-green-50 bg-gradient-to-t from-white border-t border-green-500 border-opacity-80 text-center"
      style={{
        minHeight: 'calc(100vh - 100px)'
      }}
    >
      <h2 className="text-lg text-green-700 font-bold mb-7">
        Belum ada daftar peserta
      </h2>

      {isAdmin && (
        <div>
            <p className="mb-4">
              Klik tombol di bawah untuk mengupload daftar peserta.
            </p>
            <p className="mb-4">
              <Link href={`/projects/${project._id}/import-csv`}>
                <a
                  className={`inline-flex text-white font-semibold rounded
                  bg-green-500 hover:bg-opacity-90
                  border border-green-600 border-opacity-60 active:text-green-700 px-5 py-2`}
                >Upload CSV File</a>
              </Link>
            </p>
            <p className="mb-4">
              <a 
                download="/sample-data.csv" 
                href="/sample-data.csv"
                className="text-green-600 underline"
              >
                Download sample-data.csv
              </a>
            </p>
        </div>
      )}

      {!isAdmin && (
        <div>
          <p className="mb-4">
            Hanya admin proyek yang dapat membuat dan menambah daftar peserta.
          </p>
          <p className="mb-4">
              <a 
                download="/sample-data.csv" 
                href="/sample-data.csv"
                className="text-green-600 underline"
              >
                Download sample-data.csv
              </a>
            </p>
        </div>
      )}

    </div>
  </>
}