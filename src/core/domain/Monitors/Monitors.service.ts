import { netApi } from "@api";

import {
  Monitor,
  MonitorsQuery,
  MonitorsResult,
  UpdateMonitorRequest,
  UpdateMonitorResult,
} from "./Monitors.types";

export async function listMonitors(query?: MonitorsQuery): Promise<Monitor[]> {
  const result = await netApi.get<MonitorsResult>("monitors", {
    params: query,
  });

  return result.data.monitors;
}

export async function updateMonitor(
  req: UpdateMonitorRequest
): Promise<UpdateMonitorResult> {
  const result = await netApi.post<UpdateMonitorResult>("monitors", req);

  return result.data;
}

