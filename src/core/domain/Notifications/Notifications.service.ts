import { netApi } from '@api'
import { PagedResult } from '@core/request/net/PagedResult'

import {
  Notification,
  NotificationsQuery,
  UpdateNotifications
} from './Notifications.types'

export async function listNotifications(
  query?: NotificationsQuery
): Promise<PagedResult<Notification>> {
  const result = await netApi.get<PagedResult<Notification>>('notifications', {
    params: query
  })

  return result.data
}

export async function updateNotification(request: number) {
  const result = await netApi.put(`notifications/${request}/view`)

  return result.data
}

export async function updateNotifications(request: UpdateNotifications) {
  const result = await netApi.put(`notifications/view/all`, request)
  return result.data
}

export async function deleteNotification(id: number) {
  const result = await netApi.delete(`notifications/${id}`)

  return result.data
}
