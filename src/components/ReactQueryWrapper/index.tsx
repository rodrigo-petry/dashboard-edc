import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

interface ReactQueryWrapperProps {
  children: ReactNode;
}

function ReactQueryWrapper({ children }: ReactQueryWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryWrapper;
