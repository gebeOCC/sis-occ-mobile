import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ErrorView, LoadingView } from "./StateViews";

// axios reports a missing connection as ERR_NETWORK (no response at all).
const isOffline = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  (("code" in error && error.code === "ERR_NETWORK") ||
    ("message" in error && error.message === "Network Error"));

/**
 * Renders loading / error / offline states for a React Query result, then calls
 * `children(data)` once data is available.
 */
type QueryBoundaryProps<T> = {
  query: UseQueryResult<T, unknown>;
  loadingFallback?: ReactNode;
  children: (data: T) => ReactNode;
};

export function QueryBoundary<T>({ query, children, loadingFallback }: QueryBoundaryProps<T>) {
  if (query.isPending) return <>{loadingFallback ?? <LoadingView />}</>;
  if (query.isError) {
    return <ErrorView offline={isOffline(query.error)} onRetry={() => query.refetch()} />;
  }
  return <>{children(query.data)}</>;
}
