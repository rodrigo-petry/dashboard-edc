import { useMutation, useQuery } from "react-query";

import { listMonitors, updateMonitor } from "./Monitors.service";
import { MonitorsQuery, UpdateMonitorRequest } from "./Monitors.types";

export  function  useMonitors(params?: MonitorsQuery) {
  const query = useQuery(["monitors", params], () => listMonitors(params));

  return query;
}

export function useUpdateMonitor() {
  const mutation = useMutation((obj: UpdateMonitorRequest) =>
    updateMonitor(obj)
  );

  return mutation;
}
