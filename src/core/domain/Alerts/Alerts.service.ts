import { hcApi, netApi } from "@api";

import { PagedResult } from "@core/request/net/PagedResult";

import {
  Alert,
  AlertHistory,
  AlertsQuery,
  CreateAlertRequest,
  UpdateAlertRequest,
} from "./Alerts.types";

export async function listAlerts(
  query?: AlertsQuery
): Promise<PagedResult<Alert>> {
  const result = await netApi.get<PagedResult<Alert>>("notifications/alerts", {
    params: query,
  });
  
  return result.data;
}

export async function listAlertHistory(
  query?: AlertsQuery
): Promise<PagedResult<AlertHistory>> {
  const result = await hcApi.get<PagedResult<AlertHistory>>("v2/controle-notificacao/listar", {
    params: query,
  });
 
  return result.data;
}


export async function createAlert(request: CreateAlertRequest) {
  const result = await netApi.post<CreateAlertRequest>(
    "notifications/alerts",
    request
  );

  return result.data;
}

export async function updateAlert(request: UpdateAlertRequest) {
  const result = await netApi.put<UpdateAlertRequest>(
    `notifications/alerts/${request.id}`,
    request
  );

  return result.data;
}

export async function deleteAlert(id: number) {
  const result = await netApi.delete(`notifications/alerts/${id}`);

  return result.data;
}

export async function deleteHistoryAlert(id: number) {
  const result = await hcApi.delete(`v2/controle-notificacao/${id}/excluir`);

  return result.data;
}