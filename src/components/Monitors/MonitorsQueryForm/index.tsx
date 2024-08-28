import { Dispatch, SetStateAction } from "react";
import { Group } from "@mantine/core";
import { FaCalendar } from "react-icons/fa";

import { MonitorsQuery } from "@core/domain/Monitors/Monitors.types";

import DatePicker from "@components/_shared/DatePicker";

interface MonitorsQueryFormProps {
  queryParams?: MonitorsQuery;
  setQueryParams: Dispatch<SetStateAction<MonitorsQuery | undefined>>;
}

function MonitorsQueryForm({
  queryParams,
  setQueryParams,
}: MonitorsQueryFormProps) {
  return (
    <Group>
      <DatePicker
        label="Início"
        icon={<FaCalendar />}
        placeholder="Selecione uma data"
        value={queryParams?.startDate as Date | undefined}
        onChange={(value) => {
          setQueryParams({
            ...queryParams,
            startDate: value as Date | undefined,
          });
        }}
      />
      <DatePicker
        label="Fim"
        icon={<FaCalendar />}
        placeholder="Selecione uma data"
        value={queryParams?.endDate as Date | undefined}
        onChange={(value) => {
          setQueryParams({
            ...queryParams,
            endDate: value as Date | undefined,
          });
        }}
      />
    </Group>
  );
}

export default MonitorsQueryForm;
