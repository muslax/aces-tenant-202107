import useLicense from "hooks/useLicense"

const License = ({ user }) => {
  const { license, isError, isLoading, mutate: mutateLicense } = useLicense()

  if (isLoading) return <>Loading...</>

  return <>
    <h2 className="text-2xl text-blue-700 my-4">License Info</h2>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </>
}

export default License
