import useLicense from "hooks/useLicense"

import PageHeading from "./PageHeading"

const License = ({ user }) => {
  const { license, isError, isLoading, mutate: mutateLicense } = useLicense()

  if (isLoading) return <>Loading...</>

  return <>
    <PageHeading heading="License Info" />

    <div className="rounded-md border border-blue-200 hover:border-blue-300 hover:shadow-sm">
      <DataRow label="License ID" content={license._id} />
      <DataRow label="License Name" content={license.title} />
      <DataRow label="License Type" content={license.type} />
      <DataRow label="Contact" content={license.contact.fullname} />
      <DataRow label="Published" content={license.publishDate} />
    </div>

    {/* <pre>LICENSE {JSON.stringify(license, null, 2)}</pre> */}
  </>
}

export default License

function DataRow({ label, content }) {
  return (
    <div className="flex items-center px-5 py-3 border-b border-blue-200 last:border-none">
      <label className="w-36 sm:w-48 text-gray-500">
        {label || '[LABEL]'}:
      </label>
      <div className="flex-grow">
        <div className="truncate">
          {content}
        </div>
      </div>
    </div>
  )
}
