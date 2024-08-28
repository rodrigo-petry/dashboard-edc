export interface MonitorLiveData {
  id: string;
  nome: string;
  ligado: boolean;
  status: string;
  watts_mensal: number;
  watts_semanal: number;
  meta_mensal: number;
  meta_semanal: number;
}

export interface CurrentConsumption {
  consumo: number;
  media_consumo: number;
}

export interface Goals {
  data: {
    monetario: {
      diario: number;
      semanal: number;
      mensal: number;
    };
    consumo: {
      diario: number;
      semanal: number;
      mensal: number;
    };
    dia_de_fechamento: string;
    fechamento: string;
    total_mes_anterior_kwh: number;
    total_mes_anterior_brl: number;
  };
}
