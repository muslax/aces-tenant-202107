import Head from 'next/head'

import { APIROUTES, ROUTES } from "config/routes"
import useUser from "hooks/useUser"

import FormLayout from "components/layout/FormLayout"
import NewUser from 'components/license/NewUser'
import Prefetch from 'components/Prefetch'

const NewUserPage = () => {
  const { user } = useUser()

  return <>
    <Head>
      <title>New User - ACES</title>
    </Head>

    <NewUser user={user} />

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>
}

NewUserPage.redirectUnAuthenticatedTo = ROUTES.Login
NewUserPage.getLayout = (page) => <FormLayout>{page}</FormLayout>

export default NewUserPage
