import {Skeleton, Group, Card, Text,Grid, Box, Button} from '@mantine/core'
import { createStyles } from "@mantine/styles";
import React, { useEffect, useState } from 'react';
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface';

import { Icon } from '@iconify/react';

import {
    FaThermometerHalf,
} from 'react-icons/fa';
import { DatePicker } from '@mantine/dates';
import moment from 'moment-timezone';

import { AreaBumpComputedSerie, ResponsiveAreaBump } from '@nivo/bump';
import { useNotifications } from '@mantine/notifications';
import { getMonthlyTemperatureProjection, temperatureReport } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import { IAnaliseDeConsumoCardinalWithID } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.types';
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';
import { ResponsiveLine } from '@nivo/line';
import { formatDate } from '@core/domain/Geral/Geral.service';
// import { MonthPicker } from '@mantine/dates';


interface CustomTooltipProps {
  serie: AreaBumpComputedSerie;
  x: number | null;
  y: number | null;
}



function Temperature({
    idsMeters,
    heightCard,
    temperature,
    humidity,
    isItLiveTemperature,
    subtitle
}: DefaultPropsInterface) {

  const [chartData, setChartData] = useState<IAnaliseDeConsumoCardinalWithID[]>([{ id :"", data: [{x:"", y:0}]}]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);


  const [hoverInfo, setHoverInfo] = useState<{ serie: AreaBumpComputedSerie | null, x: number | null, y: number | null }>({
    serie: null,
    x: 0,
    y: 0
});

 



  const [value, setValue] = useState<Date | null>(null);
  const notifications = useNotifications();
    const { classes } = useStyles();

  
   

    

    const [umidade, setUmidade] = useState(false)

    async function getChartData() {
      if (idsMeters) {
        let formatted = idsMeters.map((r) => parseInt(r.toString()));
        const today = moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss");
        const yesterday = moment.tz("America/Sao_Paulo").subtract(6, 'hours').format("YYYY-MM-DDTHH:mm:ss");
    
        getMonthlyTemperatureProjection(formatted, yesterday, today, umidade).then(res => {
          setChartData(res.grafico);
        });
      }
    }

    async function sendReport() {
        
      const today = new Date();
      const priorDate = new Date(today.setDate(today.getDate() - 30));
      const now = new Date();
      const result = idsMeters ? await temperatureReport(idsMeters.map((e)=>parseInt(e as string)) ,priorDate,now ) : null
      if  (result && result.id && result.mensagem) {
      

        notifications.showNotification({
          color: "blue",
          title: "Mensagem",
          message: `${result?.mensagem}`,
        });

      }
    
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
     {x !== null ? new Date(x).toLocaleString('pt-br',{minute:'numeric', hour: 'numeric'}) : 'N/A'}<br />
     {y !== null ? ( umidade ? y.toFixed(2)+'%' : y.toFixed(1)+ '°C' ) : 'N/A'}
  </div>
);




    useEffect(()=>{
      getChartData()
   
    },[idsMeters])

    return (chartData.length == 2 && chartData[0].data.length>0 ) ?  (  <Skeleton visible={false}> 
       <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
            <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                <Text style={{  fontFamily: 'DM Sans', fontSize: 21, fontWeight:700, marginLeft:"7px", marginBottom:"0px", color: '#000000'}}>
                 {/* { isItLiveTemperature == true ? "Clima em Tempo Real" : "Condições Meteorológicas"} */}
                 Sensor de Temperatura e umidade
                </Text>    
            </Grid>
           
          <Grid style={{marginTop:"11px"}}>
            <Grid.Col span={6}>
            <Text style={{fontWeight: 700, fontSize:16}}>  Tempo Real </Text>
                <Group style={{marginTop:20}}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.5417 6.37504C20.5417 4.41903 18.956 2.83337 17 2.83337C15.044 2.83337 13.4583 4.41903 13.4583 6.37504V19.4902C11.7499 20.6338 10.625 22.5814 10.625 24.7917C10.625 28.3125 13.4792 31.1667 17 31.1667C20.5208 31.1667 23.375 28.3125 23.375 24.7917C23.375 22.5814 22.2501 20.6338 20.5417 19.4902V6.37504Z" stroke="#00AEA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17 26.2084C17.7824 26.2084 18.4167 25.5741 18.4167 24.7917C18.4167 24.0093 17.7824 23.375 17 23.375C16.2176 23.375 15.5833 24.0093 15.5833 24.7917C15.5833 25.5741 16.2176 26.2084 17 26.2084Z" stroke="#00AEA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>     <Group className={classes.center} style={{fontSize:34, color: '#00AEA3', fontWeight:700}}>{temperature ? Math.trunc(temperature)+'°C' : '-'} </Group>
     
                </Group>

                <Group style={{marginTop:10, marginLeft:5}}>
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9999 28.4583C14.63 28.4583 17.1523 27.4135 19.0121 25.5538C20.8718 23.694 21.9166 21.1717 21.9166 18.5416C21.9166 15.7083 20.4999 13.0166 17.6666 10.75C14.8333 8.48329 12.7083 5.08329 11.9999 1.54163C11.2916 5.08329 9.16659 8.48329 6.33325 10.75C3.49992 13.0166 2.08325 15.7083 2.08325 18.5416C2.08325 21.1717 3.12804 23.694 4.98778 25.5538C6.84751 27.4135 9.36986 28.4583 11.9999 28.4583Z" stroke="#00AEA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>  
                <Group className={classes.center} style={{fontSize:34, color: '#00AEA3', fontWeight:700}}>{ humidity ? Math.trunc(humidity) + '' : '-'}% </Group>

                </Group>
            </Grid.Col>
            <Grid.Col  span={6}>
            
              <Text style={{fontWeight: 700, fontSize:16 }}> Últimas temperaturas </Text>
                {/* <svg  style={{ marginLeft:-20, marginTop:20}} width="206" height="88" viewBox="0 0 206 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.6978 48.2585C18.1763 43.4898 5.84864 50.2455 1 54.2194V87.2613H205V9.07137C194.818 11.7993 186.168 11.0919 184.532 25.3375C183.197 36.9563 183.138 45.2409 176.047 47.6657C168.918 50.1034 164.774 35.8449 157.622 25.3375C151.9 16.9316 142.265 27.8699 138.709 31.3723C132.406 37.468 118.077 24.1682 111.867 13.7136C103 -1.21439 91.3393 -2.57976 82.5327 13.7136C73.7261 30.007 64.9907 16.6487 54.0207 25.3375C43.0507 34.0263 41.8498 54.2194 28.6978 48.2585Z" fill="url(#paint0_linear_23_389)"/>
                <path d="M1 54.2863C5.84864 50.3072 18.1763 43.5429 28.6978 48.3177C41.8498 54.2863 43.0507 34.0673 54.0207 25.3674C64.9907 16.6674 73.7261 30.0428 82.5327 13.7286C91.3393 -2.58562 103 -1.21851 111.867 13.7286C118.077 24.1966 132.406 37.5134 138.709 31.4099C142.265 27.903 151.901 16.9507 157.622 25.3674C164.774 35.8882 168.918 50.165 176.047 47.7241C183.138 45.2963 183.197 37.001 184.532 25.3674C186.168 11.1035 194.818 11.8118 205 9.08043" stroke="#4FD1C5" strokeWidth="3"/>
                    <defs>
                        <linearGradient id="paint0_linear_23_389" x1="103" y1="2" x2="103" y2="87.2613" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4FD1C5" stop-opacity="0.54"/>
                        <stop offset="1" stop-color="#4FD1C5" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                </svg> */} 
                {/* <Button onClick={()=>setUmidade(true)} className={umidade ? classes.umidity : classes.nonumidity} >Umidade</Button> */}
                {/* <Button onClick={()=>setUmidade(false)} className={!umidade ? classes.umidity : classes.nonumidity} >Temperatura</Button> */}
            <div style={{ height: 120, marginTop:20 }}>
            {   chartData &&  chartData.length == 2 && chartData[0].data.length > 0 &&  chartData[1].data.length > 0 ?  
            
            <ResponsiveLine
            data={ umidade ?  [chartData[1]] : [chartData[0]]}
            margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
            // xScale={{ type: 'point' }}
            animate
            curve="monotoneX"
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            // yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            // axisBottom={{
            //   tickSize: 5,
            //   tickPadding: 5,
            //   tickRotation: 0,
            //   legend: 'transportation',
            //   legendOffset: 36,
            //   legendPosition: 'middle',
            //   truncateTickAt: 0
            // }}
            // axisBottom={{
            //   tickSize: 5,
            //   tickPadding: 10,
            //   tickRotation: 0,
            //   legend: 'Consumo kWh',
            //   legendOffset: 40,
            //   legendPosition: 'middle',
            //   truncateTickAt: 0
            // }}
            // axisLeft={{
            //   tickSize: 5,
            //   tickPadding: 10,
            //   tickRotation: 0,
            //   legend: 'Valor R$',
            //   legendOffset: 0,
            //   legendPosition: 'middle',
            //   truncateTickAt: 0
            // }}
            colors={['#00AEA3']}
            axisLeft={null}
            axisBottom={null}
            pointSize={1}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            axis={null}
            
            theme={{
              grid: {
                line: {
                  stroke: "none"
                }
              }
            }}
            // interpolation="smooth"
            fill={[
              {
                match: "*",
                id: "gradientA",
              },
            ]}
            enableArea={true}
            areaOpacity={0.1}
         
            // defs={[
            //   {
            //     id: "gradientA",
            //     type: "linearGradient",
            //     colors: [
            //       { offset: 0, color: "#4FD1C5", opacity: 0.54 },
            //       { offset: 100, color: "#4FD1C5", opacity: 0 },
            //     ],
            //   },
            // ]}
            // colors={['#00AEA3']}
            // borderColor="#4FD1C5"
            tooltip={({ point }) => (
              <CustomTooltip serie={point} x={point.data.x} y={point.data.y} />
            )}
          />
        
         : '' }
    </div>
            </Grid.Col>

          </Grid>
          <Grid >  
              <Grid.Col span={12} md={12} className={classes.spaceTop} >
                <Group>
                  {/* {subtitle} */}
                  <Text style={{fontWeight: 700, fontSize:13, marginRight: 0}}>Relatório de medições</Text> 
                
                 
                  {/* <MonthPicker value={value} onChange={setValue}>; */}
                  <svg width="10" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.875 7.08329H1.125M10.3333 1.41663V4.24996M4.66667 1.41663V4.24996M4.525 15.5833H10.475C11.6651 15.5833 12.2602 15.5833 12.7147 15.3517C13.1146 15.1479 13.4397 14.8229 13.6434 14.423C13.875 13.9685 13.875 13.3734 13.875 12.1833V6.23329C13.875 5.04318 13.875 4.44812 13.6434 3.99356C13.4397 3.59372 13.1146 3.26863 12.7147 3.0649C12.2602 2.83329 11.6651 2.83329 10.475 2.83329H4.525C3.33489 2.83329 2.73983 2.83329 2.28527 3.0649C1.88543 3.26863 1.56034 3.59372 1.35661 3.99356C1.125 4.44812 1.125 5.04318 1.125 6.23329V12.1833C1.125 13.3734 1.125 13.9685 1.35661 14.423C1.56034 14.8229 1.88543 15.1479 2.28527 15.3517C2.73983 15.5833 3.33489 15.5833 4.525 15.5833Z" stroke="#A4A4A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg> 

{/* </MonthPicker> */}




<Text style={{fontSize: 16, fontWeight:700, color: '#B9B9B9' }}>{ formatDate(new Date())}</Text> 

 <Button onClick={sendReport} style={{backgroundColor: '#00AEA3',  width:"131px", height:"28px", borderRadius:6, paddingBottom:"6px", paddingTop:"4px", paddingLeft:"14px", paddingRight:"12px" }}>
{/*   
  <svg width="131" height="28" viewBox="0 0 131 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="131" height="28" rx="6" fill="#00AEA3"/>
<path d="M14.9588 18V8.2H21.3568V9.642H16.7508V12.33H20.9368V13.73H16.7508V16.558H21.3568V18H14.9588ZM22.3526 18L24.8726 14.528L22.3526 11.056H24.2706L26.0346 13.52L27.7846 11.056H29.7166L27.1826 14.528L29.7166 18H27.7846L26.0346 15.536L24.2706 18H22.3526ZM30.8582 21.08V11.056H32.4542L32.6502 12.05C32.8742 11.742 33.1682 11.4713 33.5322 11.238C33.9056 11.0047 34.3862 10.888 34.9742 10.888C35.6276 10.888 36.2109 11.0467 36.7242 11.364C37.2376 11.6813 37.6436 12.1153 37.9422 12.666C38.2409 13.2167 38.3902 13.842 38.3902 14.542C38.3902 15.242 38.2409 15.8673 37.9422 16.418C37.6436 16.9593 37.2376 17.3887 36.7242 17.706C36.2109 18.014 35.6276 18.168 34.9742 18.168C34.4516 18.168 33.9942 18.07 33.6022 17.874C33.2102 17.678 32.8929 17.4027 32.6502 17.048V21.08H30.8582ZM34.5962 16.6C35.1656 16.6 35.6369 16.4087 36.0102 16.026C36.3836 15.6433 36.5702 15.1487 36.5702 14.542C36.5702 13.9353 36.3836 13.436 36.0102 13.044C35.6369 12.652 35.1656 12.456 34.5962 12.456C34.0176 12.456 33.5416 12.652 33.1682 13.044C32.8042 13.4267 32.6222 13.9213 32.6222 14.528C32.6222 15.1347 32.8042 15.634 33.1682 16.026C33.5416 16.4087 34.0176 16.6 34.5962 16.6ZM43.3231 18.168C42.6511 18.168 42.0444 18.014 41.5031 17.706C40.9711 17.398 40.5464 16.9733 40.2291 16.432C39.9211 15.8813 39.7671 15.2467 39.7671 14.528C39.7671 13.8093 39.9257 13.1793 40.2431 12.638C40.5604 12.0873 40.9851 11.658 41.5171 11.35C42.0584 11.042 42.6651 10.888 43.3371 10.888C43.9997 10.888 44.5971 11.042 45.1291 11.35C45.6704 11.658 46.0951 12.0873 46.4031 12.638C46.7204 13.1793 46.8791 13.8093 46.8791 14.528C46.8791 15.2467 46.7204 15.8813 46.4031 16.432C46.0951 16.9733 45.6704 17.398 45.1291 17.706C44.5877 18.014 43.9857 18.168 43.3231 18.168ZM43.3231 16.614C43.7897 16.614 44.1957 16.4413 44.5411 16.096C44.8864 15.7413 45.0591 15.2187 45.0591 14.528C45.0591 13.8373 44.8864 13.3193 44.5411 12.974C44.1957 12.6193 43.7944 12.442 43.3371 12.442C42.8611 12.442 42.4504 12.6193 42.1051 12.974C41.7691 13.3193 41.6011 13.8373 41.6011 14.528C41.6011 15.2187 41.7691 15.7413 42.1051 16.096C42.4504 16.4413 42.8564 16.614 43.3231 16.614ZM48.4813 18V11.056H50.0773L50.2453 12.358C50.4973 11.91 50.838 11.5553 51.2673 11.294C51.706 11.0233 52.2193 10.888 52.8073 10.888V12.778H52.3033C51.9113 12.778 51.5613 12.8387 51.2533 12.96C50.9453 13.0813 50.7026 13.2913 50.5253 13.59C50.3573 13.8887 50.2733 14.304 50.2733 14.836V18H48.4813ZM57.1261 18C56.3981 18 55.8147 17.8227 55.3761 17.468C54.9374 17.1133 54.7181 16.4833 54.7181 15.578V12.554H53.5281V11.056H54.7181L54.9281 9.194H56.5101V11.056H58.3861V12.554H56.5101V15.592C56.5101 15.928 56.5801 16.1613 56.7201 16.292C56.8694 16.4133 57.1214 16.474 57.4761 16.474H58.3441V18H57.1261ZM62.3186 18.168C61.7213 18.168 61.2313 18.0747 60.8486 17.888C60.466 17.692 60.1813 17.4353 59.9946 17.118C59.808 16.8007 59.7146 16.4507 59.7146 16.068C59.7146 15.424 59.9666 14.9013 60.4706 14.5C60.9746 14.0987 61.7306 13.898 62.7386 13.898H64.5026V13.73C64.5026 13.254 64.3673 12.904 64.0966 12.68C63.826 12.456 63.49 12.344 63.0886 12.344C62.7246 12.344 62.4073 12.4327 62.1366 12.61C61.866 12.778 61.698 13.03 61.6326 13.366H59.8826C59.9293 12.862 60.0973 12.4233 60.3866 12.05C60.6853 11.6767 61.068 11.392 61.5346 11.196C62.0013 10.9907 62.524 10.888 63.1026 10.888C64.092 10.888 64.8713 11.1353 65.4406 11.63C66.01 12.1247 66.2946 12.8247 66.2946 13.73V18H64.7686L64.6006 16.88C64.3953 17.2533 64.106 17.5613 63.7326 17.804C63.3686 18.0467 62.8973 18.168 62.3186 18.168ZM62.7246 16.768C63.238 16.768 63.6346 16.6 63.9146 16.264C64.204 15.928 64.386 15.5127 64.4606 15.018H62.9346C62.4586 15.018 62.118 15.1067 61.9126 15.284C61.7073 15.452 61.6046 15.662 61.6046 15.914C61.6046 16.1847 61.7073 16.3947 61.9126 16.544C62.118 16.6933 62.3886 16.768 62.7246 16.768ZM68.0047 18V11.056H69.6007L69.7687 12.358C70.0207 11.91 70.3614 11.5553 70.7907 11.294C71.2294 11.0233 71.7427 10.888 72.3307 10.888V12.778H71.8267C71.4347 12.778 71.0847 12.8387 70.7767 12.96C70.4687 13.0813 70.2261 13.2913 70.0487 13.59C69.8807 13.8887 69.7967 14.304 69.7967 14.836V18H68.0047ZM76.9334 18V8.2H80.2794C81.4274 8.2 82.3701 8.40533 83.1074 8.816C83.8541 9.21733 84.4048 9.78667 84.7594 10.524C85.1234 11.252 85.3054 12.1107 85.3054 13.1C85.3054 14.0893 85.1234 14.9527 84.7594 15.69C84.4048 16.418 83.8541 16.9873 83.1074 17.398C82.3701 17.7993 81.4274 18 80.2794 18H76.9334ZM78.7254 16.46H80.1954C81.0168 16.46 81.6654 16.3293 82.1414 16.068C82.6174 15.7973 82.9581 15.4147 83.1634 14.92C83.3688 14.416 83.4714 13.8093 83.4714 13.1C83.4714 12.4 83.3688 11.798 83.1634 11.294C82.9581 10.79 82.6174 10.4027 82.1414 10.132C81.6654 9.86133 81.0168 9.726 80.1954 9.726H78.7254V16.46ZM89.2386 18.168C88.6412 18.168 88.1512 18.0747 87.7686 17.888C87.3859 17.692 87.1012 17.4353 86.9146 17.118C86.7279 16.8007 86.6346 16.4507 86.6346 16.068C86.6346 15.424 86.8866 14.9013 87.3906 14.5C87.8946 14.0987 88.6506 13.898 89.6586 13.898H91.4226V13.73C91.4226 13.254 91.2872 12.904 91.0166 12.68C90.7459 12.456 90.4099 12.344 90.0086 12.344C89.6446 12.344 89.3272 12.4327 89.0566 12.61C88.7859 12.778 88.6179 13.03 88.5526 13.366H86.8026C86.8492 12.862 87.0172 12.4233 87.3066 12.05C87.6052 11.6767 87.9879 11.392 88.4546 11.196C88.9212 10.9907 89.4439 10.888 90.0226 10.888C91.0119 10.888 91.7912 11.1353 92.3606 11.63C92.9299 12.1247 93.2146 12.8247 93.2146 13.73V18H91.6886L91.5206 16.88C91.3152 17.2533 91.0259 17.5613 90.6526 17.804C90.2886 18.0467 89.8172 18.168 89.2386 18.168ZM89.6446 16.768C90.1579 16.768 90.5546 16.6 90.8346 16.264C91.1239 15.928 91.3059 15.5127 91.3806 15.018H89.8546C89.3786 15.018 89.0379 15.1067 88.8326 15.284C88.6272 15.452 88.5246 15.662 88.5246 15.914C88.5246 16.1847 88.6272 16.3947 88.8326 16.544C89.0379 16.6933 89.3086 16.768 89.6446 16.768ZM98.1166 18.168C97.4633 18.168 96.88 18.0093 96.3666 17.692C95.8533 17.3747 95.4473 16.9407 95.1486 16.39C94.85 15.8393 94.7006 15.214 94.7006 14.514C94.7006 13.814 94.85 13.1933 95.1486 12.652C95.4473 12.1013 95.8533 11.672 96.3666 11.364C96.88 11.0467 97.4633 10.888 98.1166 10.888C98.6393 10.888 99.0966 10.986 99.4886 11.182C99.8806 11.378 100.198 11.6533 100.441 12.008V7.92H102.233V18H100.637L100.441 17.006C100.217 17.314 99.918 17.5847 99.5446 17.818C99.1806 18.0513 98.7046 18.168 98.1166 18.168ZM98.4946 16.6C99.0733 16.6 99.5446 16.4087 99.9086 16.026C100.282 15.634 100.469 15.1347 100.469 14.528C100.469 13.9213 100.282 13.4267 99.9086 13.044C99.5446 12.652 99.0733 12.456 98.4946 12.456C97.9253 12.456 97.454 12.6473 97.0806 13.03C96.7073 13.4127 96.5206 13.9073 96.5206 14.514C96.5206 15.1207 96.7073 15.62 97.0806 16.012C97.454 16.404 97.9253 16.6 98.4946 16.6ZM107.389 18.168C106.717 18.168 106.111 18.014 105.569 17.706C105.037 17.398 104.613 16.9733 104.295 16.432C103.987 15.8813 103.833 15.2467 103.833 14.528C103.833 13.8093 103.992 13.1793 104.309 12.638C104.627 12.0873 105.051 11.658 105.583 11.35C106.125 11.042 106.731 10.888 107.403 10.888C108.066 10.888 108.663 11.042 109.195 11.35C109.737 11.658 110.161 12.0873 110.469 12.638C110.787 13.1793 110.945 13.8093 110.945 14.528C110.945 15.2467 110.787 15.8813 110.469 16.432C110.161 16.9733 109.737 17.398 109.195 17.706C108.654 18.014 108.052 18.168 107.389 18.168ZM107.389 16.614C107.856 16.614 108.262 16.4413 108.607 16.096C108.953 15.7413 109.125 15.2187 109.125 14.528C109.125 13.8373 108.953 13.3193 108.607 12.974C108.262 12.6193 107.861 12.442 107.403 12.442C106.927 12.442 106.517 12.6193 106.171 12.974C105.835 13.3193 105.667 13.8373 105.667 14.528C105.667 15.2187 105.835 15.7413 106.171 16.096C106.517 16.4413 106.923 16.614 107.389 16.614ZM115.418 18.168C114.802 18.168 114.26 18.07 113.794 17.874C113.327 17.6687 112.954 17.3887 112.674 17.034C112.394 16.6793 112.226 16.2687 112.17 15.802H113.976C114.032 16.0727 114.181 16.306 114.424 16.502C114.676 16.6887 114.998 16.782 115.39 16.782C115.782 16.782 116.066 16.7027 116.244 16.544C116.43 16.3853 116.524 16.2033 116.524 15.998C116.524 15.6993 116.393 15.4987 116.132 15.396C115.87 15.284 115.506 15.1767 115.04 15.074C114.741 15.0087 114.438 14.9293 114.13 14.836C113.822 14.7427 113.537 14.626 113.276 14.486C113.024 14.3367 112.818 14.15 112.66 13.926C112.501 13.6927 112.422 13.408 112.422 13.072C112.422 12.456 112.664 11.938 113.15 11.518C113.644 11.098 114.335 10.888 115.222 10.888C116.043 10.888 116.696 11.0793 117.182 11.462C117.676 11.8447 117.97 12.372 118.064 13.044H116.37C116.267 12.5307 115.88 12.274 115.208 12.274C114.872 12.274 114.61 12.3393 114.424 12.47C114.246 12.6007 114.158 12.764 114.158 12.96C114.158 13.1653 114.293 13.3287 114.564 13.45C114.834 13.5713 115.194 13.6833 115.642 13.786C116.127 13.898 116.57 14.024 116.972 14.164C117.382 14.2947 117.709 14.4953 117.952 14.766C118.194 15.0273 118.316 15.4053 118.316 15.9C118.325 16.3293 118.213 16.7167 117.98 17.062C117.746 17.4073 117.41 17.678 116.972 17.874C116.533 18.07 116.015 18.168 115.418 18.168Z" fill="white"/>
</svg> */}
<Text style={{fontSize: 14, fontWeight:2000, color: '#ffffff', fontFamily: 'DM Sans', lineHeight:18.23, letterSpacing:0.2 }}>Exportar Dados</Text>
</Button>



                </Group>
  

              </Grid.Col>  
          </Grid>
       </Card>
    </Skeleton>
    )  : <></>
}

const useStyles = createStyles(() => {  
    return {
      iconCustom: {
        fontSize: "60px",
        color: "#1E90FF",
      },
      iconTemperature: {
        fontSize: "50px",
        color: "#FF0000	",
      },
      spaceTop: {
        marginTop: "10px"
      },
      textValue: {
        color:"#00AEA3",
        fontWeight: "bold",
        fontSize: "18px",
      },
      defaultFont: {
        fontSize: "16px",
      },
      center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },

      umidity:  { backgroundColor: '#00AEA3', color: '#FFFFFF', borderRadius: 6, width:120,  margin: 10 },
      nonumidity:  { backgroundColor: "#F9F9F9", color: '#B9B9B9', borderRadius: 6, width:120, margin: 10 }
    };
  });

export default Temperature