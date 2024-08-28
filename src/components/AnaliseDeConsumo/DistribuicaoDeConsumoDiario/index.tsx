import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Button, Card, Grid, Group, Skeleton, Text, Title } from '@mantine/core';
import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import { getPontaAndForaDePonta } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import moment from 'moment';

const defaultObject = {
  grafico: [
    {
      id: "",
      value: 0,
      color: "#00AEA3"
    },
  ],
  media_watts: 0,
  media_moeda: 0
};

const generateMeses = (year) => {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return months.map((month, index) => `${month} / ${year}`);
};

const SvgButton = ({ direction, onClick }) => (
  <Button onClick={onClick} style={{ backgroundColor: "#ffffff" }}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="13" fill="#B9B9B9" transform={direction === 'left' ? '' : 'rotate(-180 13 13)'} />
      <path d={`M${direction === 'left' ? '18.17 13.085H8M8 13.085L13.085 18.17M8 13.085L13.085 8' : '7.83 12.915L18 12.915M18 12.915L12.915 7.83M18 12.915L12.915 18'}`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Button>
);

const DistribuicaoDeConsumoDiario = ({ idsMeters = [] }) => {
  const [data, setData] = useState(defaultObject);
  const { data: profileData, isFetching: isFetchingProfile } = useProfile();
  const currentYear = new Date().getFullYear();
  const [meses, setMeses] = useState(generateMeses(currentYear));
  const [counter, setCounter] = useState(moment().month() + 1);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async (month) => {
    setLoading(true);
    setData(defaultObject);

    if (profileData && idsMeters.length > 0) {
      try {
        const consumption = await getPontaAndForaDePonta(
          profileData[0].id,
          `${new Date().getFullYear()}-${month.toString().padStart(2, '0')}`,
          '00',
          idsMeters
        );
        setData(consumption);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [profileData, idsMeters]);

  const incrementar = useCallback(() => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter < meses.length ? prevCounter + 1 : prevCounter;
      obterDados(newCounter);
      return newCounter;
    });
  }, [obterDados, meses.length]);

  const decrementar = useCallback(() => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter > 1 ? prevCounter - 1 : prevCounter;
      obterDados(newCounter);
      return newCounter;
    });
  }, [obterDados]);

  useEffect(() => {
    setData(defaultObject);
    if (profileData && profileData.length > 0 && idsMeters.length > 0) {
      obterDados(counter);
    }
  }, [profileData, idsMeters, counter, obterDados]);

  return (
    <Skeleton visible={isFetchingProfile || loading}>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: 400 }}>
        <Grid style={{ fontSize: "17px", marginLeft: "7px", marginBottom: "10px", color: '#000000' }}>
          <Title style={{ fontSize: 21, fontWeight: 700, marginBottom: 10 }}>Distribuição de consumo diário (kWh e R$)</Title>
          <Grid.Col>
            <Group>
              <SvgButton direction="left" onClick={decrementar} />
              <Text style={{ fontWeight: 500, fontSize: 16 }}>{meses[counter - 1]}</Text>
              <SvgButton direction="right" onClick={incrementar} />
            </Group>
          </Grid.Col>
        </Grid>
        <div style={{ height: 200 }}>
          {loading ? (
            <Text style={{ fontSize: 12, marginLeft: 15 }}>Carregando...</Text>
          ) : (
            <ResponsiveBar
              data={data.grafico.reverse()}
              tooltip={({ value }) => (
                <div style={{ padding: '12px', background: '#ffffff' }}>
                  {value + ' kWh'}
                </div>
              )}
              layout="horizontal"
              enableGridX={false}
              enableGridY={false}
              axisRight={null}
              theme={{
                axis: {
                  ticks: {
                    line: {
                      strokeWidth: 0,
                    },
                    text: {
                      fill: "#B9B9B9",
                      fontWeight: 700,
                      fontFamily: 'DM Sans, sans-serif',
                    },
                  },
                },
              }}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              colors={['#00AEA3']}
              enableLabel={false}
              borderRadius={5}
              labelTextColor="#686868"
            />
          )}
        </div>
        <Group>
          <Text style={{ fontSize: 16, fontWeight: 500, color: '#000000' }}>Média do consumo diário:</Text>
          <Text style={{ fontSize: 16, fontWeight: 700, color: '#00AEA3' }}>
            {data.media_watts !== null ? 
              `${new Intl.NumberFormat('pt-br').format(parseFloat((data.media_watts / 1000).toFixed(1)))} kWh` : 
              'N/A'}
            {' = ' + new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(data.media_moeda)}
          </Text>
        </Group>
      </Card>
    </Skeleton>
  );
};

export default DistribuicaoDeConsumoDiario;
