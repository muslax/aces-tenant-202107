import Hero from "components/project/Hero"

const Modules = ({ user, project }) => {

  return <>
    <Hero project={project} title="ACES Modules" />
    <div>
      MODULES / {project.title}
    </div>
  </>
}

export default Modules