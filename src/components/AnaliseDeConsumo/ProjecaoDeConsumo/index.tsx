import React from 'react';
import { ResponsiveBar } from '@nivo/bar';



const ProjecaoDeConsumo = () => {
    // const [data, setData] = useState()
  
    
 
  return (
    <ResponsiveBar
    // @ts-ignore
    data={data}
    theme={{
      
      axis: {
        
       
        
        ticks: {
          line: {
            stroke: "gray"
          },
          text: {
            fill: "#B9B9B9",
            fontWeight: 700
          },
        },
      },
    }}
    indexBy="id"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    // padding={0.3}
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={['#00AEA3']}
    enableLabel={false}
    defs={[
        {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true
        },
        {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            // color: '#38bcb2',
            // rotation: -45,
            lineWidth: 6,
            spacing: 10
        }
    ]}
   
    borderRadius={5}
    axisTop={null}
    axisRight={null}
    axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
    }}
    axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        // legend: 'food',
        legendPosition: 'middle',
        // legendOffset: 40,
        // truncateTickAt: 0,
       
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor="#686868"
    legends={[
        {
            itemTextColor: "rgb(104, 104, 104)",
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
    role="application"
    ariaLabel="Nivo bar chart demo"
    barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
/>

  );
};

export default ProjecaoDeConsumo;