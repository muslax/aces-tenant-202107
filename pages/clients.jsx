import Head from 'next/head';

import { APIROUTES, ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import Clients from 'components/license/Clients';
import Prefetch from 'components/Prefetch';

const LicensePage = () => {
  const { user } = useUser();

  if (!user || !user.isLoggedIn) return null;

  return <>
    <Head>
      <title>Clients - ACES</title>
    </Head>

    <Clients user={user} />

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;
