import { ActionIcon, Badge, Divider, Grid, Menu, Text } from '@mantine/core'
import { useNotifications as useMantineNotifications } from '@mantine/notifications'
import { createStyles } from '@mantine/styles'
import { BellIcon, TrashIcon } from '@modulz/radix-icons'
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps
} from 'react-virtualized'

import {
  useDeleteNotification,
  useNotifications,
  useUpdateNotification,
  useUpdateNotifications
} from '@core/domain/Notifications/Notifications.hooks'
import {
  Notification,
  UpdateNotifications
} from '@core/domain/Notifications/Notifications.types'
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'
import { useModals } from '@mantine/modals'
import { useState } from 'react'

const useStyles = createStyles(theme => ({
  notificationWrapper: {
    position: 'relative',
    display: 'flex'
  },
  notificationMenu: {},
  notificationContent: {
    '.mantine-Menu-itemBody': {
      display: 'block'
    }
  },
  notificationIcon: {
    color: theme.primaryColor
  },
  notificationCreatedAt: {
    color: theme.colors.dark[2],
    fontSize: theme.fontSizes.xs
  },
  badge: {
    position: 'absolute',
    right: -15,
    top: -10
  }
}))

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50
})

function NotificationDropdown() {
  const { classes } = useStyles()

  const { data, refetch } = useNotifications({ pageSize: 15 })

  const deleteMutation = useDeleteNotification()
  const updateMutation = useUpdateNotification()
  const updatesMutation = useUpdateNotifications()

  const notifications = useMantineNotifications()

  const modals = useModals()

  const notificationsNotViewed =
    data?.results.filter(item => !item.viewed) || []

  const [view, setView] = useState<boolean>(() => {
    if (notificationsNotViewed.length > 0) {
      return false
    }
    return true
  })

  const handleDeleteClick = (row: Notification) => {
    modals.openConfirmModal({
      title: 'Remoção de notificação',
      children: (
        <Text size="sm">
          Tem certeza de que deseja remover essa notificação?
        </Text>
      ),
      labels: { confirm: 'Sim, desejo remover', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: deleteMutation.isLoading },
      onConfirm: async () => {
        await deleteMutation.mutateAsync(row.id)

        notifications.showNotification({
          title: 'Notificação removida',
          message: 'Notificação removida com sucesso.'
        })

        refetch()
      }
    })
  }

  const handleUpdateNotification = async (value: number) => {
    try {
      await updateMutation.mutateAsync(value)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateNotifications = async (values: UpdateNotifications) => {
    try {
      const obj: UpdateNotifications = {
        ...values,
        vieweds: values.vieweds
      }

      await updatesMutation.mutateAsync(obj)
      setView(!view)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    const notification = data?.results[index]

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        style={style}
      >
        <div className={classes.notificationContent}>
          <Menu.Item>
            <Grid style={{ width: '100%' }}>
              <Grid.Col span={2}>
                {notification?.viewed ? (
                  <FaEnvelopeOpen
                    className={classes.notificationIcon}
                    onClick={() => handleUpdateNotification(notification.id)}
                  />
                ) : notification && !notification?.viewed ? (
                  <FaEnvelope
                    className={classes.notificationIcon}
                    onClick={() => handleUpdateNotification(notification.id)}
                  />
                ) : null}
              </Grid.Col>
              <Grid.Col span={8}>
                <div className={classes.notificationContent}>
                  {notification?.content}
                </div>
              </Grid.Col>
              <Grid.Col span={2}>
                {notification ? (
                  <TrashIcon onClick={() => handleDeleteClick(notification)} />
                ) : null}
              </Grid.Col>
            </Grid>
          </Menu.Item>
        </div>
      </CellMeasurer>
    )
  }

  return (
    <div className={classes.notificationWrapper}>
      <Menu
        p={0}
        size="xl"
        position="bottom"
        placement="end"
        gutter={19}
        control={
          <ActionIcon radius="xl" size="lg" variant="filled">
            <BellIcon />
          </ActionIcon>
        }
      >
        <Menu.Label>Notificações</Menu.Label>
        <List
          width={300}
          height={300}
          autoHeight={true}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          rowCount={data?.results.length || 0}
        />
        <Divider />
        <Menu.Item
          onClick={() =>
            view != undefined
              ? handleUpdateNotifications({ vieweds: view })
              : null
          }
        >
          {!notificationsNotViewed.length
            ? 'Marcar todas como não lidas'
            : 'Marcar todas como lidas'}
        </Menu.Item>
      </Menu>
      {notificationsNotViewed.length ? (
        <Badge color="red" variant="filled" className={classes.badge}>
          {notificationsNotViewed.length}
        </Badge>
      ) : null}
    </div>
  )
}

export default NotificationDropdown
