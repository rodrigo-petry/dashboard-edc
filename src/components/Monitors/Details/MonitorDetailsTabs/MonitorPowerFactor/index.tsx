import { useState } from 'react'
import dayjs from 'dayjs'
import { ResponsiveBar } from '@nivo/bar'
import { FaSlidersH } from 'react-icons/fa'
import { Button, Group, Skeleton } from '@mantine/core'

import { Monitor } from '@core/domain/Monitors/Monitors.types'
import { useConsumption } from '@core/domain/Dashboards/Dashboards.hooks'
import { GetConsumptionRequest } from '@core/domain/Dashboards/Dashboards.types'

import DashboardQueryModal from '@components/Dashboard/DashboardQueryModal'
import { transformPowerFactorToBarChartData } from '@core/domain/Dashboards/Dashboards.utils'
import { metricPrefixFormatter } from '@utils/metricPrefix'

interface MonitorPowerFactorProps {
  meter?: Monitor
}

function MonitorPowerFactor({ meter }: MonitorPowerFactorProps) {
  const [queryModalOpen, setQueryModalOpen] = useState(false)

  const [queryParams, setQueryParams] = useState<GetConsumptionRequest>({
    meterId: meter?.meterId,
    startDate: dayjs().startOf('day').toISOString(),
    endDate: dayjs().endOf('day').toISOString(),
    groupType: 3,
    parameters: 0
  })

  const { data, isFetching } = useConsumption(queryParams)

  const chartData = transformPowerFactorToBarChartData(data)

  const handleQueryModalClose = () => {
    setQueryModalOpen(false)
  }

  return (
    <>
      <Skeleton visible={isFetching} mt="sm">
        {/* <Group>
          <Button
            variant="outline"
            leftIcon={<FaSlidersH />}
            onClick={() => setQueryModalOpen(true)}
          >
            Filtros
          </Button>
        </Group> */}

        <div style={{ height: '300px' }}>
          {data?.items && data.items.length > 0 ? (
            <ResponsiveBar
              data={chartData}
              margin={{ top: 24, right: 100, bottom: 32, left: 48 }}
              valueFormat={value => `${value.toFixed(2)}`}
              label={''}
              tooltipLabel={value => {
                return dayjs(value.indexValue).format('DD/MM/YYYY HH:mm')
              }}
              axisBottom={{
                format: value => {
                  return dayjs(value).format('HH:mm')
                },
                tickRotation: 50
              }}
              keys={['Fase T', 'Fase S', 'Fase R']}
              groupMode="grouped"
              indexBy="referenceDate"
              axisLeft={{
                tickValues: 2
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          ) : (
            ' Não há dados! '
          )}
        </div>
      </Skeleton>

      <DashboardQueryModal
        opened={queryModalOpen}
        onClose={handleQueryModalClose}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </>
  )
}

export default MonitorPowerFactor
