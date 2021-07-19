import Hero from "./Hero"

const Overview = ({ user, project }) => {

  return <>
    <Hero project={project} isIndex />

    <pre>{JSON.stringify(project, null, 2)}</pre>
    <pre>{JSON.stringify(user, null, 2)}</pre>
    
  </>
}

export default Overview