import Head from 'next/head';

import { APIROUTES, ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import Settings from 'components/license/Settings';
import Prefetch from 'components/Prefetch';

const LicensePage = () => {
  const { user } = useUser();

  return <>
    <Head>
      <title>License Info - ACES</title>
    </Head>

    <Settings user={user} />

    <Prefetch uri={`${APIROUTES.GET.MODULES}`} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;
