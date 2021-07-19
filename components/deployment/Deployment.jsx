import Hero from "components/project/Hero"

const Deployment = ({ user, project }) => {

  return <>
    <Hero project={project} title="Batch Deployment" />
    <div>
      DEPLOYMENT / {project.title}
    </div>
  </>
}

export default Deployment