import { useMutation, useQuery } from 'react-query'
import {
  getConsumption,
  getConsumptionBehavior,
  getMultiMonitors,
  getProfile,
  getUser,
  report
} from './Dashboards.service'
import {
  GetConsumptionBehaviorRequest,
  GetConsumptionRequest,
  GetMultiMonitorRequest,
  ReportRequest
} from './Dashboards.types'

export function useConsumption(params: GetConsumptionRequest) {
  const query = useQuery(
    ['consumption', { ...params }],
    () => getConsumption(params),
    { enabled: !!params.meterId && !!params.startDate && !!params.endDate }
  )

  return query
}

export function useConsumptionBehavior(params: GetConsumptionBehaviorRequest) {
  const query = useQuery(
    ['consumption', { ...params }, 'behavior'],
    () => getConsumptionBehavior(params),
    { enabled: !!params.meterId }
  )

  return query
}

export function useMultiMonitors(params: GetMultiMonitorRequest) {
  const query = useQuery(
    ['consumption', { ...params }, 'many'],
    () =>  getMultiMonitors(params),
    { enabled: !!params.meterIds && params.meterIds.length > 0}
  )

  return query
}

export function useReport() {
  const mutation = useMutation((req: ReportRequest) => report(req))
  return mutation
}

export function useProfile() {
  const query = useQuery(['profile'], () => getProfile())
  return query
}

export function useUser() {
  const query = useQuery(['user'], () => getUser())
  return query
}
