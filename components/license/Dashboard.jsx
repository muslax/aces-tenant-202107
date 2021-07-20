import useProjects from "hooks/useProjects"
import Link from "next/link"
import { FolderIcon } from "@heroicons/react/solid"

import PageHeading from "./PageHeading"
import { ItemContainer } from "./ItemContainer"

const Dashboard = ({ user }) => {
  const { projects, isError, isLoading, mutate: mutateProjects } = useProjects()

  if (isLoading) return <>Loading...</>

  const icon = <FolderIcon className="h-6 w-6 text-blue-300"/>;

  return <>
    <PageHeading heading="ACES Projects" />

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