import { Dispatch, SetStateAction } from "react";
import { Button, Group, Modal } from "@mantine/core";

import { GetConsumptionBehaviorRequest } from "@core/domain/Dashboards/Dashboards.types";
import { DatePicker } from "@mantine/dates";
import { FaCalendar } from "react-icons/fa";
import dayjs from "dayjs";

interface HeatMapQueryModalProps {
  opened: boolean;
  onClose: () => void;
  queryParams: GetConsumptionBehaviorRequest;
  setQueryParams: Dispatch<SetStateAction<GetConsumptionBehaviorRequest>>;
}

function HeatMapQueryModal({
  opened,
  onClose,
  queryParams,
  setQueryParams,
}: HeatMapQueryModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Filtrar dados">
      <Group spacing="xl" grow direction="column">
        <Group grow>
          <DatePicker
            label="Início"
            icon={<FaCalendar />}
            placeholder="Selecione uma data"
            value={
              queryParams?.startDate
                ? dayjs(queryParams?.startDate).toDate()
                : undefined
            }
            onChange={(value) => {
              setQueryParams({
                ...queryParams,
                startDate: value?.toISOString(),
                endDate: undefined,
              });
            }}
          />
          <DatePicker
            label="Fim"
            icon={<FaCalendar />}
            excludeDate={(date) => {
              const currentDjs = dayjs(date);
              const startDjs = dayjs(queryParams.startDate);

              return (
                currentDjs.isBefore(startDjs) ||
                currentDjs.isAfter(startDjs.add(31, "days"))
              );
            }}
            placeholder="Selecione uma data"
            value={
              queryParams?.endDate
                ? dayjs(queryParams?.endDate).toDate()
                : undefined
            }
            onChange={(value) => {
              setQueryParams({
                ...queryParams,
                endDate: value?.toISOString(),
              });
            }}
          />
        </Group>
        <Group position="right" mt="sm">
          <Button onClick={onClose}>OK</Button>
        </Group>
      </Group>
    </Modal>
  );
}

export default HeatMapQueryModal;
