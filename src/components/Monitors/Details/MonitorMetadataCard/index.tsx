import { Monitor } from '@core/domain/Monitors/Monitors.types'
import { toUpper } from 'lodash'
import { FaEdit } from 'react-icons/fa'
import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { getConsumptionDistribution } from '@core/domain/Geral/Geral.service'
interface MonitorMetadataCardProps {
  monitor?: Monitor
  onEditClick: () => void
}

function MonitorMetadataCard({
  monitor,
  onEditClick
}: MonitorMetadataCardProps) {
  const [consumption, setConsumption] = useState<any>();
  const a = dayjs()
  useEffect(()=>{
    if (monitor?.meterId){
     getConsumptionDistribution([monitor?.meterId]).then(res=>{setConsumption(res)}).catch(err=>{''})
    }
  
  })

  return (
    <Card>
      <Group direction="column" grow>
        <Group position="apart">
          <Text weight="bold" size="lg">
            {(monitor?.name && toUpper(monitor?.name)) || '-'}
          </Text>
          <Group>
            <Badge>Ativo</Badge>
            <ActionIcon onClick={() => onEditClick()}>
              <FaEdit />
            </ActionIcon>
          </Group>
        </Group>

        <Group position="apart">
          <Text color="dimmed">Limite de demanda</Text>
          <Text>{monitor?.demandLimit || '-'}</Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed">Início do horário de Ponta</Text>
          <Text>
          {consumption?.ponta_periodo && consumption?.ponta_periodo.split('-')[0].slice(0, -3) }
          </Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed">Fim do horário de Ponta</Text>
          <Text>
            {consumption?.ponta_periodo && consumption?.ponta_periodo.split('-')[1].slice(0, -3)}
          </Text>
        </Group>
      </Group>
    </Card>
  )
}

export default MonitorMetadataCard
1
