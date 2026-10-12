import { ErrorView, LoadingView } from "./StateViews";

// axios reports a missing connection as ERR_NETWORK (no response at all).
const isOffline = (error) => error?.code === "ERR_NETWORK" || error?.message === "Network Error";

/**
 * Renders loading / error / offline states for a React Query result, then calls
 * `children(data)` once data is available.
 */
export function QueryBoundary({ query, children }) {
  if (query.isPending) return <LoadingView />;
  if (query.isError) {
    return <ErrorView offline={isOffline(query.error)} onRetry={() => query.refetch()} />;
  }
  return <>{children(query.data)}</>;
}
