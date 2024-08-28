import React, { ReactNode, useContext, useEffect, useState } from "react";

export interface PageTitle {
  pageTitle: string;
  setPageTitle: (value: string) => void;
}

export const PageTitleContext = React.createContext({
  pageTitle: "Título",
  setPageTitle(value: string) {},
});

interface PageTitleContextProviderProps {
  children: ReactNode;
}

const PageTitleContextProvider: React.FC<PageTitleContextProviderProps> = ({
  children,
}: PageTitleContextProviderProps) => {
  const [pageTitle, setPageTitle] = useState("Título");

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = (title: string) => {
 
  const { setPageTitle } = useContext(PageTitleContext);

  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);
};

export default PageTitleContextProvider;
