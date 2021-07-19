import useUsers from "hooks/useUsers"

const Users = ({ user }) => {
  const { users, isError, isLoading, mutate: mutateUsers } = useUsers()

  if (isLoading) return <>Loading...</>

  return <>
    <h2 className="text-2xl my-4">Users</h2>
    <pre>{JSON.stringify(users, null, 2)}</pre>
  </>
}

export default Users
