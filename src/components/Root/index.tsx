import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

import LoggedUserContextProvider from "@contexts/UserAuthDataContextProvider";
import PageTitleContextProvider from "@contexts/PageTitleContextProvider";

import ReactQueryWrapper from "@components/ReactQueryWrapper";
import MantineWrapper from "@components/MantineWrapper";
import Layout from "@components/Layout";
import MotionPageWrapper from "@components/MotionPageWrapper";

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  return (
    <CookiesProvider>
      <LoggedUserContextProvider>
        <ReactQueryWrapper>
          <MantineWrapper>
            <PageTitleContextProvider>
              <Layout>
                <MotionPageWrapper>{children}</MotionPageWrapper>
              </Layout>
            </PageTitleContextProvider>
          </MantineWrapper>
        </ReactQueryWrapper>
      </LoggedUserContextProvider>
    </CookiesProvider>
  );
}

export default Root;
