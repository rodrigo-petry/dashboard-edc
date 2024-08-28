import { ActionIcon, Card, Col, Group, Button, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import { FaEye } from 'react-icons/fa'
import {useState} from 'react'
import MultiMonitorCardGraph from './graph'

import {
  Measurement,
  MultiMonitor
} from '@core/domain/Dashboards/Dashboards.types'


interface MultiMonitorCardProps {
  multiMonitor?: MultiMonitor
  parameter: string
  isLoading: boolean
}

function MultiMonitorCard({
  multiMonitor,
  parameter,
  isLoading
}: MultiMonitorCardProps) {
  const router = useRouter()
  const[showGraph, setShowGraph] = useState<Boolean>(false);
  const data =
    multiMonitor?.items.map(a => ({
      date: a.referenceDate,
      value: (a[parameter] as Measurement)?.total
    })) || []


  return (
    <>
      {!multiMonitor?.items.length && !isLoading && 'Não há dados!'}
      <Col span={3}>
        <Card>
          <Group direction="column" grow>
            <Group position="apart">
              <Text weight="bold">{multiMonitor?.name}</Text>
              <ActionIcon
                onClick={() =>
                  router.push(`/monitors/${multiMonitor?.meterId}`)
                }
              >
                <FaEye />
              </ActionIcon>
            </Group>
            {!showGraph ? <Group  position="apart">
              <Button onClick={() => { setShowGraph(true)}}>
                Consumo Atual
              </Button>
            </Group> : ""}
            {showGraph ? <MultiMonitorCardGraph 
              multiMonitor={multiMonitor} 
              parameter={parameter} 
              />: ""}
          </Group>
        </Card>
      </Col>
    </>
  )
}

export default MultiMonitorCard
