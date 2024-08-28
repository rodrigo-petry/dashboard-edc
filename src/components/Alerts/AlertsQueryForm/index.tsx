import { Dispatch, SetStateAction } from "react";
import { Group, TextInput } from "@mantine/core";
import { FaSearch } from "react-icons/fa";

import { AlertsQuery } from "@core/domain/Alerts/Alerts.types";

interface AlertsQueryFormProps {
  queryParams?: AlertsQuery;
  setQueryParams: Dispatch<SetStateAction<AlertsQuery | undefined>>;
}

function AlertsQueryForm({
  queryParams,
  setQueryParams,
}: AlertsQueryFormProps) {
  return (
    <Group>
      <TextInput
        label="Pesquisa"
        icon={<FaSearch />}
        placeholder="Informe sua busca"
        value={queryParams?.search || ""}
        onChange={(event) =>
          setQueryParams((prev) => ({
            ...prev,
            search: event.target.value,
          }))
        }
      />
    </Group>
  );
}

export default AlertsQueryForm;
