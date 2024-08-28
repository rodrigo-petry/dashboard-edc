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


import {
  Alert,
  AlertHistory,
  AlertsQuery,
  NOTIFICATION_DESTINATIONS,
  NotificationDestination
} from '@core/domain/Alerts/Alerts.types'
import { useAlertHistory, useAlerts, useDeleteAlert, useDeleteHistoryAlert } from '@core/domain/Alerts/Alerts.hooks'

import { usePageTitle } from '@contexts/PageTitleContextProvider'
import Link from 'next/link';
import Table, { ColumnsType } from '@components/_shared/Table'
import AlertsQueryForm from '@components/Alerts/AlertsQueryForm'
import CreateAlertModal from '@components/Alerts/CreateAlertModal'
import UpdateAlertModal from '@components/Alerts/UpdateAlertModal'
import { metricPrefixFormatter } from '@utils/metricPrefix'

function AlertHistoryPage() {
  usePageTitle('Histórico de Alertas')
  useEffect(() => {
    resetInterval()
  },[])

  const modals = useModals()
  const notifications = useNotifications()

  const [createModalOpened, setCreateModalOpened] = useState(false)

  const [selectedAlert, setSelectedAlert] = useState<AlertHistory>()
  const [updateModalOpened, setUpdateModalOpened] = useState(false)

  const [queryParams, setQueryParams] = useState<AlertsQuery | undefined>({
    page: 1,
    pageSize: 10
  })

  const { data, refetch } = useAlertHistory(queryParams)
  

  const deleteMutation = useDeleteHistoryAlert()

  const handleCreateModalClose = () => {
    refetch()

    setCreateModalOpened(false)
  }

  const handleUpdateModalClose = () => {
    refetch()

    setSelectedAlert(undefined)
    setUpdateModalOpened(false)
  }

  const handleDeleteClick = (row: AlertHistory) => {

    modals.openConfirmModal({
      title: 'Remoção de alerta',
      children: (
        <Text size="sm">
          Tem certeza de que deseja remover o alerta: &apos;{row.Nome}&apos;?
        </Text>
      ),
      labels: { confirm: 'Sim, desejo remover', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: deleteMutation.isLoading },
      onConfirm: async () => {
        if(row.Id==null){ return }
       
        const response = await deleteMutation.mutateAsync(parseInt(row.Id))
      
        if ('error' in response){
          notifications.showNotification({
            title: 'Erro ao remover alerta',
            message: response.error
          })
        }
        else{
        notifications.showNotification({
          title: 'Alerta removido',
          message: 'Alerta removido com sucesso.'
        })
     

        refetch()
      }
      }
    })
  }

  const columns: ColumnsType<AlertHistory> = [
    {
      dataIndex: 'Nome',
      title: 'Nome'
    },
  
    {
      dataIndex: 'data_e_hora_de_envio',
      title: 'Data',
      render(value) {
        if (value){
        const date = new Date(value);
       
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because January is 0
        const year = date.getFullYear();
        const dateOnly = `${day}/${month}/${year}`;
        return dateOnly
        } return '-'
      }
    },

    {
      dataIndex: 'data_e_hora_de_envio',
      title: 'Hora',
      render(value) {
        if (value){
        const date = new Date(value);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const timeOnly = `${hours}:${minutes}:${seconds}`;
        return timeOnly
        } return '-'
      }
    },

    {
      dataIndex: 'parametro',
      title: 'Parâmetros',
      render(value) {
        switch (parseInt(value)) {
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
      dataIndex: 'valor_minimo',
      title: 'Mínimo',
      render(value) {
        return value ? metricPrefixFormatter(value) : '-'
      }
    },
    {
      dataIndex: 'valor_maximo',
      title: 'Máximo',
      render(value) {
        return value ? metricPrefixFormatter(value) : '-'
      }
    },

    {
      dataIndex: 'valor_referencia',
      title: 'Medição',
      render(value) {
        return value ? metricPrefixFormatter(value) : '-'
      }
    },

    {
      dataIndex: 'medidor_id',
      title: 'ID Medidor',
      render(value) {
        return value ? value : '-'
      }
    },

    // {
    //   dataIndex: 'notificationDestinations',
    //   title: 'Destinos',
    //   width: 300,
    //   render(value: NotificationDestination[]) {
    //     return (
    //       <Group spacing="xs">
    //         {value.map(item => (
    //           (NOTIFICATION_DESTINATIONS[parseInt(item?.notification_destination)] && 'label' in NOTIFICATION_DESTINATIONS[parseInt(item?.notification_destination)]) ?
    //           <Badge key={item?.Id} variant="outline">
    //             { (NOTIFICATION_DESTINATIONS[parseInt(item?.notification_destination)] && 'label' in NOTIFICATION_DESTINATIONS[parseInt(item?.notification_destination)]) ? NOTIFICATION_DESTINATIONS[parseInt(item?.notification_destination)].label : ''}
    //           </Badge>
    //           : ''
    //         ))}
    //       </Group>
    //     )
    //   }
    // },
    {
      title: 'Ações',
      align: 'center',
      width: 100,
      render(row: AlertHistory) {
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
          <Link href="/alerts">
          <Button>
           Alertas
          </Button>
          </Link>
         
        </Group>
      </Card>

      <Card>
        <Table<AlertHistory>
          data={data?.results}
          columns={columns}
          rowKey={row => row.Id}
        />
        <Group position="right" mt="xl">
          <Pagination
            size="sm"
            page={data?.pagingData && data?.pagingData.page}
            total={data?.pagingData ? data?.pagingData.pageCount : 0}
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

export default AlertHistoryPage
