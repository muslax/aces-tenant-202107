import Head from "next/head";

import Hero from "components/project/Hero";

const BatchNotReady = ({ project, batch, isAdmin }) => {
  return <>
    <Head>
      <title>Deployment: Not Ready - ACES</title>
    </Head>

    <Hero project={project} batch={batch} title="ACES Modules" />

    <div id="batch-not-ready" 
      className="px-5 py-6 -mb-36 bg-green-50 bg-gradient-to-t from-white border-t border-green-500 border-opacity-80 text-center"
      style={{
        minHeight: 'calc(100vh - 100px)'
      }}
    >
      <h2 className="text-lg text-green-700 font-bold mb-7">
        Batch ini belum dapat dideploy
      </h2>
    </div>
  </>
}

export default BatchNotReady
