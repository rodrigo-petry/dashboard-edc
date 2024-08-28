import { Card, Group, Text } from '@mantine/core'
import React, {useEffect , useState} from 'react';
import { Monitor } from '@core/domain/Monitors/Monitors.types'
import { getConsumptionRange } from "@core/domain/Geral/Geral.service"

interface MonitorMeasuresCardProps {
  monitor?: Monitor
  mostrarSomenteDadosBasicos?: any,
}

function MonitorMeasuresCard({ monitor, mostrarSomenteDadosBasicos }: MonitorMeasuresCardProps) {

  const[resumo, setResumo] = useState<any>({});
  const numberFormater =  new Intl.NumberFormat('pt-br')
  useEffect(() => {
    if(monitor?.meterId){
      getResumoMensal(monitor?.meterId)
    }  
  },[monitor]) 
   
  async function getResumoMensal(meterId: string|number|null) {
      let result = await getConsumptionRange(meterId);
      setResumo(result)
  }
  return (
    <Card style={{ minHeight: '398px' }}>
      <Group direction="column" grow>
        <Group position="apart">
          <Text weight="bold" size="lg">
            Medições -  {resumo?.data_inicial || ""}  até  {resumo?.data_final || ""}
          </Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed"> Consumo Total - Faixa de ponta </Text>
          <Text>{ numberFormater.format( parseFloat(resumo?.ponta?.consumo_total.toFixed(2))) || '-' } kWh</Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed"> Consumo Total - Faixa Fora Ponta </Text>
          <Text>{ numberFormater.format( parseFloat(resumo?.fora_ponta?.consumo_total.toFixed(2))) || '-' } kWh</Text>
        </Group>


        {mostrarSomenteDadosBasicos || <>
        <Group position="apart">
          <Text color="dimmed"> Potência Ativa Máxima - Faixa de ponta </Text>
          <Text>{   numberFormater.format( resumo?.ponta?.potencia_ativa_maxima/1000 ) || '-' } kW</Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed"> Potência Ativa Máxima -  Faixa Fora Ponta </Text>
          <Text>{   numberFormater.format(resumo?.fora_ponta?.potencia_ativa_maxima/1000) || '-' } kW</Text>
        </Group>


        <Group position="apart">
          <Text color="dimmed"> Potência Reativa Máxima - Faixa de ponta</Text>
          <Text style={{textAlign:"left"}} >{   numberFormater.format(resumo?.ponta?.potencia_reativa_maxima/1000) || '-' } kVAr</Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed">Potência Reativa Máxima - Faixa Fora Ponta</Text>
          <Text style={{textAlign:"left"}} >{   numberFormater.format(resumo?.fora_ponta?.potencia_reativa_maxima/1000) || '-' } kVAr</Text>
        </Group>


         <Group position="apart">
          <Text color="dimmed"> Fator de Potência Médio - Faixa de ponta </Text>
          <Text>{  numberFormater.format(parseFloat(resumo?.ponta?.media_fator_potencia.toFixed(3))) || '-' }</Text>
        </Group>

        <Group position="apart">
          <Text color="dimmed">Fator de Potência Médio -  Faixa Fora Ponta </Text>
          <Text>{   numberFormater.format(parseFloat(resumo?.fora_ponta?.media_fator_potencia.toFixed(3))) || '-' }</Text>
        </Group> 
        </>}



      </Group>
    </Card>
  )
}

export default MonitorMeasuresCard
