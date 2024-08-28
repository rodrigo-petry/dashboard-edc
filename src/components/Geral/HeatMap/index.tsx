import { useState,useEffect } from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { transformConsumptionBehaviorToHeatMapChartData, formatHeatMapFinal} from '@core/domain/Dashboards/Dashboards.utils'
import { Skeleton, Card,Grid}  from '@mantine/core'
import { metricPrefixFormatter } from '@utils/metricPrefix'
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface'
import HeatMapInterface from '@components/Geral/HeatMap/HeatMapInterface'
import { emptyObject } from 'react-virtualized/dist/es/Masonry'
import {getHeatMap} from '@core/domain/Geral/Geral.service'


function HeatMap({ idsMeters,
    initialDate,
    finalDate,
    timeout,
    heightCard 
}: DefaultPropsInterface) {
 
    const [isFetching, setIsFetching] =  useState<boolean>(false);  
    const [data, setData] = useState <Array<HeatMapInterface|emptyObject>>([]);
    const [unidadeEmKw, setunidadeEmKw] =  useState<boolean>(false);  

    const heatMap = (
      idsMeters: Array<string|number>|null,
      initialDate: string,
      finalDate: string
    ) =>  {
      setIsFetching(true)
      getHeatMap(idsMeters,initialDate,finalDate).then(function (response) {
        setIsFetching(false)
        let dados = transformConsumptionBehaviorToHeatMapChartData(response)
        let mapaDeCalor: Array<any> =  formatHeatMapFinal(dados)
        
        if(mapaDeCalor[0]) {
          setData(mapaDeCalor[0])
        }  
        if(mapaDeCalor[1]) {
          setunidadeEmKw(mapaDeCalor[1])
        }
      }); 
   }   
    useEffect(() => {
      heatMap(idsMeters, initialDate, finalDate);
        const timer = setInterval(() => {
            heatMap(idsMeters, initialDate, finalDate);
        }, timeout);
    }, []);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Skeleton visible={isFetching}>
      <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontSize: "16px", color: "#2E2E2E",marginLeft: 28}}>
        
        <div  style={{ marginTop: 10, fontWeight: 700 }}>
          Consumo acumulado nos último 7 dias (kWh)
        </div>    
    </Grid>

        <div style={{ height: heightCard }}>
            <ResponsiveHeatMap
              data={data}
              indexBy="dayOfWeek"
              margin={{ top: 24, right: 60, bottom: 32, left: 60 }}
              axisTop={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                legend: '',
                legendOffset: 36,
              }}
              label={(datum, key) =>
                (datum[key]) < 0 || (datum[key]) == null
                  ? ""
                  : (unidadeEmKw ?
                       `${metricPrefixFormatter(datum[key] / 1000 as number, 2)}` 
                       : `${metricPrefixFormatter(datum[key] as number)}`)
              }
              tooltipFormat={value =>
                value < 0  || value == null? "X" :  (unidadeEmKw ?
                  `${metricPrefixFormatter(value / 1000 as number,2)} kWh` 
                  : `${metricPrefixFormatter(value as number)} Wh`)
              }
              
              keys={[
                '00h',
                '01h',
                '02h',
                '03h',
                '04h',
                '05h',
                '06h',
                '07h',
                '08h',
                '09h',
                '10h',
                '11h',
                '12h',
                '13h',
                '14h',
                '15h',
                '16h',
                '17h',
                '18h',
                '19h',
                '20h',
                '21h',
                '22h',
                '23h'
              ]}
              colors= {['#d0f0c0','#98FB98','#fdfd96','#ffcc99','#ff6347']}
              emptyColor="#999"
            />
        </div>
      </Skeleton>
      
    </Card>
  )
}

export default HeatMap