import { PagedQueryBase } from '@core/request/net/PagedQueryBase'

export const NOTIFICATION_DESTINATIONS = [
  {
    value: '0',
    label: 'Dashboard'
  },
  {
    value: '1',
    label: 'Aplicativo'
  },
/*  {
    value: '2',
    label: 'WhatsApp'
  },
  {
    value: '3',
    label: 'E-mail'
  },
  {
    value: '4',
    label: 'SMS'
  }
*/
]

export const PARAMETERS = [
  {
    value: '0',
    label: 'Potência Ativa'
  },
  {
    value: '1',
    label: 'Potência Reativa'
  },
  {
    value: '2',
    label: 'Potência Aparente'
  },
  {
    value: '3',
    label: 'Corrente'
  },
  {
    value: '4',
    label: 'Tensão'
  },
  {
    value: '5',
    label: 'Frequência'
  },
  {
    value: '6',
    label: 'Fator de Potência'
  },
  {
    value: '7',
    label: 'Temperatura'
  },
  {
    value: '8',
    label: 'Umidade'
  }
]

export const PARAMETERS_BASIC = [
  {
    value: '3',
    label: 'Corrente'
  },
 
]

interface Meter {
  id: number
  name: string
}

export interface Alert {
  id: number
  name: string
  meter: Meter
  parameter: number
  minValue: number
  maxValue: number
  notificationDestinations: number[]
}

export interface AlertHistory {
  Id: string | null;
  alert_id: string | null;
  client_id: string | null;
  conteudo: string | null;
  medicao_id: string | null;
  visualizada: string | null;
  data_e_hora_de_envio: string | null;
  parametro: string | null;
  valor_maximo: string | null;
  valor_minimo: string | null;
  valor_referencia: string | null;
  medidor_id: string | null;
  Nome: string | null;
  notification_destination: string | null;
  notificationDestinations: NotificationDestination[] | null;
}

export interface NotificationDestination {
  Id: string;
  alert_id: string;
  notification_destination: string;
}


export interface AlertsQuery extends PagedQueryBase {
  search?: string
  meterId?: number
  clientId?: number
}

export interface CreateAlertRequest {
  name: string
  minValue: number
  maxValue: number
  parameter: number
  notificationDestinations: number[]
  meterId: number
}

export interface UpdateAlertRequest {
  id: number
  name: string
  minValue: number
  maxValue: number
  parameter: number
  notificationDestinations: number[]
  meterId: number
}
