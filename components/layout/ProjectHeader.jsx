import { useEffect } from "react"

import Link from "next/link"

import LogoutButton from "components/LogoutButton"
import ProjectNav from "./ProjectNav"

const { ACESGray } = require("components/AcesIcons")

const ProjectHeader = ({ user, isForm }) => {

  useEffect(() => {
    const lhHeight = document.getElementById("project-header").clientHeight
    document.getElementById("project-header-pad").style.height = `${lhHeight}px`
  }, [])

  return <>
    <div id="project-header" 
    className="fixed z-50 top-0 left-0 right-0 bg-red-100 xs:bg-gray-100 bg-gradient-to-b from-white"
    >
      <div className={`max-w-4xl mx-auto px-5 py-5`}>
        <div className="flex h-7 items-center space-x-3">
          <div className="flex">
            <Link href="/">
              <a><ACESGray className="h-6" /></a>
            </Link>
          </div>
          <div className="flex flex-grow">
            <Link href="/dashboard">
              <a className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800">
                {user.license.title}
              </a>
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="hidden sm:block text-gray-500 font-bold select-none">{user.fullname}</span>
            <LogoutButton className={`rounded border border-blue-200 font-medium text-blue-400 px-3 py-1
            hover:border-blue-400 hover:bg-blue-400 hover:text-white`} />
          </div>
        </div>
      </div>
    
      <ProjectNav />
    </div>
    <div id="project-header-pad"></div>
  </>
}

export default ProjectHeader