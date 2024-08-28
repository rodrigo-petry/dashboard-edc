import React, { useEffect, useState, useRef, useMemo } from 'react';
import { usePageTitle } from '@contexts/PageTitleContextProvider';
import { useMonitors } from '@core/domain/Monitors/Monitors.hooks';
import { Grid, MultiSelect } from '@mantine/core';
import { createStyles } from "@mantine/styles";
import ComparativoDeConsumo from '@components/AnaliseDeConsumo/ComparativoDeConsumo';
import DistribuicaoDeConsumoDiario from '@components/AnaliseDeConsumo/DistribuicaoDeConsumoDiario';
import DistribuicaoDeConsumoMensal from '@components/AnaliseDeConsumo/DistribuicaoDeConsumoMensal';
import DistribuicaoDeConsumoSemanal from '@components/AnaliseDeConsumo/DistribuicaoDeConsumoSemanal';
import Fechamento from '@components/AnaliseDeConsumo/Fechamento';
import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import { getProfileMeasuresWithName } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';
import { IAnaliseDeConsumoMedidor } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.types';

const useStyles = createStyles(() => {
  return {
    iconSpace: {
      marginRight: "12px",
    },
    spaceTop: {
      marginTop: "10px",
    },
    textValue: {
      color: "#00AEA3",
      fontWeight: "bold",
      fontSize: "18px",
    },
    defaultFont: {
      fontSize: "16px",
    },
  };
});

function AnaliseDeConsumo() {
  usePageTitle("Análise de Consumo");
  const { classes } = useStyles();
  const [medidorSelecionado, setMedidorSelecionado] = useState<string[]>([]);
  const { data: profileData } = useProfile();
  const { data: monitorsData } = useMonitors();
  const [idsMeters, setIdMeters] = useState<IAnaliseDeConsumoMedidor[]>([]);
  const idMetersRef = useRef<IAnaliseDeConsumoMedidor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (monitorsData && profileData && profileData.length > 0 && idsMeters.length === 0) {
      setLoading(true);

      getProfileMeasuresWithName(profileData[0].id).then((measures) => {
        if (isMounted) {
          const res = measures.filter((e) => e);

          if (res.length > 0) {
            setIdMeters(res);
            idMetersRef.current = res;
            setMedidorSelecionado(res.map((e) => e.id));
          }

          monitorsData.forEach((item) => {
            if (!res.map((e) => e.id.toString()).includes(item.meterId.toString())) {
              const newItem = {
                id: item.meterId ? item.meterId.toString() : (Math.floor(Math.random() * 100) - 90).toString(),
                nome: item.name,
                watts: item.avereageDemand,
                watts_max: 0,
                total_mes: 0,
                kwh_mes: 0,
                kwh_max: 0,
                ligado: false,
                status: '',
                tipo_de_medidor_id: 0,
                tipo_de_medidor: '',
              };

              if (!idMetersRef.current.some((m) => m.id === newItem.id)) {
                idMetersRef.current = [...idMetersRef.current, newItem];
                setIdMeters([...idMetersRef.current]);
                setMedidorSelecionado((prev) => [...prev, newItem.id]);
              }
            }
          });

          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [profileData, monitorsData, idsMeters.length]);

  const idsMetersData = useMemo(
    () => idsMeters.map((data) => ({ value: data.id, label: `#${data.id} ${data.nome}` })),
    [idsMeters]
  );

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {idsMeters.length > 0 && (
        <>
          <Grid className={classes.spaceTop}>
            <Grid.Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <MultiSelect
                  label="Medidores Selecionados"
                  placeholder="Selecione um medidor"
                  data={idsMetersData}
                  value={medidorSelecionado}
                  onChange={setMedidorSelecionado}
                />
              </div>
              <DistribuicaoDeConsumoMensal idsMeters={idsMetersData.filter((e) => medidorSelecionado.includes(e.value.toString()))} />
            </Grid.Col>
          </Grid>
          <Grid className={classes.spaceTop}>
            <Grid.Col span={6} md={6}>
              <DistribuicaoDeConsumoDiario idsMeters={medidorSelecionado.map((e) => parseInt(e))} />
            </Grid.Col>
            <Grid.Col span={6} md={6}>
              <DistribuicaoDeConsumoSemanal idsMeters={medidorSelecionado.map((e) => parseInt(e))} />
            </Grid.Col>
          </Grid>
          <Grid className={classes.spaceTop}>
            <Grid.Col span={12} md={6}>
              <ComparativoDeConsumo idsMeters={medidorSelecionado.map((e) => parseInt(e))} />
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <Fechamento idsMeters={medidorSelecionado.map((e) => parseInt(e))} />
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  );
}

export default AnaliseDeConsumo;
