import useProjects from "hooks/useProjects"

const Dashboard = ({ user }) => {
  const { projects, isError, isLoading, mutate: mutateProjects } = useProjects()

  if (isLoading) return <>Loading...</>

  return <>
  {/* bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 */}
    <h2 className="text-xl text-gray-400 font-bold my-4">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800">
        ACES Projects
      </span>
    </h2>
    <div>
      {projects.map(p => <p key={p._id}>
        <a href={`/projects/${p._id}`} className="text-blue-500">{p.title}</a>
      </p>)}
    </div>

    <pre>{JSON.stringify(user, null, 2)}</pre>
    <pre>{JSON.stringify(projects, null, 2)}</pre>
  </>
}

export default Dashboard