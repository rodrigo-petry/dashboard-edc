export const GROUP_TYPES = [
  {
    label: "Tempo Real",
    value: 0,
  },
  {
    label: "5 minutos",
    value: 1,
  },
  {
    label: "15 minutos",
    value: 2,
  },
  {
    label: "Hora",
    value: 3,
  },
  {
    label: "Dia",
    value: 4,
  },
  {
    label: "Mês",
    value: 5,
  },
];

export const MEDITION_TYPES = [
  {
    label: "Fator de Potência",
    enumValue: "powerFactor",
    value: 0,
  },
  {
    label: "Potência Ativa",
    enumValue: "activePowerData",
    value: 1,
  },
  {
    label: "Potência Aparente",
    enumValue: "apparentPower",
    value: 2,
  },
  {
    label: "Potência Reativa",
    enumValue: "reactivePower",
    value: 3,
  },
  {
    label: "Corrente",
    enumValue: "current",
    value: 4,
  },
  {
    label: "Tensão",
    enumValue: "tension",
    value: 5,
  },
];

export const MEDITION_TYPES_BASIC = [
  {
    label: "Corrente",
    enumValue: "current",
    value: 4,
  },
];

export interface Measurement {
  phase1: number;
  phase2: number;
  phase3: number;
  total: number;
}

export interface ConsumptionItem {
  [key: string]: string | Measurement;
  referenceDate: string;
  activePowerData: Measurement;
  apparentPower: Measurement;
  reactivePower: Measurement;
  powerFactor: Measurement;
  current: Measurement;
  tension: Measurement;
}

export interface Consumption {
  items: ConsumptionItem[];
}

export interface GetConsumptionRequest {
  startDate?: string;
  endDate?: string;
  meterId?: number;
  parameters: number;
  groupType: number;
}

export interface GetConsumptionHCRequest {
  data_inicial?: string;
  data_final?: string;
}
export interface WeekDates {
  start: Date;
  end: Date;
}

export interface ConsumptionBehavior {
  consumptionBehavior: {
    dayOfWeek: number;
    consumptionRelation: {
      consumption: number;
      hour: number;
    }[];
  }[];
}

export interface GetConsumptionBehaviorRequest {
  startDate?: string;
  endDate?: string;
  meterId?: number;
}

export interface MultiMonitor {
  meterId: number;
  name: string;
  items: ConsumptionItem[];
}

export interface MultiMonitors {
  items: MultiMonitor[];
}

export interface GetMultiMonitorRequest {
  startDate?: string;
  endDate?: string;
  meterIds?: number[];
  parameters: number;
  groupType: number;
  group: string;
  startHour: string,
  endHour: string
}

export interface ReportRequest {
  idProfile?: number;
  granularidade: string[];
  de?: string;
  para?: string;
  dados: {
    media: boolean;
    potencia_ativa: boolean;
    potencia_aparente: boolean;
    fator_potencia: boolean;
    potencia_fase: boolean;
    corrente_fase: boolean;
    tensao_fase: boolean;
    potencia_reativa_total : boolean,
    potencia_reativa_fases : boolean, 
    potencia_aparente_fases : boolean, 
    fator_potencia_fases : boolean, 
    frequencia_fases : boolean
  };
}

export interface Profile {
  id: number;
  perfil: string;
  status_contrato: string;
  id_status_contrato: string;
  url_pagamento: string;
  type: string;
  features: unknown[];
}




export interface User {
  id: string;
  nome: string;
  documento: string;
  uf: string;
  municipio: string;
  cep: string;
  endereco: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  genero: string;
  escolaridade: string;
  renda_familiar: number;
  quantidade_moradores: number;
  quantidade_de_chuveiros: number;
  municipio_id: number;
  genero_id: number;
  escolaridade_id: number;
}

