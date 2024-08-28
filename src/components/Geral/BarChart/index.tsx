import { IAnaliseDeConsumoGrafico } from "@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.types";
import { ResponsiveBar, BarDatum, BarTooltipProps } from "@nivo/bar";

interface IBarProp {
    data: IAnaliseDeConsumoGrafico[],
    rotate: boolean
}

const CustomTooltip = ({ id, value, color }: BarTooltipProps<BarDatum>) => (
    <div
        style={{
            padding: '12px 16px',
            background: '#fff',
            border: `1px solid ${color}`,
            borderRadius: '4px',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        }}
    >
             {value !== null ?  (parseFloat(value.toString())).toFixed(1)+' kWh' : 'N/A'}
    </div>
);

export default function BarChartComponent({ data, rotate=false }: IBarProp) {
    return (
        <ResponsiveBar
       
            data={data}
            layout="vertical"
            enableGridX={false}
            enableGridY={true}
            axisRight={null}
            axisLeft={{
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: -40,

                format: function(value){ 

                    return (parseFloat((value).toFixed(1)+'kWh' ))
                },
            }}
            theme={{
                axis: {
                    ticks: {
                        line: {
                            strokeWidth: 0, // Removes the line beside the tick
                        },
                        text: {
                            fill: "#B9B9B9",
                            fontWeight: 700,
                            fontFamily: 'DM Sans, sans-serif',
                        },
                    },
                },
            }}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            colors={['#00AEA3']}
            enableLabel={false}
            borderRadius={5}
            labelTextColor="#686868"
            axisBottom={rotate ? {
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 45, // Rotate the ticks by 45 degrees
                legend: '',
                legendOffset: 36,
                legendPosition: 'middle',
            }: {}}
            tooltip={CustomTooltip as any} // Use 'as any' to bypass type issues
        />
    );
}
