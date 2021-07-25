export default function BatchInfo({ batch, modules }) {

  function getPersons() {
    if (batch.personae == 0) return <span className="text-red-500">Belum tersedia data</span>;
    return <>
      <span className="font-bold">{batch.personae}</span>
      <span className="text-gray-500 ml-2">orang</span>
    </>;
  }

  function getTests() {
    if (batch.tests.length == 0 && batch.sims.length == 0) return (
      <span className="text-red-500">Belum terinstal</span>
    )
    if (batch.tests.length == 0 && batch.sims.length > 0) return (
      <span className="text-gray-400">- Tidak ada</span>
    )
    return <>
      <span className="font-bold">{batch.tests.length}</span>
      <span className="text-gray-500 ml-2">modul</span>
    </>;
  }

  function getSims() {
    if (batch.tests.length == 0 && batch.sims.length == 0) return (
      <span className="text-red-500">Belum terinstal</span>
    )
    if (batch.sims.length == 0 && batch.tests.length > 0) return (
      <span className="text-gray-400">- Tidak ada</span>
    )
    return <>
      <span className="font-bold">{batch.sims.length}</span>
      <span className="text-gray-500 ml-2">kali</span>
    </>;
  }

  function getGroups() {
    if (batch.groups == 0) return <span className="text-red-500">Belum final</span>;
    return <>
      <span className="font-bold">{batch.groups}</span>
      <span className="text-gray-500 ml-2">grup</span>
    </>;
  }

  return <>
    <div className="rounded-md border border-green-500 border-opacity-50 hover:border-opacity-80 hover:shadow-sm">
      <InfoRow label="Nama Batch:">
        <div className="font-bold">{batch.title}</div>
      </InfoRow>
      <InfoRow label="Tanggal:">
        <div className="font-bold">{batch.date1}</div>
      </InfoRow>
      <InfoRow label="Tes mandiri:">
        <div>{getTests()}</div>
      </InfoRow>
      <InfoRow label="Tes temumuka:">
        <div>{getSims()}</div>
      </InfoRow>
      <InfoRow label="Peserta:">
        <div>{getPersons()}</div>
      </InfoRow>
      <InfoRow label="Grup & Skedul:">
        <div>{getGroups()}</div>
      </InfoRow>
    </div>
  </>
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-green-500 border-opacity-50 last:border-none">
      <label className="w-36 sm:w-40 text-gray-500">
        {label}
      </label>
      <div className="flex-grow">
        <div className="truncate">
          {children}
        </div>
      </div>
    </div>
  )
}