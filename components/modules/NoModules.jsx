import Head from "next/head";
import Link from "next/link"

import Hero from "components/project/Hero";

export default function NoModules({ project, batch, isAdmin }) {
  return <>
    <Head>
      <title>Personae: {project.title} - ACES</title>
    </Head>

    <Hero project={project} batch={batch} title="ACES Modules" />

    <div id="no-modules" className="border-t -border-gray-300 text-center px-5 py-6">
      <h2 className="text-lg text-pink-500  font-bold mb-7">
        Batch ini belum memiliki Modul ACES
      </h2>

      {isAdmin && (
        <div>
            <p className="text-base mb-4">
              Klik tombol di bawah untuk menginstal Modul ACES.
            </p>
            <p>
              <Link href={`/projects/${project._id}/setup-modules`}>
                <a
                  className="inline-flex font-semibold text-green-500 rounded-sm border border-green-500 hover:border-green-400 hover:text-green-600 active:border-green-500 active:text-green-700 px-5 py-2"
                >Instal Modul ACES</a>
              </Link>
            </p>
        </div>
      )}

      {!isAdmin && (
        <div>
          <p className="text-base">
            Hanya admin proyek yang dapat menginstal Modul ACES.
          </p>
        </div>
      )}

    </div>
  </>
}