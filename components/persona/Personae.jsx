import Hero from "components/project/Hero"

const Personae = ({ user, project }) => {

  return <>
    <Hero project={project} title="ACES Persona" />
    <div>
      PERSONA / {project.title}
    </div>
  </>
}

export default Personae