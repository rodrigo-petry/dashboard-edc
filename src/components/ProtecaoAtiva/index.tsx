import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Grid,
  Group,
  Text,
  Skeleton,
  Title,
  Button,
} from "@mantine/core";
import { useProfile } from "@core/domain/Dashboards/Dashboards.hooks";
import {
  getProfileMeasuresType,
  getProfileMeasuresTypeV3,
  getTimeConsumption,
} from "@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service";
import {
  IAnaliseDeConsumoGrafico,
  IAnaliseDeConsumoMedidorData,
} from "@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.types";
import moment from "moment";
import { getWeeksInMonth } from "@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.utils";
import BarChartComponent from "@components/Geral/BarChart";
import LineChartComponent from "@components/Geral/LineChartComponent";
import { DatePicker } from "@mantine/dates";
import debounce from "lodash/debounce";
import Papa from "papaparse"; // Import PapaParse
import { getDailyConsumption } from "@core/domain/Geral/Geral.service";
import { Monitor } from "@core/domain/Monitors/Monitors.types";
import "dayjs/locale/pt-br";
interface IProtecaoAtivaProps {
  idsMeters: Monitor[];
  principal: boolean;
}

const ProtecaoAtiva = ({
  idsMeters = [],
  principal = false,
}: IProtecaoAtivaProps) => {
  const default_cons = [
    {
      idMeter: 0,
      current_consumption: [{ id: "", value: 0, color: "" }],
      data: [
        {
          id: "Monday",
          data: [
            { x: "00h", y: 0 },
            { x: "01h", y: 0 },
          ],
        },
      ],
    },
  ];

  const { data: profileData } = useProfile();
  const [resultsToSet, setResults] = useState(default_cons);
  const [days, setDays] = useState<number>(0);
  const [date, setDate] = useState<Date>(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [nowStateDate, setNowStateDate] = useState<Date>(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(
    moment().isoWeek() - moment().startOf("month").isoWeek()
  );
  const [weeks, setWeeks] = useState<Date[][]>([]);

  const [apiArray, setAPIArray] = useState<IAnaliseDeConsumoMedidorData>();

  var get_date = new Date();
  var y = get_date.getUTCFullYear();
  var m = get_date.getUTCMonth();
  var firstDay = new Date(Date.UTC(y, m - 1, 1));
  var lastDay = new Date(Date.UTC(y, m, 0));

  const today_ = new Date();

  lastDay.setHours(23, 59, 59, 999);
  firstDay.setUTCHours(0, 0, 0, 0);

  const [valueStart, setValueStart] = useState<Date>(firstDay);
  const [valueEnd, setValueEnd] = useState<Date>(lastDay);

  const handleStartDateChange = (date: Date) => {
    const utcMidnight = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const newEndDate = valueEnd || new Date();
    const dateDiff =
      (newEndDate.getTime() - utcMidnight.getTime()) / (1000 * 3600 * 24);
    if (dateDiff > 30) {
      alert("Não poderá exceder 30 dias.");
    } else {
      setValueStart(utcMidnight);
    }
  };

  const handleEndDateChange = (date: Date) => {
    const utcEndOfDay = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    );
    const newStartDate = valueStart || new Date();
    const dateDiff =
      (utcEndOfDay.getTime() - newStartDate.getTime()) / (1000 * 3600 * 24);

    if (dateDiff > 30) {
      alert("Não poderá exceder 30 dias.");
    } else if (dateDiff < 0) {
      alert("Data final dever maior que data inicial.");
    } else {
      setValueEnd(utcEndOfDay);
    }
  };
  const obterDados = useCallback(
    debounce(async () => {
      if (!profileData || !profileData.length) {
        return;
      }
      const weeksArray = getWeeksInMonth(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );
      setWeeks(weeksArray);
      setLoading(true);
      const today = new Date();
      const priorDate = new Date(today.setDate(today.getDate() - days));

      const today_ = new Date();
      const now = new Date(
        today_.setDate(today_.getDate() - (days == 1 ? 0 : days))
      );
      now.setUTCHours(23, 59, 59, 999);
      priorDate.setUTCHours(0, 0, 0, 0);
      setNowStateDate(now);
      setDate(priorDate);
      const measuresType = await getProfileMeasuresTypeV3(profileData[0].id);

      setAPIArray(measuresType);
      const daysOfWeek = getWeeksInMonth(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      )[counter];

      const results = await Promise.all(
        idsMeters.map(async ({ meterId }) => {
          if (days === 7) {
            const data = await Promise.all(
              daysOfWeek.map(async (day) => {
                const consumption = await getTimeConsumption(
                  [meterId],
                  new Date(day.setUTCHours(0, 0, 0, 0)),
                  new Date(day.setUTCHours(23, 59, 59, 0))
                );
                return {
                  id: day.toLocaleDateString("pt-br", { weekday: "long" }),
                  data: consumption.map((e: IAnaliseDeConsumoGrafico) => ({
                    x: e.id,
                    y: e.value,
                  })),
                };
              })
            );
            return {
              idMeter: meterId,
              data: data,
              current_consumption: [{ id: "", value: 0, color: "" }],
            };
          }

          if (days === 30) {
            const consumption_custom = await getDailyConsumption(
              [meterId],
              valueStart,
              valueEnd
            );
            return {
              idMeter: meterId,
              data: [{ id: "", data: [{ x: "", y: 0 }] }],
              current_consumption: consumption_custom,
            };
          }

          const consumption_out = await getTimeConsumption(
            [meterId],
            days === 30 ? valueStart : priorDate,
            days === 30 ? valueEnd : now
          );
          return {
            idMeter: meterId,
            data: [{ id: "", data: [{ x: "", y: 0 }] }],
            current_consumption: consumption_out,
          };
        })
      );

      setResults(results);
      setLoading(false);
    }, 300),
    [profileData, days, valueStart, valueEnd]
  );

  useEffect(() => {
    profileData &&
      getProfileMeasuresType(profileData[0].id).then((e) => setAPIArray(e));
  }, [profileData]);

  const incrementar = useCallback(async () => {
    if (counter < moment().isoWeek() - moment().startOf("month").isoWeek()) {
      setCounter((prev) => prev + 1);
    }
  }, [counter]);

  const decrementar = useCallback(async () => {
    if (counter > 0) {
      setCounter((prev) => prev - 1);
    }
  }, [counter]);

  useEffect(() => {
    if (profileData && profileData[0].id) {
      obterDados();
    }
  }, [obterDados, counter]);

  const setDaysAndLoad = (day: number) => {
    setDays(day);
  };

  const exportToCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    const dataToExport = resultsToSet.map((result) => {
      if (days === 7) {
        const rowData = { idMeter: result.idMeter };
        result.data.forEach((d) => {
          d.data.forEach((item) => {
            rowData[item.x] = item.y;
          });
        });
        return rowData;
      } else {
        const rowData = { idMeter: result.idMeter };
        result.current_consumption.forEach((consumption) => {
          rowData[consumption.id] = consumption.value;
        });
        return rowData;
      }
    });
    exportToCSV(dataToExport, `dados.csv`);
  };
  return (
    <Skeleton visible={false}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Grid
          className="mantine-Group-root mantine-Title-root mantine-5bhg3d"
          style={{
            fontSize: "17px",
            marginLeft: "7px",
            marginBottom: "10px",
            color: "#000000",
          }}
        >
          <Grid.Col>
            <Grid>
              <Grid.Col span={3}>
                <Group>
                  <Title
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 21,
                      fontWeight: 700,
                    }}
                  >
                    Consumo {principal ? "Principal" : "Setorizado"}
                  </Title>
                </Group>
              </Grid.Col>
              <Grid.Col span={1} offset={3} style={{ marginRight: 30 }}>
                <Button
                  style={{
                    width: 103,
                    height: 30,
                    backgroundColor: days === 0 ? "#00AEA3" : "#F9F9F9",
                    color: days === 0 ? "#fff" : "#B9B9B9",
                  }}
                  onClick={() => {
                    setDaysAndLoad(0);
                  }}
                >
                  <Text fontSize="xs">Hoje</Text>
                </Button>
              </Grid.Col>
              <Grid.Col span={1} style={{ marginRight: 30 }}>
                <Button
                  style={{
                    width: 103,
                    height: 30,
                    backgroundColor: days === 1 ? "#00AEA3" : "#F9F9F9",
                    color: days === 1 ? "#fff" : "#B9B9B9",
                  }}
                  onClick={() => {
                    setDaysAndLoad(1);
                  }}
                >
                  <Text fontSize="xs">Ontem</Text>
                </Button>
              </Grid.Col>
              <Grid.Col span={1} style={{ marginRight: 30 }}>
                <Button
                  style={{
                    width: 103,
                    height: 30,
                    backgroundColor: days === 7 ? "#00AEA3" : "#F9F9F9",
                    color: days === 7 ? "#fff" : "#B9B9B9",
                  }}
                  onClick={() => {
                    setDaysAndLoad(7);
                  }}
                >
                  <Text fontSize="xs">7 Dias</Text>
                </Button>
              </Grid.Col>
              <Grid.Col span={1} style={{ marginRight: 10 }}>
                <Button
                  style={{
                    width: 154,
                    height: 30,
                    backgroundColor: days === 30 ? "#00AEA3" : "#F9F9F9",
                    color: days === 30 ? "#fff" : "#B9B9B9",
                  }}
                  onClick={() => {
                    setDaysAndLoad(30);
                  }}
                >
                  <Text fontSize="xs">Personalizado</Text>
                </Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          {days === 30 && (
            <>
              <Grid.Col offset={6}></Grid.Col>
              <Grid.Col offset={6} span={3}>
                <DatePicker
                  value={valueStart}
                  locale="pt-br"
                  onChange={handleStartDateChange}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePicker
                  value={valueEnd}
                  locale="pt-br"
                  onChange={handleEndDateChange}
                />
              </Grid.Col>
            </>
          )}
          {days === 7 && (
            <>
              <Grid.Col offset={6}></Grid.Col>
              <Grid.Col offset={8}>
                <Group>
                  {counter > 0 ? (
                    <Button
                      onClick={decrementar}
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="26" height="26" rx="13" fill="#B9B9B9" />
                        <path
                          d="M18.17 13.085H8M8 13.085L13.085 18.17M8 13.085L13.085 8"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  ) : (
                    <div style={{ width: 26, height: 26 }}> </div>
                  )}
                  <Text style={{ fontWeight: 500, fontSize: 16 }}>
                    {weeks[counter] && weeks[counter].length === 7
                      ? `${weeks[counter][0].toLocaleDateString(
                          "pt-br"
                        )} até ${weeks[counter][
                          weeks[counter].length - 1
                        ].toLocaleDateString("pt-br")}`
                      : ""}
                  </Text>
                  {counter <
                  moment().isoWeek() - moment().startOf("month").isoWeek() ? (
                    <Button
                      onClick={incrementar}
                      style={{ backgroundColor: "#ffffff" }}
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
                  ) : (
                    <div style={{ width: 26, height: 26 }}> </div>
                  )}
                </Group>
              </Grid.Col>{" "}
            </>
          )}
          <Grid.Col>
            <Button onClick={handleExport}>Exportar </Button>{" "}
          </Grid.Col>
        </Grid>
        {apiArray &&
          apiArray.general.length &&
          idsMeters
            .filter((e) =>
              principal
                ? apiArray.general
                    .map((e) => e.id)
                    .includes(e.meterId.toString())
                : !apiArray.general
                    .map((e) => e.id)
                    .includes(e.meterId.toString())
            )
            .map(({ meterId, name }, i) => (
              <div key={i} style={{ height: 250, marginTop: 40 }}>
                <Text>
                  {!name.match(/\d+/g) && "ID " + meterId} {name}
                  {apiArray && apiArray.general && apiArray.general.length > 0
                    ? apiArray.general.filter((e) => e.id == meterId.toString())
                        .length > 0
                      ? " - Principal"
                      : " - Setor"
                    : ""}
                </Text>

                {days === 7 ? (
                  loading ? (
                    <Text style={{ fontSize: 10 }}>Carregando...</Text>
                  ) : (
                    <>
                      {" "}
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#B9B9B9",
                        }}
                      >
                        {" "}
                        {`${weeks[counter][0].toLocaleDateString(
                          "pt-br"
                        )} - ${weeks[counter][
                          weeks[counter].length - 1
                        ].toLocaleDateString("pt-br")}`}{" "}
                      </Text>{" "}
                      <LineChartComponent
                        data={
                          resultsToSet[i] && resultsToSet[i].data
                            ? resultsToSet[i].data
                            : []
                        }
                      />{" "}
                    </>
                  )
                ) : loading ? (
                  <Text style={{ fontSize: 10 }}>Carregando...</Text>
                ) : (
                  <>
                    {" "}
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#B9B9B9",
                      }}
                    >
                      {days == 0
                        ? `${date.toLocaleDateString("pt-br")}`
                        : days == 30
                        ? `${valueStart.toLocaleDateString(
                            "pt-br"
                          )} - ${valueEnd.toLocaleDateString("pt-br")}`
                        : `${date.toLocaleDateString(
                            "pt-br"
                          )} - ${nowStateDate.toLocaleDateString(
                            "pt-br"
                          )}`}{" "}
                    </Text>{" "}
                    <BarChartComponent
                      rotate={days == 30}
                      data={
                        resultsToSet[i] && resultsToSet[i].current_consumption
                          ? resultsToSet[i].current_consumption
                          : []
                      }
                    />
                  </>
                )}
              </div>
            ))}
      </Card>
    </Skeleton>
  );
};

export default ProtecaoAtiva;
