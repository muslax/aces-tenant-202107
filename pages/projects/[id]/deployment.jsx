import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useProject from "hooks/useProject";
import useUser from "hooks/useUser";

import ProjectLayout from "components/layout/ProjectLayout";
import Deployment from "components/deployment/Deployment";
import Prefetch from "components/Prefetch";

// Project routes must provide user and project props
// to its main component

const DeploymentPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { id: pid } = router.query
  const { project, isLoading, isError, mutate: mutateProject } = useProject(pid)

  if (isLoading) return <p>LOADING...</p>
  if (isError) return <p>PROJECT NOT FOUND</p>

  return (
    <div>
      <Head>
        <title>Deployment: {project.title} - ACES</title>
      </Head>
      
      <Deployment user={user} project={project} />

      <div className="prefetch hidden">
        <Prefetch uri={`${APIROUTES.GET.PROJECTS}`} />
      </div>
    </div>
  )
}

DeploymentPage.redirectUnAuthenticatedTo = ROUTES.Login;
DeploymentPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default DeploymentPage
