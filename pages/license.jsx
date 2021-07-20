import Head from 'next/head';

import { APIROUTES, ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import License from 'components/license/License';
import Prefetch from 'components/Prefetch';

const LicensePage = () => {
  const { user } = useUser();

  return <>
    <Head>
      <title>License Info - ACES</title>
    </Head>

    <License user={user} />

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;
