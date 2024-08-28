import { hcApi, netApi } from '@api'
import { listMonitors } from '@core/domain/Monitors/Monitors.service'
import { red } from '../../../../node_modules_T8/ansi-colors/types'


export async function getPowerLive(idsMeters: Array<string|number>|null) {

  let qs = idsMeters?.map(item => `${item}`)

  if(qs) {
    const result = await hcApi.get<any>(
      `v3/dashboard/potencia-live?medidores_ids=${qs?.join(',')}`
    )

    return result.data
  }  
}

export async function getConsumptionRange(idMeter: string|number|null) {

  if(idMeter) {
    const result = await hcApi.get<any>(
      `v3/dashboard/medicoes-faixa/${idMeter}`
    )

    return result.data
  }  
}

export async function getMedidorLiveData(idMeter: string|number|null) {

  if(idMeter) {
    const result = await hcApi.get<any>(
      `v3/medidor/${idMeter}/live`
    )

    return result.data
  }  
}

export async function getCarbonEmission(
    idsMeters: Array<string|number>|null,
    initialDate: string,
    finalDate: string
  ) {

  let qs = idsMeters?.map(item => `${item}`)


  if(qs) {
    const result = await hcApi.get<any>(
      `v3/dashboard/emissao-de-carbono?medidores_ids=${qs?.join(',')}&data_inicial=${initialDate}&data_final=${finalDate}`
    )

    return result.data
  }  
}


export async function getMonitorInfo() {

  const data  = await listMonitors()
  const idsMeters = data?.map(item => (
    item.meterId
  )) || [];
  let id = idsMeters[0] ? idsMeters[0] : null; 

  if(id) {
    const result = await hcApi.get<any>(
      `v3/medidor/${id}/info`
    )

    return result.data
  }
}

export async function getConsumptionDistribution(
  idsMeters: Array<string|number>|null,
) {

  let qs = idsMeters?.map(item => `${item}`)

  if(qs) {
    const result = await hcApi.get<any>(
      `v3/dashboard/distribuicao-consumo?medidores_ids=${qs?.join(',')}`
    )

    return result.data
  }  
}

export async function getHeatMap(
    meterIds: Array<any>|null,
    initialDate: string,
    finalDate: string
) {   
  let qs = meterIds?.map(item => `meterId=${item}`)

  const result = await netApi.get<any>(
    `dashboards/consumption/heatmap-multiple?${qs?.join('&')}&startDate=${initialDate}T00:00:00.000Z&endDate=${finalDate}T23:59:59.999Z`
  )

  return result.data
}

export async function listMonitorsNovoSmart(){
  const result = await hcApi.get<any>(
    `v3/dashboard/medidores-novo-smart`
  )

  return result.data
}

export async function getTemperatureLive() {

  const data  = await listMonitors()
  const idsMeters = data?.map(item => (
    item.meterId
  )) || [];

  //const idsMeters = [1000]
  if(idsMeters) {
    const result = await hcApi.get<any>(
      `v3/dashboard/ultima-temperatura?medidores_ids=${idsMeters?.join(',')}`
    )

    for(let idMonitor in data) {
      for(let idTemperatura in result?.data) { 
        if(data[idMonitor].meterId == result.data[idTemperatura].medidor_id) {
            result.data[idTemperatura].descricao_medidor = data[idMonitor].name 
        }
      }
    }

    return result.data
  }  
}


interface IAnaliseDeConsumoGrafico {
  id: string;
  value: number;
  color: string;
}


export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export async function getDailyConsumption(
  meters_id: number[] = [], 
  date_start: Date, 
  date_end: Date
): Promise<IAnaliseDeConsumoGrafico[]> {
  // const dateRange = getDateRange(date_start, date_end);
  
  const result = await fetchConsumptionData(meters_id, date_start.toISOString(),date_end.toISOString())

  

  // if (data && 'grafico' in data && data.grafico) {
  //   return date_object.map(dateObj => {
  //     const dataDateObj = data.grafico.find(d => d.id === dateObj.id);
  //     return dataDateObj ? { ...dateObj, ...dataDateObj } : dateObj;
  //   });
  // }
  console.log("data object: ")
  console.log(result )
  return result.grafico
}

export async function fetchConsumptionData(
  idsMeters: Array<string | number> | null,
  data_inicial: string,
  data_final: string,
  ponta = false,
  time = false
): Promise<{
  grafico: IAnaliseDeConsumoGrafico[];
  media_moeda: number;
  media_watts: number;
} | { error: string } | null> {
  if (!idsMeters) {
    return null;
  }

  const default_return = {
    intervalos: [
      { intervalo: "0h-6h", valor: 0 },
      { intervalo: "6h-12h", valor: 0 },
      { intervalo: "12h-18h", valor: 0 },
      { intervalo: "18h-24h", valor: 0 }
    ],
    media_watts: 0,
    media_moeda: 0,
    moeda: "BRL"
  };

  const dateRange = getDateRange(new Date(data_inicial), new Date(data_final));
  const date_return = {
    intervalos:[],
    media_watts: 0,
    media_moeda: 0,
    moeda: "BRL"
  };

  try {
    const results = await Promise.all(
      idsMeters.map(async (medidor_id) => {
        const url = ponta
          ? `v3/medidor/${medidor_id}/maior_consumo_periodo?mes=${data_inicial}`
          : `v3/medidor/${medidor_id}/maior_consumo_${time ? 'hora' : 'dia'}?de=${data_inicial}&para=${data_final}`;

        try {
          const result = await hcApi.get<any>(url).then(res => res.data);
          return result || (ponta ? default_return : 0);
        } catch (error) {
          console.error(`Error fetching data for medidor_id: ${medidor_id}`, error);
          return ponta ? default_return : 0;
        }
      })
    );

    const aggregatedData = results.reduce((acc, intervals) => {
      if (intervals && intervals.intervalos) {
        intervals.intervalos.forEach(interval => {
          const existing = acc.intervalos.find(item => 
            time ? new Date(item.intervalo).getHours() === new Date(interval.intervalo).getHours() : item.intervalo === interval.intervalo
          );
          if (existing) {
            existing.valor += interval.valor;
          } else {
            acc.intervalos.push({ ...interval });
          }
        });

        acc.media_watts += intervals.media_watts;
        acc.media_moeda += intervals.media_moeda;
      }
      return acc;
    }, ponta ? default_return : date_return);

    const grafico = aggregatedData.intervalos.map(interval => {
      console.log(interval.intervalo)
      const date = new Date(interval.intervalo);
      const formattedDate = formatDate(date);
      return {
        id: formattedDate,
        value: parseFloat(interval.valor.toFixed(2)),
        color: "#00AEA3"
      };
    });

    return {
      grafico: grafico as IAnaliseDeConsumoGrafico[],
      media_moeda: aggregatedData.media_moeda,
      media_watts: aggregatedData.media_watts
    };

  } catch (error) {
    console.error('Error aggregating data:', error);
    return {
      grafico: [{ id: '', value: 0, color: '' }],
      media_moeda: 0,
      media_watts: 0
    };
  }
}
