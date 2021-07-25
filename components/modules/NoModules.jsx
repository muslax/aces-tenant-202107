import Head from "next/head";
import Link from "next/link"

import Hero from "components/project/Hero";

export default function NoModules({ project, batch, isAdmin }) {
  return <>
    <Head>
      <title>Personae: {project.title} - ACES</title>
    </Head>

    <Hero project={project} batch={batch} title="ACES Modules" />

    <div id="no-modules" 
      className="px-5 py-6 -mb-36 bg-green-50 bg-gradient-to-t from-white border-t border-green-500 border-opacity-80 text-center"
      style={{
        minHeight: 'calc(100vh - 100px)'
      }}
    >
      <h2 className="text-lg text-green-700 font-bold mb-7">
        Batch ini belum memiliki Modul ACES
      </h2>

      {isAdmin && (
        <div>
          <p className="mb-4">
            Klik tombol di bawah untuk menginstal Modul ACES.
          </p>
          <p className="mb-4">
            <Link href={`/projects/${project._id}/setup-modules`}>
              <a
                className={`inline-flex text-white font-semibold rounded
                bg-green-500 hover:bg-opacity-90
                border border-green-600 border-opacity-60 active:text-green-700 px-5 py-2`}
              >Instal Modul ACES</a>
            </Link>
          </p>
        </div>
      )}

      {!isAdmin && (
        <div>
          <p className="mb-4">
            Hanya admin proyek yang dapat menginstal Modul ACES.
          </p>
        </div>
      )}

    </div>
  </>
}