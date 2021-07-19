import useClients from "hooks/useClients"

const Clients = ({ user }) => {
  const { clients, isError, isLoading, mutate: mutateClients } = useClients()

  if (isLoading) return <>Loading...</>

  return <>
    <h2 className="text-2xl my-4">Your Clients</h2>
    
    <pre>{JSON.stringify(clients, null, 2)}</pre>
  </>
}

export default Clients
