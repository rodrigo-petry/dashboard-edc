import { useMutation, useQuery } from 'react-query'

import { NotificationsQuery, UpdateNotifications } from './Notifications.types'
import {
  listNotifications,
  deleteNotification,
  updateNotification,
  updateNotifications
} from './Notifications.service'

export function useNotifications(params?: NotificationsQuery) {
  const query = useQuery(
    ['notifications', { ...params }],
    () => {
      return listNotifications(params)
    },
   // { refetchInterval: 30000 }
  )

  return query
}

export function useUpdateNotification() {
  const mutation = useMutation((request: number) => updateNotification(request))

  return mutation
}

export function useUpdateNotifications() {
  const mutation = useMutation((request: UpdateNotifications) =>
    updateNotifications(request)
  )

  return mutation
}

export function useDeleteNotification() {
  const mutation = useMutation((id: number) => deleteNotification(id))

  return mutation
}
