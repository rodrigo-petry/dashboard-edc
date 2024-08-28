import { Card, Skeleton, Button, Col } from '@mantine/core'
import { ResponsiveLine } from '@nivo/line'
import { metricPrefixFormatter } from '@utils/metricPrefix'
import {unitOfMeasurement} from '@utils/unitOfMeasurement';
import {groupMeasurements} from '@utils/groupMeasurements';
import {formatDate} from '@utils/dateFormat';
import {axisBottom} from '@utils/axisBottom';
import { useMemo, useState  } from "react";
import { MultiMonitors, ReportRequest, GetMultiMonitorRequest } from '@core/domain/Dashboards/Dashboards.types'
import { transformMultiMonitorsToLineChartData } from '@core/domain/Dashboards/Dashboards.utils'
import { useOrdinalColorScale } from "@nivo/colors";
import { useProfile, useReport } from '@core/domain/Dashboards/Dashboards.hooks'
import { useNotifications } from '@mantine/notifications'

interface MultiMonitorLineChartProps {
  multiMonitors?: MultiMonitors
  parameter: string
  isLoading: boolean
  group: string
  queryParams: GetMultiMonitorRequest
}

function MultiMonitorLineChart({
  parameter,
  multiMonitors,
  isLoading,
  group,
  queryParams
}: MultiMonitorLineChartProps) {
  let chartData = transformMultiMonitorsToLineChartData(
    parameter,
    multiMonitors
  )

  const { data: profileData, isFetching: isFetchingProfile } = useProfile()
  const mutation = useReport()
  const notifications = useNotifications()

  const handleClick = async (group: string) => {
    try {
      if (!profileData?.length)
        throw notifications.showNotification({
          color: 'red',
          title: 'Não foi possível enviar o relatório',
          message: 'Erro ao enviar o relatório.'
        })

        let granularidade = ['dias', 'horas', 'minutos', 'segundos'];

        if(group == 'minutos') {
          granularidade = ['minutos'];
        }

        if(group == 'horas') {
          granularidade = ['horas'];
        }

        if(group == 'dia') {
          granularidade = ['dias'];
        }

        let start = queryParams?.startDate ?queryParams.startDate.split("T") :"";
        let end = queryParams?.endDate ? queryParams.endDate.split("T"): "";
      const obj: ReportRequest = {
        idProfile: profileData[0]?.id,
        granularidade: granularidade,
        de: start[0],
        para: end[0],
        dados: {
          media: true,
          potencia_ativa: true,
          potencia_aparente: true,
          fator_potencia: true,
          potencia_fase: true,
          corrente_fase: true,
          tensao_fase: true,
          potencia_reativa_total : true,
          potencia_reativa_fases : true, 
          potencia_aparente_fases : true, 
          fator_potencia_fases : true, 
          frequencia_fases : true

        }
      }

      await mutation.mutateAsync(obj)

      notifications.showNotification({
        color: 'brand',
        title: 'Relatório enviado',
        message: 'O relatório foi enviado com sucesso para sua caixa de e-mail.'
      })
      alert("O relatório foi enviado com sucesso para sua caixa de e-mail.");
    } catch (err) {
      console.log(err, 'erro do relatório')
      notifications.showNotification({
        color: 'red',
        title: 'Não foi possível enviar o relatório',
        message: 'Erro ao enviar o relatório.'
      })
    }
  }

  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const colors = useOrdinalColorScale({ scheme: "nivo" }, "id");
  chartData = groupMeasurements(group,chartData,parameter)

  const data = useMemo(
    () => chartData.filter((item) => !hiddenIds.includes(String(item.id))),
    [hiddenIds, chartData]
  );
  let dateY:string = ""
  let unidade = unitOfMeasurement(parameter)
  return (
    <Skeleton visible={!multiMonitors?.items.length || isLoading}>
      {!multiMonitors?.items.length && !isLoading && 'Não há dados!'}
      <Card>
        <Col>
          <Button  disabled={isFetchingProfile} onClick={() => handleClick(group)}>
            Exportação de dados
          </Button>
        </Col>  
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={data}
            margin={{ top: 24, right: 165, bottom: 32, left: 48 }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%S',
              useUTC: false,
              min: 'auto'
            }}
            yScale={{
              type: "linear",
              min: 'auto',
            }}
            xFormat={(value)=> {
              dateY = formatDate(value);
              return "time:%d/%m/%Y - %H:%M"
            }}
            yFormat={value => `${metricPrefixFormatter(+value,2)} `+ unidade +' - ' + dateY}
            enableGridX={false}
            enablePoints={false}
            isInteractive
            enableSlices="x"
            axisLeft={{
             // orient: 'left',
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legend: unidade,
              legendOffset: -40,
              legendPosition: 'middle'
          }}
            useMesh
            axisBottom={axisBottom(group,chartData)}
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
                onClick: (datum) => {
                  setHiddenIds((state) =>
                    state.includes(String(datum.id))
                      ? state.filter((item) => item !== datum.id)
                      : [...state, String(datum.id)]
                  );
                },

                data: chartData.map((item) => {
                  const color = colors(item);
                  return {
                    color: hiddenIds.includes(String(item.id)) ? "rgba(1, 1, 1, .1)" : color,
                    id: item.id,
                    label: item.id
                  };
                }),
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
        </div>
      </Card>
    </Skeleton>
  )
}

export default MultiMonitorLineChart
