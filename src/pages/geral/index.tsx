import React, { useEffect, useState } from "react";
import { usePageTitle } from "@contexts/PageTitleContextProvider";
import CurrentConsumption from "@components/Geral/CurrentConsumption";
import Live from "@components/Geral/Live";
import Header from "@components/Geral/Header";
import CarbonEmission from "@components/Geral/CarbonEmission";
import HeatMap from "@components/Geral/HeatMap";
import Temperature from "@components/Geral/Temperature";
import TemperatureLive from "@components/Geral/TemperatureLive";
import ConsumptionDistribution from "@components/Geral/ConsumptionDistribution";

import { useMonitors } from "@core/domain/Monitors/Monitors.hooks";
import { Grid, Skeleton, Card, Title } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import {
  getMonitorInfo,
  getTemperatureLive,
} from "@core/domain/Geral/Geral.service";
import DefaultPropsInterface from "components/Geral/DefaultPropsInterface";
import Moment from "moment";
import ProtecaoAtiva from "@components/ProtecaoAtiva";
import { ResponsiveBar } from "@nivo/bar";

function GeralPage() {
  usePageTitle("Geral");

  const timeRefreshPage = 5000; // 5 segundos
  const { classes, cx } = useStyles();

  const { data } = useMonitors();
  const idsMeters = data?.map((item) => item.meterId) || [];

  const [updateAt, setUpdateAt] = useState<string>(Moment().format("HH:mm"));
  const [liveTemperature, setTemperatureLive] = useState<Array<any>>([]);
  const [consumoLive, setConsumoLive] = useState<any>(0);

  const [propsInfo, setPropsInfo] = useState<DefaultPropsInterface>({
    bandeira: null,
    cidade: null,
    distribuidora: null,
    temperature: null,
    humidity: null,
    estado: null,
  });

  // const temperatureLive = () => {
  //   getTemperatureLive().then(function (response) {
  //      setTemperatureLive(response)
  //   })
  // };

  const monitorInfo = () => {
    getMonitorInfo().then(function (response) {
      setPropsInfo({
        bandeira: response?.bandeira,
        cidade: response?.cidade,
        distribuidora: response?.distribuidora,
        temperature: response?.temperature,
        humidity: response?.humidity,
        estado: response?.estado,
      });
    });
  };

  useEffect(() => {
    // temperatureLive();
    monitorInfo();
    const timer = setInterval(() => {
      // temperatureLive();
      monitorInfo();
    }, 60000);
  }, []);

  return (
    <>
      {idsMeters.length > 0 ? (
        <>
          <Header {...propsInfo} updateAt={updateAt} />
          <Grid className={classes.spaceTop}>
            <Grid.Col span={12} md={12}>
              <ProtecaoAtiva idsMeters={data} principal={true} />
            </Grid.Col>
          </Grid>
          <Grid className={classes.spaceTop}>
            <Grid.Col span={12} md={7}>
              <CurrentConsumption
                idsMeters={idsMeters}
                timeout={5000}
                setUpdateAt={setUpdateAt}
                updateAt={updateAt}
                heightCard={"600px"}
                setConsumoLive={setConsumoLive}
              />
            </Grid.Col>

            <Grid.Col span={12} md={5}>
              <CarbonEmission
                idsMeters={idsMeters}
                initialDate={Moment().subtract(6, "days").format("YYYY-MM-DD")}
                finalDate={Moment().format("YYYY-MM-DD")}
                timeout={60000}
                heightCard={320}
              />
              <div style={{ marginTop: "15px" }}></div>
              {propsInfo.temperature && propsInfo.humidity && (
                <Temperature
                  idsMeters={[idsMeters[0]]}
                  isItLiveTemperature={false}
                  temperature={propsInfo.temperature}
                  humidity={propsInfo.humidity}
                  heightCard={"300px"}
                  subtitle={"Fonte: Open Weather Map"}
                />
              )}
            </Grid.Col>
          </Grid>

          <Grid className={classes.spaceTop}>
            <Grid.Col span={12} md={12}>
              <HeatMap
                idsMeters={idsMeters}
                initialDate={Moment().subtract(6, "days").format("YYYY-MM-DD")}
                finalDate={Moment().format("YYYY-MM-DD")}
                timeout={60000}
                heightCard={"270px"}
              />
            </Grid.Col>
            <Grid.Col span={12} md={12}>
              <ProtecaoAtiva idsMeters={data} principal={false} />
            </Grid.Col>
          </Grid>

          <Grid className={classes.spaceTop}>
            {/* {liveTemperature && liveTemperature.map(item => (
                <>
                <Grid.Col span={12} md={4}> <TemperatureLive 
                  title={ item?.descricao_dispositivo + ' - '+ item?.descricao_medidor +''}
                  temperature={ item?.temperatura}
                  humidity={ item?.umidade}
                  heightCard={'190px'}
                  subtitle={"Horário de Medição: "+item?.horas_da_medicao}
                /> 
                </Grid.Col>

                </>
            ))} */}
          </Grid>
        </>
      ) : null}
    </>
  );
}

const useStyles = createStyles(() => {
  return {
    iconSpace: {
      marginRight: "12px",
    },
    spaceTop: {
      marginTop: "10px",
    },
    textValue: {
      color: "#B9B9B9",
      fontWeight: "bold",
      fontSize: "18px",
    },
    defaultFont: {
      fontSize: "16px",
    },
  };
});

export default GeralPage;
