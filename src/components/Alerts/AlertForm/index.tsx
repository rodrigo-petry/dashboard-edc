import { useEffect, useState } from "react";
import {
  Button,
  MultiSelect,
  Select,
  NumberInput,
  Space,
  TextInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";

import { useMonitors } from "@core/domain/Monitors/Monitors.hooks";
import {
  PARAMETERS,
  Alert,
  NOTIFICATION_DESTINATIONS,
  PARAMETERS_BASIC
} from "@core/domain/Alerts/Alerts.types";
import {listMonitorsNovoSmart} from '@core/domain/Geral/Geral.service'

export interface AlertFormData {
  name: string;
  minValue: number;
  maxValue: number;
  parameter: string;
  meterId: string;
  notificationDestinations: string[];
}

const minValueRule = (value: number, values?: AlertFormData): boolean => {
  const parameter = values?.parameter;

  if (!parameter) return false;

  switch (parameter) {
    case PARAMETERS[0].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[1].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[2].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[3].value:
      return value >= 0 && value <= 2000;
    case PARAMETERS[4].value:
      return value >= 0 && value <= 270;
    case PARAMETERS[5].value:
      return value >= 55 && value <= 65;
    case PARAMETERS[6].value:
      return value >= -1 && value <= 1;
    case PARAMETERS[7].value:
      return value >= -10 && value <= 50;
    case PARAMETERS[8].value:
      return value >= 0 && value <= 100;
    default:
      return false;
  }
};

const maxValueRule = (value: number, values?: AlertFormData): boolean => {
  const parameter = values?.parameter;

  if (!parameter) return false;

  if (value < values.minValue) return false;

  switch (parameter) {
    case PARAMETERS[0].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[1].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[2].value:
      return value >= 0 && value <= 200000;
    case PARAMETERS[3].value:
      return value >= 0 && value <= 2000;
    case PARAMETERS[4].value:
      return value >= 0 && value <= 270;
    case PARAMETERS[5].value:
      return value >= 55 && value <= 65;
    case PARAMETERS[6].value:
      return value >= -1 && value <= 1;
    case PARAMETERS[7].value:
      return value >= -10 && value <= 50;
    case PARAMETERS[8].value:
      return value >= 0 && value <= 100;
    default:
      return false;
  }
};

interface AlertFormProps {
  onSubmit: (values: AlertFormData) => void;
  onCancel: () => void;
  loading: boolean;
  submitLabel?: string;
  alert?: Alert;
}

function AlertForm({
  onSubmit,
  onCancel,
  alert,
  loading,
  submitLabel = "Cadastrar",
}: AlertFormProps) {
  const form = useForm<AlertFormData>({
    initialValues: {
      name: "",
      minValue: 0,
      maxValue: 0,
      parameter: "",
      meterId: "",
      notificationDestinations: [],
    },

    validationRules: {
      name: (name) => name?.length > 3,
      minValue: minValueRule,
      maxValue: maxValueRule,
      parameter: (parameter) => parameter !== "",
      meterId: (meterId) => meterId !== "",
      notificationDestinations: (notificationDestinations) =>
        !!notificationDestinations.length,
    },
  });

  const [medidoresBasicos, setMedidoresBasicos] = useState<Array<any>>([]);
  const [mostrarSomenteDadosBasicos, setMostrarSomenteDadosBasicos] = useState<boolean>(true);
  const { data: monitors } = useMonitors();

  useEffect(() => {
    getNovoSmart(alert?.meter?.id || null);
    if (alert && monitors?.length) {
      form.setFieldValue("name", alert.name);
      form.setFieldValue("parameter", alert.parameter.toString());
      form.setFieldValue("minValue", alert.minValue);
      form.setFieldValue("maxValue", alert.maxValue);
      form.setFieldValue("meterId", alert.meter.id.toString());
      form.setFieldValue(
        "notificationDestinations",
        alert.notificationDestinations?.map((item) => item.toString()) || []
      );
    }
  }, [alert, monitors]);

  async function  getNovoSmart(medidorId: any)
  {
     const medidoresNovoSmart = await listMonitorsNovoSmart();
     setMedidoresBasicos(medidoresNovoSmart);

     if(medidorId) {
        setMostrarSomenteDadosBasicos(medidoresNovoSmart.includes(parseFloat(medidorId)));
     }
  }

  async function showBasicData(medidorId:any)
  {
    setMostrarSomenteDadosBasicos(medidoresBasicos.includes(parseFloat(medidorId)));
  }

  const loadTypeAlert = (value:any) => {
      showBasicData(value)
  };

  const handleParameterChange = (value: string) => {
    form.setFieldValue("parameter", value || "");

    switch (value) {
      case PARAMETERS[0].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 200000);
        break;
      case PARAMETERS[1].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 200000);
        break;
      case PARAMETERS[2].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 200000);
        break;
      case PARAMETERS[3].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 2000);
        break;
      case PARAMETERS[4].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 270);
        break;
      case PARAMETERS[5].value:
        form.setFieldValue("minValue", 55);
        form.setFieldValue("maxValue", 65);
        break;
      case PARAMETERS[6].value:
        form.setFieldValue("minValue", -1);
        form.setFieldValue("maxValue", 1);
        break;
      case PARAMETERS[7].value:
        form.setFieldValue("minValue", -10);
        form.setFieldValue("maxValue", 50);
        break;
      case PARAMETERS[8].value:
        form.setFieldValue("minValue", 0);
        form.setFieldValue("maxValue", 100);
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Group grow direction="column">
        <TextInput
          required
          placeholder="Nome do alerta"
          label="Nome"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
          error={form.errors.name && "Preencha o nome corretamente."}
        />

        <Select
          required
          label="Monitor"
          placeholder="Monitor a ser observado"
          value={form.values.meterId}
          onChange={(event) => {
            loadTypeAlert(event)
            form.setFieldValue("meterId", event || "")
          }}
          data={
            monitors?.map((monitor) => ({
              value: monitor.meterId.toString(),
              label: monitor.name || monitor.meterId.toString(),
            })) || []
          }
          error={form.errors.meterId && "Selecione um monitor."}
        />

        <Select
          required
          label="Parâmetro"
          placeholder="Parâmetro a ser observado"
          value={form.values.parameter}
          onChange={handleParameterChange}
          data={mostrarSomenteDadosBasicos ? PARAMETERS_BASIC : PARAMETERS}
          error={form.errors.parameter && "Selecione um parâmetro."}
        />

        <div style={{ display: "flex" }}>
          <NumberInput
            required
            label="Valor mínimo"
            value={form.values.minValue}
            onChange={(event) => form.setFieldValue("minValue", event || 0)}
            error={
              form.errors.minValue && "Preencha o valor mínimo corretamente."
            }
          />

          <Space w="sm" />

          <NumberInput
            required
            label="Valor máximo"
            value={form.values.maxValue}
            onChange={(event) => form.setFieldValue("maxValue", event || 0)}
            error={
              form.errors.maxValue && "Preencha o valor máximo corretamente."
            }
          />
        </div>

        <MultiSelect
          required
          label="Destino da notificação"
          placeholder="Escolha o destino da sua notificação"
          data={NOTIFICATION_DESTINATIONS}
          value={form.values.notificationDestinations}
          onChange={(event) =>
            form.setFieldValue("notificationDestinations", event)
          }
          error={
            form.errors.notificationDestinations &&
            "Selecione pelo menos um tipo de notificação."
          }
        />

        <Group position="right" mt="xl">
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </Group>
      </Group>
    </form>
  );
}

export default AlertForm;
