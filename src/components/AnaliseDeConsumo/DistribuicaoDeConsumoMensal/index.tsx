import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AreaBumpComputedSerie, AreaBumpInputSerie, ResponsiveAreaBump } from '@nivo/bump';
import { Button, Card, Grid, Group, Skeleton, Text, Title } from '@mantine/core';
import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import { getMonthlyProjectionForEach } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import { useOrdinalColorScale } from "@nivo/colors";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';

interface CustomTooltipProps {
  serie: AreaBumpComputedSerie;
  x: number | null;
  y: number | null;
}

const DistribuicaoDeConsumoMensal = ({ idsMeters = [] as { value: string, label: string }[] }) => {
  const defaultObjectForeach = {
    kwh_registrado: 0,
    kwh_previsto: 0,
    kwh_anterior: 0,
    kwh_total: 0,
    custo_total: 0,
    grafico: [{ id: "", data: [{ x: "", y: 0 }] }]
  };

  const [consumo, setConsumo] = useState(false);
  const [dataForEach, setDataForEach] = useState(defaultObjectForeach);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: profileData } = useProfile(); // Assuming useProfile returns { data }

  const colors = useOrdinalColorScale({ scheme: "nivo" }, "id");

  const dataFiltered = useMemo(
    () => dataForEach.grafico.filter((item) => !hiddenIds.includes(String(item.id))),
    [hiddenIds, dataForEach.grafico]
  );

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  }), []);

  const numberFormatter = useMemo(() => new Intl.NumberFormat('pt-br'), []);

  const legendsConfig = useMemo(() => ({
    anchor: 'top',
    direction: 'row',
    justify: true,
    translateX: 0,
    translateY: -50,
    itemsSpacing: 50,
    itemDirection: 'left-to-right',
    itemWidth: 120,
    itemHeight: 20,
    itemOpacity: 1,
    symbolSize: 12,
    symbolShape: 'circle',
    symbolBorderColor: 'rgba(0, 0, 0, .5)',
    effects: [
      {
        on: 'hover',
        style: {
          itemBackground: 'rgba(0, 0, 0, .03)',
          itemOpacity: 1
        }
      }
    ]
  }), []);

  const calculateLegends = useCallback(() => {
    const maxItemsPerRow = Math.floor(window.innerWidth / (legendsConfig.itemWidth + legendsConfig.itemsSpacing));
    const shouldStack = dataForEach.grafico.length > maxItemsPerRow;

    return shouldStack
      ? {
        ...legendsConfig,
        direction: 'column',
        anchor: 'right',
        translateX: 150,
        translateY: 0,
      }
      : legendsConfig;
  }, [dataForEach.grafico.length, legendsConfig]);

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
      {x !== null ? 'Data: ' + new Date(x).toLocaleString('pt-br', { month: "2-digit", year: "numeric" }) : 'N/A'}<br />
      {x !== null ? 'Data: ' + new Date(x).toLocaleString('pt-br', { month: "2-digit", day: "2-digit" }) : 'N/A'}<br />
      {y !== null ? (consumo ? (parseFloat(y.toFixed(2)) / 1000).toFixed(2) + 'kWh' : currencyFormatter.format(y)) : 'N/A'}
    </div>
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (profileData && profileData[0]?.id) {
        const id = profileData[0].id;
        if (idsMeters.length > 0) {
          const resultForeach = await getMonthlyProjectionForEach(id, idsMeters, consumo);
          setDataForEach(resultForeach || defaultObjectForeach);
        } else {
          setDataForEach(defaultObjectForeach);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [profileData, idsMeters, consumo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Skeleton visible={false}>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: 700 }}>
        <Grid style={{ fontSize: "17px", marginLeft: "7px", marginBottom: "10px", color: '#000000' }}>
          <Grid.Col span={6}>
            <Title style={{ fontSize: 21, fontWeight: 700 }}>Projeção de consumo do mês (kWh e R$)</Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group style={{ float: 'right' }}>
              <Button
                style={{ backgroundColor: !consumo ? "#F9F9F9" : '#00AEA3', color: !consumo ? '#B9B9B9' : '#FFFFFF', borderRadius: 6, width: 84 }}
                onClick={() => setConsumo(true)}
              >
                kWh
              </Button>
              <Button
                style={{ backgroundColor: consumo ? "#F9F9F9" : '#00AEA3', color: consumo ? '#B9B9B9' : '#FFFFFF', borderRadius: 6, width: 84 }}
                onClick={() => setConsumo(false)}
              >
                R$
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Text style={{ fontSize: 16, fontWeight: 700, color: '#B0B0B0' }}>Acumulado</Text>
          </Grid.Col>
          <Grid.Col>
            <Text style={{ fontSize: 14, fontWeight: 500, color: '#B0B0B0' }}>
              {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
            </Text>
          </Grid.Col>
        </Grid>

        <div style={{ height: 400, minWidth: 0 }}>
          {loading ? <Text style={{ fontSize: 12, marginLeft: 15 }}>Carregando...</Text> :
          <ResponsiveLine
          data={dataFiltered}
          margin={{ top: 45, right: 145, bottom: 100, left: 48 }}
          enableGridX={false}
          enablePoints={false}
          isInteractive
          enableSlices="x"
          axisLeft={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: -40,
              legendPosition: 'middle',
              minValue: 0 // Set the minimum value for y-axis to 0
          }}
          axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: '',
              legendOffset: 36,
              legendPosition: 'middle',
              minValue: 0,
              format: function(value){ 
                  return moment(value).format('DD/MM/YYYY');
              }
          }}
          useMesh
          yFormat={value => !consumo ? currencyFormatter.format(parseFloat(value.toString())) : value + 'kWh'}
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
                              ? state.filter((id) => id !== String(datum.id))
                              : [...state, datum.id]
                      );
                  }
              }
          ]}
          tooltip={CustomTooltip}
      />
      
          }
        </div>

        <Grid style={{ marginTop: 15, fontSize: '14px', color: '#B0B0B0' }} gutter={0}>
          <Grid.Col span={2} style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Grid gutter={0}>
              <Grid.Col>
                <Text style={{ fontSize: 34, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>
                  {numberFormatter.format(parseFloat(dataForEach.kwh_registrado.toFixed(1))) + 'kWh'}
                </Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>
                  Consumo registrado
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2} style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 34, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>+</Text>
          </Grid.Col>
          <Grid.Col span={2} style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Grid gutter={0}>
              <Grid.Col>
                <Text style={{ fontSize: 34, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>
                  {numberFormatter.format(parseFloat(dataForEach.kwh_previsto.toFixed(1))) + 'kWh'}
                </Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>
                  Consumo previsto
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2} style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 34, fontWeight: 700, color: '#B9B9B9', textAlign: 'center' }}>=</Text>
          </Grid.Col>
          <Grid.Col span={2} style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Grid gutter={0}>
              <Grid.Col>
                <Text style={{ fontSize: 34, fontWeight: 700, color: '#00AEA3', textAlign: 'center' }}>
                  {numberFormatter.format(parseFloat(dataForEach.kwh_total.toFixed(1))) + 'kWh'}
                </Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#00AEA3', textAlign: 'center' }}>
                  Total previsto
                </Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#00AEA3', textAlign: 'center' }}>
                  {currencyFormatter.format(dataForEach.custo_total)}
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Card>
    </Skeleton>
  );
};

export default DistribuicaoDeConsumoMensal;
