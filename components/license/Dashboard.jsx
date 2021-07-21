import { useRouter } from "next/router"
import Link from "next/link"

import useProjects from "hooks/useProjects"
import { FolderIcon } from "@heroicons/react/solid"

import PageHeading from "./PageHeading"
import PageLoading from "components/PageLoading"
import { ItemContainer } from "./ItemContainer"

const Dashboard = ({ user }) => {
  const router = useRouter()

  const { projects, isError, isLoading, mutate: mutateProjects } = useProjects()

  if (isLoading) return <PageLoading />

  const icon = <FolderIcon className="h-6 w-6 text-blue-300"/>;

  return <>
    <div className="h-3"></div>
    <PageHeading heading="ACES Projects">
      {user.licenseOwner && (
        <button 
          className="group h-9 flex items-center rounded border text-blue-500 border-blue-300 hover:shadow-sm hover:border-blue-400 pl-2 pr-3"
          onClick={e => router.push('/new-project')}
        >
          <FolderIcon className="w-5 h-5 text-yellow-400 group-hover:text-pink-400" />
          <span className="h-8 flex items-center font-semibold pl-2">New Project</span>
        </button>
      )}
    </PageHeading>

    <div className="flex flex-col space-y-2">
      {projects.map(p => (
        <ItemContainer key={p._id} icon={icon}>
          <div className="text-base mb-1">
            <Link href={`/projects/${p._id}`}>
              <a className="font-semibold text-blue-500 hover:text-blue-600">{p.title}</a>
            </Link>
          </div>
          <div className="">
            <p className="mb-1">Client: <span className="font-semibold">{p.client.name}, {p.client.city}</span></p>
            <p className="mb-1">Admin: <span className="font-semibold">{p.admin.fullname}</span></p>
          </div>
        </ItemContainer>
      ))}
    </div>

    {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
  </>
}

export default Dashboard