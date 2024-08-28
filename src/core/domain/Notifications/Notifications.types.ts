import { PagedQueryBase } from '@core/request/net/PagedQueryBase'

export interface Notification {
  id: number
  alertId: number
  clientId: number
  content: string
  viewed: boolean
}

export interface NotificationsQuery extends PagedQueryBase {
  clientId?: number
  viewed?: boolean
}

export interface UpdateNotifications {
  clientId?: number
  vieweds?: boolean
}
