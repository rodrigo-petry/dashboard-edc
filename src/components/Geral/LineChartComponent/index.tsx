import React, { useMemo, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { AreaBumpComputedSerie } from '@nivo/bump';
import { metricPrefixFormatter } from '@utils/metricPrefix'
import { useOrdinalColorScale } from "@nivo/colors";
interface CustomTooltipProps {
    serie: AreaBumpComputedSerie;
    x: number | null;
    y: number | null;
  }

const CustomTooltip: React.FC<CustomTooltipProps> = ({ serie, x, y }) => (
    <div
        style={{
            padding: '5px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '3px',
        }}
    >
        <strong>{serie && serie.id.split('.')[0]}</strong><br />
       {x !== null ? x : 'N/A'}<br />
       {y !== null ? (parseFloat(y.toFixed(2)) > 1000 ?  (parseFloat(y.toFixed(2)) >= 10000000 ? (parseFloat(y.toFixed(2)) /10000000).toFixed(2)+'MW' : (parseFloat(y.toFixed(2)) / 1000).toFixed(2)+'kW' ) :  y.toFixed(2)+'W') : 'N/A'}
    </div>
  );
  
  

const LineChartComponent = ({ data }) => {
    
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);
    const colors = useOrdinalColorScale({ scheme: "nivo" }, "id");
    const dataFiltered = useMemo(
      () => data.filter((item) => !hiddenIds.includes(String(item.id))),
      [hiddenIds, data]
    );
    return (
      
            
      <ResponsiveLine
      data={dataFiltered}
      margin={{ top: 24, right: 145, bottom: 60, left: 48 }}
     
     
      enableGridX={false}
      enablePoints={false}
      isInteractive
      enableSlices="x"
      axisLeft={{
       // orient: 'left',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        // legend: unidade,
        legendOffset: -40,
        legendPosition: 'middle'
    }}
      useMesh
      yFormat={value => `${value} `+ 'kWh'}
      curve='basis'
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

          data: data.map((item) => {
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
      tooltip={({ point }) => (
        <CustomTooltip serie={point} x={point.data.x} y={point.data.y} />
      )}
    />
   
            
          
    
    );
};

export default LineChartComponent;
