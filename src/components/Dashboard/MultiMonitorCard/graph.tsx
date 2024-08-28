import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs'
import { Group, Text } from '@mantine/core'


import {
  Measurement,
  MultiMonitor
} from '@core/domain/Dashboards/Dashboards.types'
import { useCurrentConsumption } from '@core/domain/Proxies/Proxies.hooks'
import { metricPrefixFormatter } from '@utils/metricPrefix'

interface MultiMonitorCardProps {
  multiMonitor?: MultiMonitor
  parameter: string
}

function MultiMonitorCardGraph({
  multiMonitor,
  parameter
}: MultiMonitorCardProps) {

    const data =
        multiMonitor?.items.map(a => ({
        date: a.referenceDate,
        value: (a[parameter] as Measurement)?.total
        })) || []
    const { data: consumption } = useCurrentConsumption(multiMonitor?.meterId)
  // alert(JSON.stringify(data));
  return (
    <>
     
           <Group position="apart">
              <Text color="dimmed">Consumo Atual:</Text>
              <Text weight="bold">
                {consumption ? metricPrefixFormatter(consumption?.consumo) : 0}
                Wh
              </Text>
            </Group>
            <div style={{ height: '200px' }}>
              <ResponsiveBar
                data={data}
                valueFormat={value => value.toFixed(2)}
                label={''}
                tooltipLabel={value => {
                  return dayjs(value.indexValue).format('DD/MM/YYYY HH:mm')
                }}
                axisBottom={null}
                axisLeft={null}
                keys={['value']}
                indexBy="date"
              />
            </div>
        </>   
  )
}

export default MultiMonitorCardGraph
