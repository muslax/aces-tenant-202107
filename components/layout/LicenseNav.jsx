import Link from "next/link"
import { useRouter } from "next/router"

import { FolderAddIcon } from "@heroicons/react/outline"
import { PhotographIcon, PlusCircleIcon } from "@heroicons/react/solid"

const LicenseNav = ({ user }) => {
  const router = useRouter()
  const path = router.asPath

  const navigation = [
    { label: 'Projects',    href: `/dashboard` },
    { label: 'Clients',     href: `/clients` },
    // { label: 'Users',     href: `/users` },
    { label: 'Settings',  href: `/settings` },
  ]

  const showNewProject = user.licenseOwner && path == "/dashboard"
  const showNewUser = user.licenseOwner && path == "/users"
  const showUploader = user.licenseOwner && path == "/license"

  return <>
    <div className="max-w-4xl mx-auto px-5">
      <nav className="py--3 border-b border-blue-300">
        <div className="flex items-center space-x-3 xs:space-x-5 sm:space-x-7">
          {/* <Link href="/dashboard"><a className="text-blue-500">Dashboard</a></Link>
          <Link href="/clients"><a className="text-blue-500">Clients</a></Link>
          <Link href="/users"><a className="text-blue-500">Users</a></Link>
          <Link href="/license"><a className="text-blue-500">License</a></Link> */}
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href}>
              <a className={`text-blue-500 pt-3 pb-2 border-b-4 
                ${href == path 
                ? 'border-blue-400 border-opacity-80'
                : 'border-transparent hover:border-blue-400 hover:border-opacity-25'} 
              `}>{label}</a>
            </Link>
          ))}
          <div className="flex-grow flex justify-end">
            {/* {showNewProject && <>
              <PlusCircleIcon className="w-5 h-5 mr-1 text-red-500 peer-hover:text-pink-600" />
              <Link href="/new-project">
                <a className="peer text-pink--600 hover:text-red-500 font-semibold -ml-6 pl-6">New Project</a>
              </Link>
            </>} */}
            {showNewUser && <>
              <PlusCircleIcon className="w-5 h-5 mr-1 text-red-500 peer-hover:text-pink-600" />
              <Link href="/new-user">
                <a className="peer text-pink--600 hover:text-red-600 font-semibold -ml-6 pl-6">Add User</a>
              </Link>
            </>}
            {showUploader && <>
              <PhotographIcon className="w-5 h-5 mr-1 text-red-500 peer-hover:text-pink-600" />
              <Link href="/upload-logo">
                <a className="peer text-pink--600 hover:text-red-600 font-semibold -ml-6 pl-6">Upload Logo</a>
              </Link>
            </>}
          </div>
        </div>
      </nav>
    </div>
  </>
}

export default LicenseNav