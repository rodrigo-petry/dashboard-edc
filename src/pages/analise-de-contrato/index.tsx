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
import {
  Grid,
  Skeleton,
  Card,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { createStyles } from "@mantine/styles";
import {
  getMonitorInfo,
  getTemperatureLive,
} from "@core/domain/Geral/Geral.service";
import DefaultPropsInterface from "components/Geral/DefaultPropsInterface";
import Moment from "moment";
import ProtecaoAtiva from "@components/ProtecaoAtiva";
import { ResponsiveBar } from "@nivo/bar";
import BarChartComponent from "@components/Geral/BarChart";
import DatePicker from "@components/_shared/DatePicker";
import { FaArrowLeft, FaArrowRight, FaCalendar } from "react-icons/fa";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import moment from "moment";
import {
  blueData,
  greenData,
  heatMapData,
  keysHeatMap,
  mercadoLivreData,
  responsiveBarData,
  responsiveLineData,
} from "mocks/analiseDeContrato";
import dayjs from "dayjs";

const defaultObject = {
  grafico: responsiveBarData,
  media_watts: 0,
  media_moeda: 0,
};

function AnaliseDeContrato() {
  usePageTitle("Análise de contrato");
  const { classes, cx } = useStyles();
  const [data, setData] = useState(defaultObject);
  const [active, setActive] = useState<string>("green");
  // const { data } = useMonitors();
  // const idsMeters = data?.map((item: any) => item.meterId) || [];
  const [dataMock, setDataMock] = useState(greenData);
  const [date, setDate] = useState<string>(new Date().toString());
  const [weekNumber, setWeekNumber] = useState<number>(1);
  return (
    <>
      <Grid>
        <Grid.Col span={12} md={6} lg={3}>
          <DatePicker
            icon={<FaCalendar />}
            placeholder="Selecione uma data"
            value={dayjs(date).toDate()}
            onChange={(value: any) => {
              setDate(value);
            }}
          />
        </Grid.Col>
      </Grid>
      <Grid className={classes.spaceTop}>
        <Grid.Col span={12} md={12}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            style={{ padding: "40px 25px " }}
          >
            <Grid>
              <Grid.Col span={12} md={3}>
                <Text style={{ fontWeight: 600, padding: "4px 0" }}>
                  Contrato
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  A4 - Verde (02/02/1018)
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  700 Kw (10/04/2024)
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  MW Meduo
                </Text>
              </Grid.Col>
              <Grid.Col span={12} md={3}>
                <Text style={{ fontWeight: 600, padding: "4px 0" }}>
                  Realizado (último mês)
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  Fator de carga
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  Demanda Registrada
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  Consumo Registrado
                </Text>
                <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                  Fator de Potência
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
      {/* {idsMeters.length > 0 ? ( */}
      <>
        {/* <Grid className={classes.spaceTop}>
            <Grid.Col span={12} md={8}>
              <ConsumptionDistribution
                idsMeters={idsMeters}
                timeout={60000}
                heightCard={250}
              />
            </Grid.Col>
            <Grid.Col span={12} md={4}>
              <Live heightCard={250} consumoLive={consumoLive} />
            </Grid.Col>
          </Grid> */}
        <Grid className={classes.spaceTop}>
          <Grid.Col span={12}>
            <Card shadow="sm" p="lg" radius="md">
              <Grid className={classes.spaceTop}>
                <Grid.Col span={12} md={6} lg={8}>
                  <Title style={{ fontSize: 21, fontWeight: 700 }}>
                    Ganhos
                  </Title>
                </Grid.Col>
                <Grid.Col span={12} md={6} lg={4}>
                  <Group>
                    <Button
                      style={{
                        backgroundColor:
                          active !== "green" ? "#F9F9F9" : "#00AEA3",
                        color: active !== "green" ? "#B9B9B9" : "#FFFFFF",
                        borderRadius: 6,
                      }}
                      onClick={() => {
                        setActive("green");
                        setDataMock(greenData);
                      }}
                    >
                      Verde
                    </Button>
                    <Button
                      style={{
                        backgroundColor:
                          active !== "blue" ? "#F9F9F9" : "#00AEA3",
                        color: active !== "blue" ? "#B9B9B9" : "#FFFFFF",
                        borderRadius: 6,
                      }}
                      onClick={() => {
                        setActive("blue");
                        setDataMock(blueData);
                      }}
                    >
                      Azul
                    </Button>{" "}
                    <Button
                      style={{
                        backgroundColor:
                          active !== "ml" ? "#F9F9F9" : "#00AEA3",
                        color: active !== "ml" ? "#B9B9B9" : "#FFFFFF",
                        borderRadius: 6,
                      }}
                      onClick={() => {
                        setActive("ml");
                        setDataMock(mercadoLivreData);
                      }}
                    >
                      Mercado Livre
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>
              <Grid className={classes.spaceTop} grow>
                <Grid.Col span={4}>
                  <Text style={{ fontWeight: 600, padding: "4px 0" }}>
                    Atual
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Demanda...
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Consumo...
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text style={{ fontWeight: 600, padding: "4px 0" }}>
                    Projetado
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Demanda...
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Consumo...
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text style={{ fontWeight: 600, padding: "4px 0" }}>
                    Economia
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Demanda...
                  </Text>
                  <Text style={{ color: "#B9B9B9", padding: "4px 0" }}>
                    Consumo...
                  </Text>
                </Grid.Col>

                <Grid.Col span={6} md={3} lg={3}>
                  <Text>Total</Text>
                  <Grid.Col
                    className={classes.spaceTop}
                    span={12}
                    style={{
                      backgroundColor: "#EFFCFB",
                      padding: "15px 20px",
                      marginRight: 20,
                      borderRadius: 6,
                    }}
                  >
                    <Text className={classes.descriptionFont}>
                      R$ {dataMock.totalAtual}
                    </Text>
                  </Grid.Col>
                </Grid.Col>

                <Grid.Col span={0} md={5} lg={5}></Grid.Col>

                <Grid.Col span={6} md={4} lg={4}>
                  <Text>Total</Text>
                  <Grid.Col
                    className={classes.spaceTop}
                    span={12}
                    style={{
                      backgroundColor: "#EFFCFB",
                      padding: "15px 20px",
                      marginRight: 20,
                      borderRadius: 6,
                    }}
                  >
                    <Text className={classes.descriptionFont}>
                      R$ {dataMock.totalEconomia}
                    </Text>
                    <Text className={classes.descriptionFont}>
                      % {dataMock.totalEconomia}
                    </Text>
                  </Grid.Col>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid className={classes.spaceTop}>
          <Grid.Col span={12} md={12}>
            <Card shadow="sm" p="lg" radius="md">
              <Grid className={classes.spaceTop}>
                <Grid.Col span={12} md={12}>
                  <Title style={{ fontSize: 21, fontWeight: 700 }}>
                    Gráfico de Demanda
                  </Title>
                </Grid.Col>
                <Grid.Col>
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>KV</Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: 500, color: "#B0B0B0" }}
                  >
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "numeric",
                      year: "numeric",
                      month: "numeric",
                    })}
                  </Text>
                </Grid.Col>

                <Grid.Col style={{ height: 400, minWidth: 0 }}>
                  <ResponsiveBar
                    data={data.grafico}
                    tooltip={({ value }) => (
                      <div style={{ padding: "12px", background: "#ffffff" }}>
                        {value + " KV"}
                      </div>
                    )}
                    colors={["#00AEA3"]}
                    enableLabel={false}
                    borderRadius={5}
                    padding={0.15}
                    labelTextColor="#686868"
                    layout="vertical"
                    enableGridX={false}
                    axisRight={null}
                    theme={{
                      axis: {
                        ticks: {
                          line: {
                            margin: "4px",
                            strokeWidth: 0,
                          },
                          text: {
                            fill: "#B9B9B9",
                            fontWeight: 700,
                            fontFamily: "DM Sans, sans-serif",
                          },
                        },
                      },
                    }}
                    margin={{ top: 20, right: 15, bottom: 50, left: 30 }}
                  />
                </Grid.Col>

                <Grid.Col>
                  <Grid>
                    <Grid.Col span={12} md={8} lg={8}>
                      {" "}
                      <Text style={{ fontSize: 16, fontWeight: 700 }}>
                        Perfil de consumo semanal
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={12} md={4} lg={4}>
                      <Group position="apart">
                        <Text style={{ fontWeight: 700, color: "#B9B9B9" }}>
                          Semana do mês
                        </Text>
                        <Group>
                          <Button
                            style={{ backgroundColor: "#ffffff", padding: 0 }}
                            onClick={() => setWeekNumber(weekNumber - 1)}
                            disabled={weekNumber === 1}
                          >
                            {" "}
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="26"
                                height="26"
                                rx="13"
                                fill="#B9B9B9"
                              />
                              <path
                                d="M18.17 13.085H8M8 13.085L13.085 18.17M8 13.085L13.085 8"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                          <Text style={{ fontWeight: 500 }}>
                            Semana {weekNumber}
                          </Text>
                          <Button
                            style={{ backgroundColor: "#ffffff", padding: "0" }}
                            onClick={() => setWeekNumber(weekNumber + 1)}
                          >
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="26"
                                y="26"
                                width="26"
                                height="26"
                                rx="13"
                                transform="rotate(-180 26 26)"
                                fill="#B9B9B9"
                              />
                              <path
                                d="M7.83 12.915L18 12.915M18 12.915L12.915 7.83M18 12.915L12.915 18"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        </Group>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>

                <Grid.Col style={{ height: 400, minWidth: 0 }}>
                  <ResponsiveLine
                    data={responsiveLineData}
                    margin={{ top: 45, right: 100, bottom: 100, left: 35 }}
                    enableGridX={false}
                    enablePoints={false}
                    isInteractive
                    enableSlices="x"
                    axisLeft={{
                      tickSize: 0,
                      tickPadding: 5,
                      tickRotation: 0,
                      legendOffset: -40,
                      legendPosition: "middle",
                      minValue: 0, // Set the minimum value for y-axis to 0
                    }}
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 5,
                      tickPadding: 5,
                      legend: "",
                      legendOffset: 36,
                      legendPosition: "middle",
                      minValue: 0,
                    }}
                    useMesh
                    yFormat={(value) => value + "kWh"}
                    curve="basis"
                    legends={[
                      {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "square",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        onClick: (datum) => {
                          console.log(datum);
                        },
                      },
                    ]}
                  />
                </Grid.Col>

                <Grid.Col style={{ height: 400, minWidth: 0 }}>
                  <ResponsiveHeatMap
                    data={heatMapData}
                    indexBy="id"
                    margin={{ top: 24, right: 25, bottom: 32, left: 25 }}
                    axisTop={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      legend: "",
                      legendOffset: 36,
                    }}
                    tooltipFormat={(value) => <p>{value}</p>}
                    keys={keysHeatMap}
                    colors={[
                      "#d0f0c0",
                      "#98FB98",
                      "#fdfd96",
                      "#ffcc99",
                      "#ff6347",
                    ]}
                    emptyColor="#fff"
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
      </>
      {/* ) : null} */}
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
      color: "#00AEA3",
      fontWeight: "bold",
      fontSize: "18px",
    },
    defaultFont: {
      fontSize: "16px",
    },
    descriptionFont: {
      fontSize: "25px",
      color: "#00AEA3",
      fontWeight: "700",
      lineHeight: "36.46px",
    },
  };
});

export default AnaliseDeContrato;
