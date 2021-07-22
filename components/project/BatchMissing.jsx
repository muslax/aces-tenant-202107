import Head from "next/head";

import { getLocalStorageBatch } from "lib/utils"
import useBatches from "hooks/useBatches";

const BatchMissing = ({ pid, setCurrentBatch, callback }) => {
  const localBatch = getLocalStorageBatch(pid)
  const { batches, isError, isLoading } = useBatches(pid)

  return <>
    <Head>
      <title>ACES: Batch missing</title>
    </Head>
    
    <div id="batch-missing" className="bg-green-500 bg-opacity-80 text-white h--64 px-7 pt-5 pb-7">
      <div className="max-w-xl">
        {localBatch && localBatch.title && (
          <p className="text-2xl font--bold mb-12">
            Batch <span className="font-bold">{localBatch.title}</span> yang 
            sedang Anda lihat telah dihapus oleh administrator proyek. Silakan 
            memilih batch lain.
          </p>
        )}
        {!localBatch || !localBatch.title && (
          <p className="text-2xl font--bold mb-12">
          Batch aktif yang sedang Anda lihat telah dihapus oleh
          administrator proyek. Silakan memilih batch lain.
        </p>
        )}
        <div className="bg-white max-w-sm">
          <select 
            className={`w-full truncate text-xl font--bold bg-green-500 bg-opacity-80 pr-16 
            border-2 border-white focus:border-white focus:ring-0`}
            onChange={e => {
              if (e.target.value) {
                const batch = batches.filter(b => b._id == e.target.value)[0]
                window.localStorage.setItem(pid, JSON.stringify(batch))
                setCurrentBatch(batch)
                if (callback) callback(false)
              }
            }}
          >
            <option>- Pilih batch</option>
            {batches && batches.map(batch => (
              <option key={batch._id} value={batch._id}>Batch: {batch.title}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
    <style jsx>{`
    select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")
    }
    `}</style>
  </>
}

export default BatchMissing
