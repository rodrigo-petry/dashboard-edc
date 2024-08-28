import { useState } from 'react'
import { Button, Group, Skeleton } from '@mantine/core'
import dayjs from 'dayjs'
import { ResponsiveLine } from '@nivo/line'
import { FaSlidersH } from 'react-icons/fa'

import { Monitor } from '@core/domain/Monitors/Monitors.types'
import { GetConsumptionRequest } from '@core/domain/Dashboards/Dashboards.types'
import { useConsumption } from '@core/domain/Dashboards/Dashboards.hooks'
import {
  getLineChartPropsByGroupType,
  transformConsumptionToLineChartData
} from '@core/domain/Dashboards/Dashboards.utils'

import { metricPrefixFormatter } from '@utils/metricPrefix'

import DashboardQueryModal from '@components/Dashboard/DashboardQueryModal'

interface MonitorConsumptionProps {
  startDate?: Date
  endDate?: Date
  meter?: Monitor
}

function MonitorConsumption({ meter }: MonitorConsumptionProps) {
  const [queryModalOpen, setQueryModalOpen] = useState(false)

  const [queryParams, setQueryParams] = useState<GetConsumptionRequest>({
    meterId: meter?.meterId,
    startDate: dayjs().startOf('day').toISOString(),
    endDate: dayjs().endOf('day').toISOString(),
    groupType: 1,
    parameters: 1
  })

  const { data, isFetching } = useConsumption(queryParams)

  const chartData = transformConsumptionToLineChartData('activePowerData', data)

  const handleQueryModalClose = () => {
    setQueryModalOpen(false)
  }

  return (
    <Skeleton visible={isFetching} mt="sm">
      <Group>
        <Button
          variant="outline"
          leftIcon={<FaSlidersH />}
          onClick={() => setQueryModalOpen(true)}
        >
          Filtros
        </Button>
      </Group>
      <div style={{ height: '300px' }}>
        {data?.items && data.items.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 24, right: 100, bottom: 55, left: 48 }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%S',
              useUTC: false
            }}
            xFormat="time:%d/%m/%Y - %H:%M"
            yFormat={value => `${metricPrefixFormatter(+value)}W`}
            enableGridX={false}
            enablePoints={false}
            enableSlices="x"
            isInteractive
            useMesh
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 50,
              ...getLineChartPropsByGroupType(queryParams.groupType),
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        ) : (
          'Não há dados!'
        )}
      </div>
      <DashboardQueryModal
        opened={queryModalOpen}
        onClose={handleQueryModalClose}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </Skeleton>
  )
}

export default MonitorConsumption
