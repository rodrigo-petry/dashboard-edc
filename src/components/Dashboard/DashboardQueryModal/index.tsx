import { GetConsumptionRequest } from "@core/domain/Dashboards/Dashboards.types";
import { Button, Group, Modal } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import DashboardQueryForm from "../DashboardQueryForm";

interface DashboardQueryModalProps {
  opened: boolean;
  onClose: () => void;
  queryParams: GetConsumptionRequest;
  setQueryParams: Dispatch<SetStateAction<GetConsumptionRequest>>;
}

function DashboardQueryModal({
  opened,
  onClose,
  queryParams,
  setQueryParams,
}: DashboardQueryModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Filtrar dados">
      <Group spacing="xl" grow direction="column">
        <DashboardQueryForm
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
        <Group position="right" mt="sm">
          <Button onClick={onClose}>OK</Button>
        </Group>
      </Group>
    </Modal>
  );
}

export default DashboardQueryModal;
