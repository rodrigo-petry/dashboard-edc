import { useEffect } from "react";
import { Button, Group, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";

import { Monitor } from "@core/domain/Monitors/Monitors.types";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";

export interface MonitorFormData {
  name: string;
  demandLimit: number;
  startRushHour?: Date;
  endRushHour?: Date;
}

interface MonitorDataFormProps {
  onSubmit: (values: MonitorFormData) => void;
  onCancel: () => void;
  loading: boolean;
  monitor?: Monitor;
}

function MonitorDataForm({
  onSubmit,
  onCancel,
  loading,
  monitor,
}: MonitorDataFormProps) {
  const form = useForm<MonitorFormData>({
    initialValues: {
      name: "",
      demandLimit: 0,
      startRushHour: new Date("2021-01-01T17:00:00"),
      endRushHour: new Date("2021-01-01T20:00:00"),
    },
    validationRules: {
      name: (name) => name?.length >= 3,
      demandLimit: (demandLimit) => demandLimit >= 0 && demandLimit <= 200000,
    },
  });

  useEffect(() => {
    if (monitor) {
      form.setFieldValue("name", monitor.name);
      form.setFieldValue("demandLimit", monitor.demandLimit);

      if (monitor.startRushHour)
        form.setFieldValue(
          "startRushHour",
          dayjs(
            `1970-01-01 ${monitor.startRushHour}`,
            "YYYY-MM-DD HH:mm:ss.SSS"
          ).toDate()
        );

      if (monitor.endRushHour)
        form.setFieldValue(
          "endRushHour",
          dayjs(
            `1970-01-01 ${monitor.endRushHour}`,
            "YYYY-MM-DD HH:mm:ss.SSS"
          ).toDate()
        );
    }
  }, [monitor]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Group grow direction="column">
        <TextInput
          required
          label="Nome"
          placeholder="Nome do monitor"
          value={form.values.name}
          onChange={({ target: { value } }) =>
            form.setFieldValue("name", value || "")
          }
          error={form.errors.name && "Preencha o valor corretamente"}
        />

        <NumberInput
          required
          label="Limite de demanda (kW)"
          placeholder="Limite de demanda"
          value={form.values.demandLimit}
          onChange={(value) => form.setFieldValue("demandLimit", value || 0)}
          error={form.errors.demandLimit && "Preencha o valor corretamente"}
        />

        <Group grow>
          <TimeInput
            label="Início do horário de pico"
            value={form.values.startRushHour}
            onChange={(value) => form.setFieldValue("startRushHour", value)}
            error={
              form.errors.startRushHour && "Preencha o horário corretamente"
            }
          />
          <TimeInput
            label="Fim do horário de pico"
            value={form.values.endRushHour}
            onChange={(value) => form.setFieldValue("endRushHour", value)}
            error={form.errors.endRushHour && "Preencha o horário corretamente"}
          />
        </Group>
      </Group>

      <Group position="right" mt="xl">
        <Button variant="default" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </Group>
    </form>
  );
}

export default MonitorDataForm;
