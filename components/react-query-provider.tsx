"use client";

import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

const reactQueryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
} satisfies QueryClientConfig;

export function ReactQueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(reactQueryConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
