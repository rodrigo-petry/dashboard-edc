import { hcApi } from '@api'

import { CurrentConsumption, Goals, MonitorLiveData } from './Proxies.types'

export async function getMonitorLiveData(
  monitorId?: number
): Promise<MonitorLiveData> {
  const result = await hcApi.get<MonitorLiveData>(
    `v3/medidor/${monitorId}/live`
  )

  return result.data
}

export async function getCurrentConsumption(
  monitorId?: number
): Promise<CurrentConsumption> {
  const result = await hcApi.get<CurrentConsumption>(
    `v2/medidor/${monitorId}/consumo-atual`
  )

  return result.data
}

export async function getGoals(monitorId?: number): Promise<Goals> {
  const result = await hcApi.get<Goals>(`v2/metas/${monitorId}/visualizar`)

  return result.data
}
