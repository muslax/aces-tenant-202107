import Link from "next/link"
import { useRouter } from "next/router"

import { FolderAddIcon } from "@heroicons/react/outline"
import { UserAddIcon } from "@heroicons/react/solid"

const LicenseNav = ({ user }) => {
  const router = useRouter()
  const path = router.asPath

  const showNewProject = user.licenseOwner && path == "/dashboard"
  const showNewUser = user.licenseOwner && path == "/users"

  return <>
    <div className="max-w-4xl mx-auto px-5">
      <nav className="py-3 border-b border-blue-200">
        <div className="flex items-center space-x-5 sm:space-x-7">
          <Link href="/dashboard"><a className="text-blue-500">Dashboard</a></Link>
          <Link href="/clients"><a className="text-blue-500">Clients</a></Link>
          <Link href="/users"><a className="text-blue-500">Users</a></Link>
          <Link href="/license"><a className="text-blue-500">License</a></Link>
          <div className="flex-grow flex justify-end">
            {showNewProject && <>
              <FolderAddIcon className="w-5 h-5 mr-1 text-blue-500 peer-hover:text-pink-600" />
              <Link href="/new-project">
                <a className="peer text-pink-600 hover:text-blue-500 font-semibold -ml-6 pl-6">New Project</a>
              </Link>
            </>}
            {showNewUser && <>
              <UserAddIcon className="w-5 h-5 mr-1 text-blue-500 peer-hover:text-pink-600" />
              <Link href="/new-user">
                <a className="peer text-pink-600 hover:text-blue-600 font-semibold -ml-6 pl-6">Add User</a>
              </Link>
            </>}
          </div>
        </div>
      </nav>
    </div>
  </>
}

export default LicenseNav