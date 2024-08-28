import { hcApi, netApi } from '@api'
import {
  Consumption,
  ConsumptionBehavior,
  GetConsumptionBehaviorRequest,
  GetConsumptionRequest,
  GetMultiMonitorRequest,
  Profile,
  MultiMonitors,
  ReportRequest,
  User
} from './Dashboards.types'
export async function getConsumption(query: GetConsumptionRequest) {
  const result = await netApi.get<Consumption>(
    'dashboards/v2/consumption/date',
    { params: query }
  )

  return result.data
}

export async function getWeeklyConsumption(query: GetConsumptionRequest) {
  const result = await netApi.get<Consumption>(
    'dashboards/v2/consumption/date',
    { params: query }
  )

  return result.data
}

export async function getMedidoresPerfil(query: GetConsumptionRequest) {
  const result = await netApi.get<Consumption>(
    'dashboards/v2/consumption/date',
    { params: query }
  )

  return result.data
}


export async function getConsumptionBehavior(
  query: GetConsumptionBehaviorRequest
) {
  const result = await netApi.get<ConsumptionBehavior>(
    'dashboards/consumption/behavior',
    { params: query }
  )

  return result.data
}

export async function getUser() {
  const result = await hcApi.get<User>('v2/user')

  return result.data
}

export async function getMultiMonitors(query: GetMultiMonitorRequest) {
  const { meterIds, ...rest } = query

  let qs = meterIds?.map(item => `meterIds=${item}`)

  const result = await netApi.get<MultiMonitors>(
    `dashboards/v2/consumption/many?${qs?.join('&')}`,
    { params: rest }
  )
  return result.data
}

export async function report(params: ReportRequest) {
  const result = await hcApi.post(
    `v2/smart/${params.idProfile}/relatorio`,
    params
  )

  return result.data
}

export async function getProfile(): Promise<Profile[]> {
  const result = await hcApi.get('v2/perfis')
  return result.data as Profile[]
}















