export default function BatchInfo({ batch, modules }) {

  function getPersons() {
    if (batch.personae == 0) return <span className="text-red-500">Data belum tersedia</span>;
    return <>
      <span className="font-bold">{batch.personae}</span>
      <span className="text-gray-500 ml-2">orang</span>
    </>;
  }

  function getModules() {
    if (batch.modules.length == 0) return <span className="text-red-500">Modul belum terinstal</span>;
    const mtests = <>
      <span className="">{batch.tests.length}</span>
      <span className="ml-2">tes mandiri </span>
    </>;
    const mguided = <>
      <span className="">{batch.sims.length}</span>
      <span className="ml-2">temu muka</span>
    </>;

    if (batch.tests.length > 0 && batch.sims.length == 0) return mtests;
    else if (batch.sims.length > 0 && batch.tests.length == 0) return mguided;
    return <div className="text-gray--400 font-bold">
      {mtests} <span className="text-gray-400 font-normal mx-2">&ndash;</span> {mguided}
    </div>;
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
        <p className="font-bold">{batch.title}</p>
      </InfoRow>
      <InfoRow label="Tanggal:">
        <p className="font-bold">{batch.date1}</p>
      </InfoRow>
      <InfoRow label="Modul ACES:">
        <p>{getModules()}</p>
      </InfoRow>
      <InfoRow label="Peserta:">
        <p>{getPersons()}</p>
      </InfoRow>
      <InfoRow label="Grup & Skedul:">
        <p>{getGroups()}</p>
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