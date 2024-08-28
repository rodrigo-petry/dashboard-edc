import { useQuery } from "react-query";
import {
  getCurrentConsumption,
  getGoals,
  getMonitorLiveData,
} from "./Proxies.service";

export function useMonitorLiveData(monitorId?: number) {
  const query = useQuery(
    ["proxies", monitorId, "live"],
    () => getMonitorLiveData(monitorId),
    {
      enabled: !!monitorId,
    }
  );

  return query;
}

export function useCurrentConsumption(monitorId?: number) {
  const query = useQuery(
    ["proxies", monitorId, "consumption"],
    () => getCurrentConsumption(monitorId),
    {
      enabled: !!monitorId,
    }
  );

  return query;
}

export function useGoals(monitorId?: number) {
  const query = useQuery(
    ["proxies", monitorId, "goals"],
    () => getGoals(monitorId),
    {
      enabled: !!monitorId,
    }
  );

  return query;
}
