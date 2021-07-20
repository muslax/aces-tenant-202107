import Head from 'next/head'

import { APIROUTES, ROUTES } from "config/routes"
import useUser from "hooks/useUser"

import FormLayout from "components/layout/FormLayout"
import NewProject from 'components/license/NewProject'
import Prefetch from 'components/Prefetch'

const NewProjectPage = () => {
  const { user } = useUser()

  return <>
    <Head>
      <title>New Project - ACES</title>
    </Head>

    <NewProject user={user} />

    {/* <Prefetch uri={`${APIROUTES.GET.MODULES}`} /> */}
  </>
}

NewProjectPage.redirectUnAuthenticatedTo = ROUTES.Login
NewProjectPage.getLayout = (page) => <FormLayout>{page}</FormLayout>

export default NewProjectPage
