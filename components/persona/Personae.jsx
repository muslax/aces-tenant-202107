import useBatchPersonae from "hooks/useBatchPersonae"

import PageLoading from "components/project/PageLoading"
import Hero from "components/project/Hero"
import Subhead from "components/project/Subhead"
import NoPersonae from "./NoPersonae"

const Personae = ({ user, project, batch, isLoading }) => {
  const isAdmin = user.username == project.admin.username
  const { 
    personae: persons, 
    isLoading: personsLoading, 
    isError: personsError, 
    mutate: mutatePeronae 
  } = useBatchPersonae(batch._id)

  if (isLoading || personsLoading) {
    return <PageLoading 
      project={project} 
      batch={batch} 
      title="ACES Persona" 
    />
  }

  if (persons.length == 0) {
    return <NoPersonae 
      project={project} 
      batch={batch}
      isAdmin={isAdmin} 
    />
  }

  return <>
    <Hero project={project} title="ACES Persona" batch={batch} />

    <Subhead title="Daftar Persona">
      XXX
    </Subhead>

    <pre>{JSON.stringify(persons, null, 2)}</pre>
  </>
}

export default Personae