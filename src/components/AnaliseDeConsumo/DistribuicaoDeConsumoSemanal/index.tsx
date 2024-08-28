import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Button, Card, Grid, Group, Skeleton, Text, Title } from '@mantine/core';

import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import moment from 'moment';
import { getEachDayInAWeekMeasure } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import { getDateFourWeeksAgo, getWeeksBetweenDates, getWeeksInMonth } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.utils';

interface IGraphicDataType {
  id: any;
  label: any;
  value: any;
}

interface WeeklyConsumption {
  weeks_consumption: IGraphicDataType[];
  media_watts: number;
  media_moeda: number;
}

const DistribuicaoDeConsumoSemanal =  ( {idsMeters=[] as number[]} ) => {
  const weeksConsumptionTemplate = {
    weeks_consumption: [
      { id: 'dom.', label: 'dom', value: 0 },
      { id: 'seg.', label: 'seg', value: 0 },
      { id: 'ter.', label: 'ter', value: 0 },
      { id: 'qua.', label: 'qua', value: 0 },
      { id: 'qui.', label: 'qui', value: 0 },
      { id: 'sex.', label: 'sex', value: 0 },
      { id: 'sáb.', label: 'sáb', value: 0 }
    ],
    media_watts: 0,
    media_moeda: 0
  };

  const { data: profileData, isFetching: isFetchingProfile } = useProfile();
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [weekConsumption, setWeekConsumption] = useState<WeeklyConsumption>(weeksConsumptionTemplate);
  const [counter, setCounter] = useState(4);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    setLoading(true);
    setWeekConsumption(weeksConsumptionTemplate);
    const weeksArray = getWeeksInMonth(new Date().getFullYear(), new Date().getMonth() + 1);
    const weeksArrayDate = getWeeksBetweenDates(getDateFourWeeksAgo(), new Date());
    setWeeks(weeksArrayDate);

    if (profileData && weeksArray[counter] && weeksArray[counter].length === 7) {
      try {
        if(idsMeters.length > 0){
          const res = await getEachDayInAWeekMeasure(profileData[0].id, weeksArrayDate[counter], idsMeters);
          if (res.weeks_consumption) {
           

            setWeekConsumption(prevState => ({
             
              weeks_consumption: prevState.weeks_consumption.map((day) => {
                const updatedDay = res.weeks_consumption.find((newDay) => newDay.id === day.id);
                return updatedDay ? { ...day, value: updatedDay.value } : day;
              }),
              media_watts: res.media_watts,
              media_moeda: res.media_moeda
            }));

            // setWeekConsumption(res);

          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    setLoading(false);
  }, [profileData, counter, idsMeters]);

  const incrementar = useCallback(async () => {
    if (counter < 4) {
      setCounter((prev) => prev + 1);
    }
  }, [counter]);

  const decrementar = useCallback(async () => {
    if (counter > 0) {
      setCounter((prev) => prev - 1);
    }
  }, [counter]);
  

  useEffect(() => {
    setLoading(true);
    if (profileData && profileData[0]) {
      let j = setTimeout(obterDados,1000)
      return () => {
        clearTimeout(j);
      };
    }
  }, [profileData, obterDados, counter, idsMeters]);

  return (
    <Skeleton visible={false}>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: 400 }}>
        <Grid className="mantine-Group-root mantine-Title-root mantine-5bhg3d" style={{ fontSize: "17px", marginLeft: "7px", marginBottom: "10px", color: '#000000' }}>
          <Title style={{ fontSize: 21, fontWeight: 700, marginBottom: 5 }}>  Distribuição de consumo semanal (kWh e R$)</Title>
          <Grid.Col style={{ marginBottom: 10 }}>
            <Group>
            { counter > 0 ?
              <Button onClick={decrementar} style={{ backgroundColor: "#ffffff" }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="26" height="26" rx="13" fill="#B9B9B9" />
                  <path d="M18.17 13.085H8M8 13.085L13.085 18.17M8 13.085L13.085 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button> : <div style={{ width:26, height:26 }}>{ ' ' }</div>
            }
              <Text style={{ fontWeight: 500, fontSize: 16 }}>
                {weeks[counter] && weeks[counter].length === 7
                  ? `${weeks[counter][0].toLocaleDateString('pt-br')} até ${weeks[counter][weeks[counter].length - 1].toLocaleDateString('pt-br')}`
                  : ''}
              </Text>
              { (counter < 4) ?
              <Button onClick={incrementar} style={{ backgroundColor: "#ffffff" }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="26" y="26" width="26" height="26" rx="13" transform="rotate(-180 26 26)" fill="#B9B9B9" />
                  <path d="M7.83 12.915L18 12.915M18 12.915L12.915 7.83M18 12.915L12.915 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button> :  <div style={{ width:26, height:26 }}>{ ' ' }</div>
            }
            </Group>
          </Grid.Col>
        </Grid>
        <div style={{ height: 200 }}>
          {loading ? (
            <Text style={{ fontSize: 12, marginLeft: 15 }}>Carregando...</Text>
          ) : (
            <ResponsiveBar
            tooltip={({ id, value, color }) => (
              <div
                style={{
                  padding: '12px',
                  // color,
                  background: '#ffffff',
                }}
              >
                {value/1000+'kWh'}
              </div>
            )}
              data={weekConsumption.weeks_consumption || [{ id: "", value: "", color: "#00AEA3" }]}
              layout="vertical"
              enableGridX={false}
              enableGridY={true}
              axisRight={null}
              axisLeft={{
                format: function(value){ 

                 return ( (value/1000).toFixed(1) 
         )
                 },
                tickSize: 10,
                tickPadding: 15,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 0,
              }}
              spacing={5}
              theme={{
                axis: {
                  ticks: {
                    line: { strokeWidth: 0 },
                    text: {
                      fill: "#B9B9B9",
                      fontWeight: 700,
                      fontFamily: 'DM Sans, sans-serif',
                    },
                  },
                },
              }}
              margin={{ top: 20, right: 20, bottom: 50, left: 80 }}
              colors={['#00AEA3']}
              enableLabel={false}
              borderRadius={5}
              labelTextColor="#686868"
              // yFormat={value => value + 'kWh' }
              
            />
          )}
        </div>
        <Group>
          <Text style={{ fontSize: 16, fontWeight: 500, color: '#000000' }}>Média do consumo semanal:</Text>
          <Text style={{ fontSize: 16, fontWeight: 700, color: '#00AEA3' }}>
            
          { weekConsumption.media_watts !== null ? 
           (weekConsumption.media_watts/1000).toFixed(1)+'kWh' 
          : 'N/A'}
             { 
        ' = '+ new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
}).format(weekConsumption.media_moeda)} </Text>
        </Group>
      </Card>
    </Skeleton>
  );
};

export default DistribuicaoDeConsumoSemanal;
