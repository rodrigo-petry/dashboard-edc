import { useState, useEffect } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Space,
  Text
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useModals } from '@mantine/modals'
import { FaTrash, FaEdit } from 'react-icons/fa'
import resetInterval from "@utils/resetInterval"
import Link from 'next/link';

import {
  Alert,
  AlertsQuery,
  NOTIFICATION_DESTINATIONS
} from '@core/domain/Alerts/Alerts.types'
import { useAlerts, useDeleteAlert } from '@core/domain/Alerts/Alerts.hooks'

import { usePageTitle } from '@contexts/PageTitleContextProvider'

import Table, { ColumnsType } from '@components/_shared/Table'
import AlertsQueryForm from '@components/Alerts/AlertsQueryForm'
import CreateAlertModal from '@components/Alerts/CreateAlertModal'
import UpdateAlertModal from '@components/Alerts/UpdateAlertModal'
import { metricPrefixFormatter } from '@utils/metricPrefix'

function AlertsPage() {
  usePageTitle('Alertas')
  useEffect(() => {
    resetInterval()
  },[])

  const modals = useModals()
  const notifications = useNotifications()

  const [createModalOpened, setCreateModalOpened] = useState(false)

  const [selectedAlert, setSelectedAlert] = useState<Alert>()
  const [updateModalOpened, setUpdateModalOpened] = useState(false)

  const [queryParams, setQueryParams] = useState<AlertsQuery | undefined>({
    page: 1,
    pageSize: 10
  })

  const { data, refetch } = useAlerts(queryParams)
  

  const deleteMutation = useDeleteAlert()

  const handleCreateModalClose = () => {
    refetch()

    setCreateModalOpened(false)
  }

  const handleUpdateModalClose = () => {
    refetch()

    setSelectedAlert(undefined)
    setUpdateModalOpened(false)
  }

  const handleDeleteClick = (row: Alert) => {
    modals.openConfirmModal({
      title: 'Remoção de alerta',
      children: (
        <Text size="sm">
          Tem certeza de que deseja remover o alerta: &apos;{row.name}&apos;?
        </Text>
      ),
      labels: { confirm: 'Sim, desejo remover', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: deleteMutation.isLoading },
      onConfirm: async () => {
        await deleteMutation.mutateAsync(row.id)

        notifications.showNotification({
          title: 'Alerta removido',
          message: 'Alerta removido com sucesso.'
        })

        refetch()
      }
    })
  }

  const columns: ColumnsType<Alert> = [
    {
      dataIndex: 'name',
      title: 'Nome'
    },
    {
      title: 'Monitor',
      render(value, record) {
        return record.meter && (record.meter.name || record.meter.id)
      }
    },
    {
      dataIndex: 'parameter',
      title: 'Parâmetros',
      render(value) {
        switch (value) {
          case 0:
            return 'Potência Ativa'
          case 1:
            return 'Potência Reativa'
          case 2:
            return 'Potência Aparente'
          case 3:
            return 'Corrente'
          case 4:
            return 'Tensão'
          case 5:
            return 'Frequência'
          case 6:
            return 'Fator de Potência'
          case 7:
            return 'Temperatura'
          case 8:
            return 'Umidade'
          default:
            break
        }
      }
    },
    {
      dataIndex: 'minValue',
      title: 'Mínimo',
      render(value) {
        return value ? metricPrefixFormatter(value) : '-'
      }
    },
    {
      dataIndex: 'maxValue',
      title: 'Máximo',
      render(value) {
        return value ? metricPrefixFormatter(value) : '-'
      }
    },
    {
      dataIndex: 'notificationDestinations',
      title: 'Destinos',
      width: 300,
      render(value: number[]) {
        return (
          <Group spacing="xs">
            {value.map(item => (
              <Badge key={item} variant="outline">
                { (NOTIFICATION_DESTINATIONS[item] && 'label' in NOTIFICATION_DESTINATIONS[item]) ? NOTIFICATION_DESTINATIONS[item].label : ''}
              </Badge>
            ))}
          </Group>
        )
      }
    },
    {
      title: 'Ações',
      align: 'center',
      width: 100,
      render(row: Alert) {
        return (
          <Group position="center">
        
            <ActionIcon color="red" onClick={() => handleDeleteClick(row)}>
              <FaTrash />
            </ActionIcon>
          </Group>
        )
      }
    }
  ]

  return (
    <Group grow direction="column">
      <Card>
        <Group position="apart">
          <AlertsQueryForm
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
      
      <Group>
      <Link href="/alert-history">
                <Button>
                Histórico
                </Button>
                </Link>

          <Button onClick={() => setCreateModalOpened(true)}>
            Novo Alerta
          </Button>
        </Group>
        </Group>
      </Card>

      <Card>
        <Table<Alert>
          data={data?.results}
          columns={columns}
          rowKey={row => row.id}
        />
        <Group position="right" mt="xl">
          <Pagination
            size="sm"
            page={data?.pagingData.page}
            total={data?.pagingData.pageCount || 0}
            onChange={page => setQueryParams(prev => ({ ...prev, page }))}
          />
        </Group>
      </Card>

      <CreateAlertModal
        opened={createModalOpened}
        onClose={() => handleCreateModalClose()}
      />

      <UpdateAlertModal
        opened={updateModalOpened}
        onClose={() => handleUpdateModalClose()}
        alert={selectedAlert}
      />
    </Group>
  )
}

export default AlertsPage
