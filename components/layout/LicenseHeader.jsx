import { useEffect } from "react"

import { useRouter } from "next/router"
import Link from "next/link"

import LogoutButton from "components/LogoutButton"

const { ACESGray } = require("components/AcesIcons")

const LicenseHeader = ({ user, isForm }) => {
  const router = useRouter()

  useEffect(() => {
    const lhHeight = document.getElementById("license-header").clientHeight
    document.getElementById("license-header-pad").style.height = `${lhHeight}px`
  }, [])

  return <>
    <div id="license-header" 
    className="fixed z-50 top-0 left-0 right-0 bg-blue-50"
    >
      <div className={`${isForm ? 'max-w-4xl' : 'max-w-4xl'} mx-auto px-5 py-4`}>
        <div className="flex h-7 items-center space-x-3">
          <div className="flex">
            <Link href="/">
              <a><ACESGray className="h-6" /></a>
            </Link>
          </div>
          <div className="flex flex-grow">
            {/* <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600"> */}
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800">
              {isForm ? user.license.title : 'By Gaia Solutions'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            {!isForm && <>
              <span className="hidden sm:block text-gray-500 font-bold select-none">{user.fullname}</span>
              <LogoutButton className={`rounded border border-blue-200 font-medium text-blue-400 px-3 py-1
              hover:border-blue-400 hover:bg-blue-400 hover:text-white`} />
            </>}
          </div>
        </div>
      </div>
    </div>
    <div id="license-header-pad"></div>
  </>
}

export default LicenseHeader