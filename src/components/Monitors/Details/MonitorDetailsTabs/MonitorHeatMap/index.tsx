import { useState } from "react";
import dayjs from "dayjs";
import { ResponsiveHeatMap } from "@nivo/heatmap";

import { Monitor } from "@core/domain/Monitors/Monitors.types";
import { useConsumptionBehavior } from "@core/domain/Dashboards/Dashboards.hooks";
import { GetConsumptionBehaviorRequest } from "@core/domain/Dashboards/Dashboards.types";
import {
  transformConsumptionBehaviorToHeatMapChartData,
  formatHeatMapFinal,
} from "@core/domain/Dashboards/Dashboards.utils";

import HeatMapQueryModal from "./HeatMapQueryModal";
import { Button, Group, Skeleton } from "@mantine/core";
import { FaSlidersH } from "react-icons/fa";
import { metricPrefixFormatter } from "@utils/metricPrefix";

interface MonitorHeatMapProps {
  meter?: Monitor;
}

function MonitorHeatMap({ meter }: MonitorHeatMapProps) {
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [data, setData] = useState<any>([]);

  const [queryParams, setQueryParams] = useState<GetConsumptionBehaviorRequest>(
    {
      meterId: meter?.meterId,
      startDate: dayjs()
        .add(-6, "day")
        .startOf("day")
        .toISOString()
        .replace("T03", "T00"),
      endDate: dayjs().endOf("day").toISOString(),
    }
  );

  const { data: result, isFetching } = useConsumptionBehavior(queryParams);

  const chartData = transformConsumptionBehaviorToHeatMapChartData(result);
  let mapaDeCalor: Array<any> = formatHeatMapFinal(chartData);
  console.log(mapaDeCalor);
  if (mapaDeCalor[1]) {
    let unidadeEmKw = mapaDeCalor[1];
  }

  const handleQueryModalClose = () => {
    setQueryModalOpen(false);
  };

  return (
    <>
      <Skeleton visible={isFetching} mt="sm">
        <Group></Group>
        <div style={{ height: "300px" }}>
          {result?.consumptionBehavior &&
          result.consumptionBehavior.length > 0 ? (
            <ResponsiveHeatMap
              data={mapaDeCalor[0]}
              indexBy="dayOfWeek"
              margin={{ top: 24, right: 60, bottom: 32, left: 60 }}
              axisTop={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                legend: "",
                legendOffset: 36,
              }}
              label={(datum, key) =>
                datum[key] < 0 || datum[key] == null
                  ? ""
                  : `${metricPrefixFormatter((datum[key] / 1000) as number)}`
              }
              tooltipFormat={(value) =>
                value < 0 || value == null
                  ? "X"
                  : `${metricPrefixFormatter((value / 100) as number)}kWh`
              }
              keys={[
                "00h",
                "01h",
                "02h",
                "03h",
                "04h",
                "05h",
                "06h",
                "07h",
                "08h",
                "09h",
                "10h",
                "11h",
                "12h",
                "13h",
                "14h",
                "15h",
                "16h",
                "17h",
                "18h",
                "19h",
                "20h",
                "21h",
                "22h",
                "23h",
              ]}
              colors={["#d0f0c0", "#98FB98", "#fdfd96", "#ffcc99", "#ff6347"]}
              emptyColor="#999"
            />
          ) : (
            "Não há dados!"
          )}
        </div>
      </Skeleton>
      <HeatMapQueryModal
        opened={queryModalOpen}
        onClose={handleQueryModalClose}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </>
  );
}

export default MonitorHeatMap;
