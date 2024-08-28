import { useMutation, useQuery } from "react-query";

import {
  AlertsQuery,
  CreateAlertRequest,
  UpdateAlertRequest,
} from "./Alerts.types";
import {
  createAlert,
  deleteAlert,
  deleteHistoryAlert,
  listAlertHistory,
  listAlerts,
  updateAlert,
} from "./Alerts.service";

export function useAlerts(params?: AlertsQuery) {
  const query = useQuery(["alerts", { ...params }], () => {
    return listAlerts(params);
  });

  return query;
}

export function useAlertHistory(params?: AlertsQuery) {
  const query = useQuery(["alerts", { ...params }], () => {
    return listAlertHistory(params);
  });

  return query;
}

export function useCreateAlert() {
  const mutation = useMutation((request: CreateAlertRequest) =>
    createAlert(request)
  );

  return mutation;
}

export function useUpdateAlert() {
  const mutation = useMutation((request: UpdateAlertRequest) =>
    updateAlert(request)
  );

  return mutation;
}

export function useDeleteAlert() {
  const mutation = useMutation((id: number) => deleteAlert(id));

  return mutation;
}

export function useDeleteHistoryAlert() {
  const mutation = useMutation((id: number) => deleteHistoryAlert(id));

  return mutation;
}