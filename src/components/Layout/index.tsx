import { useRouter } from "next/router";
import { ReactNode } from "react";

import PrivateLayout from "./PrivateLayout";
import AlternativeLayout from "./AlternativeLayout";

const publicRoutes = ["/", "/login"];
const alternativeRoutes = ["/geral"];

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const isPrivate = !publicRoutes.includes(router.pathname);
  const isAlternative = alternativeRoutes.includes(router.pathname);

  if (isAlternative) {
    return <AlternativeLayout>{children}</AlternativeLayout>;
  }

  return isPrivate ? (
    <PrivateLayout>{children}</PrivateLayout>
  ) : (
    <div>{children}</div>
  );
}

export default Layout;
