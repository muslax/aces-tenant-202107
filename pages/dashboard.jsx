import Head from 'next/head'

import { APIROUTES, ROUTES } from "config/routes"
import useUser from "hooks/useUser"

import LicenseLayout from "components/layout/LicenseLayout"
import Dashboard from 'components/license/Dashboard'
import Prefetch from 'components/Prefetch'
import useProjects from 'hooks/useProjects'

const LicensePage = () => {
  const { user } = useUser()
  const { projects, isError, isLoading, mutate } = useProjects()

  if (!user || !user.isLoggedIn) return null
  if (isLoading) return null

  return <>
    <Head>
      <title>Dashboard - ACES</title>
    </Head>

    <p>DASHBOARD</p>

    {/* <Dashboard user={user} /> */}
    <pre>{JSON.stringify(user, null, 2)}</pre>

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>

export default LicensePage
