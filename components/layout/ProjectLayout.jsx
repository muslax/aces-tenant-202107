import useUser from "hooks/useUser"

import ProjectHeader from "./ProjectHeader"
import ProjectNav from "components/layout/ProjectNav";

export default function ProjectLayout({ children }) {
  // Prevent showing something before rerouting
  const { user } = useUser()
  if (!user || !user.isLoggedIn) return null // <>ERROR</>

  return <>
    <div id="project-container" className="">
      <ProjectHeader user={user} />

      {/* <ProjectNav /> */}

      <main className="max-w-4xl mx-auto px-5 pb-24">
        {children}
      </main>
    </div>
  </>
}