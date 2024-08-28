import { Tabs, Card } from '@mantine/core'

import { Monitor } from '@core/domain/Monitors/Monitors.types'

import MonitorConsumption from './MonitorConsumption'
import MonitorHeatMap from './MonitorHeatMap'
import MonitorPowerFactor from './MonitorPowerFactor'

interface MonitorDetailsTabsProps {
  meter?: Monitor
  mostrarSomenteDadosBasicos?: boolean
}

function MonitorDetailsTabs({ meter, mostrarSomenteDadosBasicos }: MonitorDetailsTabsProps) {
  return (
    <Card>
      <Tabs variant="pills">
        {mostrarSomenteDadosBasicos || <Tabs.Tab label="Potência Ativa">
          <MonitorConsumption meter={meter} />
        </Tabs.Tab>}
        <Tabs.Tab label="Consumo">
          <MonitorHeatMap meter={meter} />
        </Tabs.Tab>
        {mostrarSomenteDadosBasicos ||<Tabs.Tab label="Fator de Potência">
          <MonitorPowerFactor meter={meter} />
        </Tabs.Tab>}
      </Tabs>
    </Card>
  )
}

export default MonitorDetailsTabs
