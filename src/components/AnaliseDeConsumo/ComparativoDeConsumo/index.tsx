import { Text, Card, Skeleton, Grid, Title } from '@mantine/core';
import { createStyles } from "@mantine/styles";
import React, { useEffect, useState, useCallback } from 'react';
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface';
import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import { getConsumptionComparative } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function ComparativoDeConsumo({ heightCard, idsMeters }) {
  const { classes, cx } = useStyles();

  const currencyFormatter =  new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });

  const default_object = {
    kwh_atual: 0,
    custo_atual: 0,
    kwh_anterior: 0,
    custo_anterior: 0,
    balanco: 0,
  }

  const [data, setData] = useState(default_object);

  const { data: profileData, isFetching: isFetchingProfile } = useProfile();

  useEffect(() => {
    setData(default_object)
    if (profileData && idsMeters && idsMeters.length > 0) {
      getConsumptionComparative(profileData[0].id, idsMeters).then(res => setData(res));
    }
  }, [profileData, idsMeters]);

  // Calcular a porcentagem de mudança no custo, memoized with useCallback
  const calcularPorcentagem = useCallback((custo_atual, custo_anterior) => {
    if (custo_anterior === 0) return 0;
    return ((custo_atual - custo_anterior) / custo_anterior) * 100;
  }, []);

  const porcentagem = calcularPorcentagem(data.kwh_atual, data.kwh_anterior);
  const aumentoOuReducao = porcentagem >= 0 ? 'Aumento' : 'Redução';

  return (
    <Skeleton visible={false}>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
        <Grid className="mantine-Group-root mantine-Title-root mantine-5bhg3d" style={{ fontSize: "17px", marginLeft:"0px", marginBottom:"10px", color: '#000000'}}>
          <Grid.Col>
            <Title style={{ fontSize: 21, fontWeight: 700, marginBottom: 5 }}>Comparativo de consumo (kWh e R$)</Title>
          </Grid.Col> 
        </Grid>
        <Grid style={{ marginTop: "2px" }}>
          <Grid.Col span={12} md={8} className="mantine-Group-root mantine-Title-root mantine-5bhg3d" style={{ marginLeft: 10 }}>
          </Grid.Col>
        </Grid>
        <Grid style={{ marginLeft: 0 }}>
          <Grid.Col span={4}>
            <Text style={{ fontWeight: 700, color: "#000000", fontSize: 16 }}>Mês Anterior</Text>
          </Grid.Col>
          <Grid.Col span={2}>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 34 }}>
            </Text>
            <Text style={{ fontWeight: 700, color: "#000000", fontSize: 16 }}>Mês Atual</Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 34 }}>{(data.kwh_anterior).toFixed(1) }
              <span style={{ fontSize: 20 }}> kWh</span>
            </Text>
            <Grid>
              <Grid.Col>
                <Text style={{ fontWeight: 700, color: "#B9B9B9", fontSize: 14 }}>kWh</Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 14 }}>
                  {(data && data.custo_anterior) ? currencyFormatter.format(parseFloat(data.custo_anterior.toFixed(2))) : ''}
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2}>
          </Grid.Col>
          <Grid.Col span={5}>
            <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 34 }}>{(data.kwh_atual).toFixed(1) }
              <span style={{ fontSize: 20 }}> kWh</span>
            </Text>
            <Grid>
              <Grid.Col>
                <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 14 }}>Total previsto</Text>
              </Grid.Col>
              <Grid.Col>
                <Text style={{ fontWeight: 700, color: "#00AEA3", fontSize: 14 }}>{(data && data.custo_atual) ? currencyFormatter.format(parseFloat(data.custo_atual.toFixed(2))) : ''}</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={6} offset={3} style={{marginTop:10, marginBottom: 10}} >
            <Grid>
              {
                aumentoOuReducao === 'Aumento' ?  <FaArrowUp size={20} color='#FF0000'/> : <FaArrowDown size={20}  color='#09cf09'/>
              }
              <Text style={{ marginLeft:5, fontWeight: 700, color: aumentoOuReducao === 'Aumento' ? '#FF0000' : '#09cf09', fontSize: 20 }}>{aumentoOuReducao} de {porcentagem.toFixed(2)}%</Text>
            </Grid>
          </Grid.Col>
        </Grid>
      </Card>
    </Skeleton>
  );
}

const useStyles = createStyles(() => {
  return {
    spaceTop: {
      marginTop: "10px"
    },
    textValue: {
      color: "#B9B9B9",
      fontWeight: "bold",
      fontSize: "18px",
    },
    defaultFont: {
      fontSize: "16px",
    },
    descriptionFont: {
      fontSize: "14px",
      color: "#000",
      fontWeight: '500'
    },
    iconCustom: {
      fontSize: "23px",
      marginTop: "-15px"
    },
    iconClass: {
      fontSize: "80px",
      color: "#000",
      marginTop: "-15px"
    },
    iconClassArvore: {
      fontSize: "80px",
    },
    center: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "-10px",
    },
  };
});

export default ComparativoDeConsumo;
