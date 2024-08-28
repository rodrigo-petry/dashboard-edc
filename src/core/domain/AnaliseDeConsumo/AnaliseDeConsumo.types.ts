
export interface IAnaliseDeConsumoMedidor {
    id: string;
    nome: string;
    watts: number;
    watts_max: number;
    total_mes: number;
    kwh_mes: number;
    kwh_max: number;
    ligado: boolean;
    status: string;
    tipo_de_medidor_id: number;
    tipo_de_medidor: string;
    setores: null | IAnaliseDeConsumoMedidor[]
  }


 


  export interface IAnaliseDeConsumoMedidorData {
    general: IAnaliseDeConsumoMedidor[];
    setores: IAnaliseDeConsumoMedidor[];
  }
  export interface IAnaliseDeConsumoFechamento {
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
  }
  
  export interface IAnaliseDeConsumoFechamentoRootObject {
    data: IAnaliseDeConsumoFechamento
  }
  
  export interface IAnaliseDeConsumoMonthlyProjectionItem {
    intervalo: string;
    valor: number;
    consumo: number;
    projecao: boolean;
  }
  
  
  
  export interface IAnaliseDeConsumoMonthlyProjection {
    kwh_anterior: number;
    kwh_registrado: number;
    kwh_previsto: number;
    kwh_total: number;
    custo_total: number;
    items: IAnaliseDeConsumoMonthlyProjectionItem[];
  }
  
  export interface IAnaliseDeConsumoTemperaturaMedicao {
    temperatura: number;
    umidade: number;
    data_de_medicao: string;
  }
  
  
  export interface IAnaliseDeConsumoTemperatureMonthlyProjection {
    dispositivo_id: string;
    descricao_dispositivo: string;
    medicoes: IAnaliseDeConsumoTemperaturaMedicao[];
  }
  
  export interface IAnaliseDeConsumoCardinal{
     x: string,
     y: number
  }
  
  export interface IAnaliseDeConsumoCardinalWithID {
    id: string;
    data: IAnaliseDeConsumoCardinal[];
  }
  
  export interface IAnaliseDeConsumoTemperatureMonthlyProjectionReturn {
    dispositivo_id: string;
    descricao_dispositivo: string;
    grafico: IAnaliseDeConsumoCardinal[];
  }
  
  
  export interface IAnaliseDeConsumoGrafico {
    id: string,
    value: number,
    color: string,
  }
  
  export interface IAnaliseDeConsumoItem {
    intervalo: string;
    valor: number;
  }
  