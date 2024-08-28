import { Skeleton, Grid, Card } from '@mantine/core';
import { createStyles } from "@mantine/styles";
import React, { useEffect, useState, useRef } from 'react';
import DefaultPropsInterface from 'components/Geral/DefaultPropsInterface';
import { ResponsivePie } from '@nivo/pie';
import CurrentConsumptioInterface from 'components/Geral/CurrentConsumption/CurrentConsumptioInterface';
import { getPowerLive } from '@core/domain/Geral/Geral.service';
import Moment from 'moment';

function CurrentConsumption({
  idsMeters,
  timeout,
  heightCard,
  setUpdateAt,
  updateAt,
  setConsumoLive
}: DefaultPropsInterface) {
  const { classes } = useStyles();
  const cardRef = useRef(null);
  const [data, setData] = useState<Array<CurrentConsumptioInterface>>([{
    id: null,
    label: null,
    value: null,
  }]);
  const [carregado, setCarregado] = useState<Boolean>(false);

  const legendsConfig = {
    anchor: 'bottom',
    direction: 'row',
    justify: true,
    translateX: 0,
    translateY: 56, // Adjusted translation to move legend down
    itemsSpacing: 20, // Increased spacing between items
    itemDirection: 'left-to-right',
    itemWidth: 100, // Increased width to provide more space for text
    itemHeight: 20,
    itemOpacity: 1,
    symbolSize: 12, // Set size of the symbol
    symbolShape: 'circle', // Define the shape of the symbol
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
  };

  const calculateLegends = (width) => {
    const maxItemsPerRow = Math.floor(width / (legendsConfig.itemWidth + legendsConfig.itemsSpacing));
    const shouldStack = data.length > maxItemsPerRow;

    if (shouldStack) {
      return {
        ...legendsConfig,
        direction: 'column',
        anchor: 'right',
        translateX: 150,
        translateY: 0,
      };
    }

    return legendsConfig;
  };


  const CustomTooltip = ({ datum }) => (
    <div
      style={{
        padding: '5px 10px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
   <strong> {datum.label}</strong> 
      <br />
      {datum.data.value}%
    </div>
  );

  const updatePie = (idsMeters: Array<string | number> | null) => {
    getPowerLive(idsMeters).then((response) => {
      const dados = [];
      let consumoLive: number = 0;

      for (let id in response) {
        dados.push({
          id: response[id].potencia_ativa == "0"
            ? response[id].descricao_medidor + " - " + (response[id].potencia_ativa / 1000).toFixed(1) + "kW"
            : (response[id].potencia_ativa / 1000).toFixed(1) + " kW",
          label: response[id].descricao_medidor.length > 20 ? response[id].descricao_medidor.substr(0, 20) + '...' : response[id].descricao_medidor,
          value: response[id].porcentagem,
        });

        consumoLive += response[id]?.consumo || response[id].potencia_ativa ? (response[id].potencia_ativa / 1000) : 0;
      }

      consumoLive = parseFloat(consumoLive.toFixed(4));

      setConsumoLive(consumoLive);
      setData(dados);
      setCarregado(true);

      if (updateAt != Moment().format('HH:mm')) {
        setUpdateAt(Moment().format('HH:mm'));
      }
    });
  };

  useEffect(() => {
    updatePie(idsMeters);
    const timer = setInterval(() => {
      updatePie(idsMeters);
    }, timeout);

    return () => {
      clearInterval(timer);
    };
  }, [idsMeters, timeout]);

  const theme = {
    fontSize: 8,
    labels: {
      text: {
        fontSize: 28,
        fontFamily: 'DM Sans',
        fontWeight: 500
      }
    },
    legends: {
      text: {
        fill: "#686868",
        color: "#686868",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'DM Sans'
      }
    }
  };

  return (
    <Skeleton visible={!carregado}>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ alignContent: 'center' }} ref={cardRef}>
        <div style={{ height: heightCard }}>
          <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontFamily: 'DM Sans', fontSize: 21, fontWeight: 700, marginLeft: "7px", marginBottom: "0px", color: '#000000' }}>
            Potência Ativa por setor
          </Grid>
          {carregado && (
            <ResponsivePie
            tooltip={CustomTooltip}
              data={data}
              margin={{ top: 50, right: 160, bottom: 100, left: 160 }} 
              // sliceLabel={(item) => `${item.value}%`}
              innerRadius={0.5}
              padAngle={0}
              cornerRadius={0}
              activeOuterRadiusOffset={8}
              borderWidth={0}
              colors={['#00AEA3', '#00C2FF', '#FF9700', 'red', 'yellow']}
              theme={theme}
              enableArcLabels={false}
              borderColor={{
                from: 'color',
                modifiers: [
                  ['darker', 0.2]
                ]
              }}
              arcLinkLabelsSkipAngle={12}
              arcLinkLabelsTextColor={{ from: 'color' }}
              arcLinkLabelsThickness={0}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={20}
              arcLabelsTextColor="white"
              arcLinkLabelsTextOffset={0}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  size: 10,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  rotation: 0,
                  lineWidth: 6,
                  spacing: 20
                }
              ]}
              legends={[
                {
                  anchor: "bottom",
                  direction: "column",
                  justify: false,
                  translateX: 150,
                  translateY: 40,
                  itemsSpacing: 5,
                  itemWidth: 200,
                  itemHeight: 20,
                  itemDirection: "right-to-left",
                  itemOpacity: 0.85,
                  itemTextColor: "#000000",
                  symbolSize: 10,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1
                      }
                    }
                ]
                }
              ]}
              // valueFormat={(value: string | number | null) => `${value}%`}
              arcLinkLabelsOffset={-12}
            />
          )}
        </div>
      </Card>
    </Skeleton>
  );
}

const useStyles = createStyles(() => {
  return {
    image: {
      width: "140px"
    },
    spaceTop: {
      marginTop: "10px"
    },
    iconSpace: {
      marginRight: "-13px"
    },
    defaultFont: {
      fontSize: "20px"
    }
  };
});

export default CurrentConsumption;