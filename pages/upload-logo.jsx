import Head from 'next/head'

import { APIROUTES, ROUTES } from "config/routes"
import useUser from "hooks/useUser"

import FormLayout from "components/layout/FormLayout"
import NewProject from 'components/license/NewProject'
import Prefetch from 'components/Prefetch'
import UploadLogo from 'components/license/UploadLogo'

const UploadLogoPage = () => {
  const { user } = useUser()

  return <>
    <Head>
      <title>Upload Logo - ACES</title>
    </Head>

    <UploadLogo user={user} />

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>
}

UploadLogoPage.redirectUnAuthenticatedTo = ROUTES.Login
UploadLogoPage.getLayout = (page) => <FormLayout>{page}</FormLayout>

export default UploadLogoPage
