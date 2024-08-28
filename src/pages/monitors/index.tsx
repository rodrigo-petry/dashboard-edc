import { useState, useEffect } from 'react'
import { ActionIcon, Card, Group, Space } from '@mantine/core'
import { FaEye, FaTachometerAlt } from 'react-icons/fa'
import { useRouter } from 'next/router'

import { useMonitors } from '@core/domain/Monitors/Monitors.hooks'
import { Monitor, MonitorsQuery } from '@core/domain/Monitors/Monitors.types'

import { usePageTitle } from '@contexts/PageTitleContextProvider'

import Table, { ColumnsType } from '@components/_shared/Table'
import MonitorsQueryForm from '@components/Monitors/MonitorsQueryForm'
import resetInterval from "@utils/resetInterval"


function MonitorsPage() {
  usePageTitle('Monitores')
  useEffect(() => {
    resetInterval()
  },[])

  const router = useRouter()

  const [queryParams, setQueryParams] = useState<MonitorsQuery | undefined>()

  const { data, isFetching } = useMonitors(queryParams)

  const columns: ColumnsType<Monitor> = [
    {
      dataIndex: 'meterId',
      title: 'ID',
      render: value => value || '-'
    },
    {
      dataIndex: 'name',
      title: 'Nome',
      render: value => value || '-'
    },
    {
      dataIndex: 'consumption',
      width: 300,
      align: 'center',
      title: 'Consumo Consolidado (kWh)',
      render: value => Number(value).toFixed(5) || '-'
    },
    {
      dataIndex: 'avereageDemand',
      title: 'Demanda Máxima (kW)',
      width: 300,
      align: 'center',
      render: value => Number(value).toFixed(5) || '-'
    },
    {
      title: 'Ações',
      align: 'center',
      width: 100,
      render(row: Monitor) {
        return (
          <Group position="center">
            <ActionIcon
              color="brand"
              onClick={() => router.push(`/monitors/${row.meterId}`)}
            >
              <FaEye />
            </ActionIcon>
          </Group>
        )
      }
    }
  ]

  return (
    <Group grow direction="column">
      <Card>
        <MonitorsQueryForm
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      </Card>
      <Card>
        <Table<Monitor>
          loading={isFetching}
          data={data}
          columns={columns}
          rowKey={row => row.meterId}
        />
      </Card>
    </Group>
  )
}

export default MonitorsPage
