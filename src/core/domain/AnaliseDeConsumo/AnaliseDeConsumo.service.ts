import { hcApi, netApi } from '@api'
import { IAnaliseDeConsumoGrafico, IAnaliseDeConsumoItem, IAnaliseDeConsumoFechamento, IAnaliseDeConsumoFechamentoRootObject, IAnaliseDeConsumoMedidor, IAnaliseDeConsumoMedidorData, IAnaliseDeConsumoMonthlyProjection, IAnaliseDeConsumoMonthlyProjectionItem, IAnaliseDeConsumoTemperatureMonthlyProjection, IAnaliseDeConsumoTemperaturaMedicao, IAnaliseDeConsumoCardinalWithID } from './AnaliseDeConsumo.types'
import { Console } from 'console';

export async function getConsumptionDistributionByDate(
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
    return null; // Handle case where idsMeters is null
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

  try {
    const promises = idsMeters.map(async (medidor_id) => {
      const url = ponta
        ? `v3/medidor/${medidor_id}/maior_consumo_periodo?mes=${data_inicial}`
        : `v3/medidor/${medidor_id}/maior_consumo_${time ? 'hora' : 'dia'}?de=${data_inicial}&para=${data_final}`;

      try {
        const result = await hcApi.get<any>(url).then(res => res.data);
        return result || (ponta ? default_return : 0);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`Resource not found for medidor_id: ${medidor_id}`);
        } else {
          console.error(`Error fetching data for medidor_id: ${medidor_id}`, error);
        }
        return ponta ? default_return : 0;
      }
    });

    const results = await Promise.all(promises);

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
    }, default_return);

    const grafico = aggregatedData.intervalos.map(interval => {
      const hour = new Date(interval.intervalo).getHours();
      if (!isNaN(hour) || !time) {
        return {
          id: time ? hour.toString().padStart(2, '0') + "h" : interval.intervalo,
          value: parseFloat(interval.valor.toFixed(2)),
          color: "#00AEA3"
        };
      }
      return false;
    }).filter(item => item !== false);

    return {
      grafico: grafico as IAnaliseDeConsumoGrafico[],
      media_moeda: aggregatedData.media_moeda,
      media_watts: aggregatedData.media_watts
    };

  } catch (error) {
    console.error('Error aggregating data:', error);
    const result = {
      grafico:   
      [{  id: '',
      value: 0,
      color: ''
    }],
      media_moeda: 0,
      media_watts: 0
    };
    
    return result; // Handle the error as per your application's needs
  }
}



interface IComparativo {
    "kwh_atual": number,
    "custo_atual": number,
    "kwh_anterior": number,
    "custo_anterior": number,
    "balanco": number
}


export async function getConsumptionComparative(id: number, id_meters: number[] = []): Promise<{
  kwh_atual: number;
  custo_atual: number;
  kwh_anterior: number;
  custo_anterior: number;
  balanco: number;
}> {
  const idsMeters = id_meters.length > 0 ? id_meters : await getProfileMeasures(id);

  const default_return = {
    kwh_atual: 0,
    custo_atual: 0,
    kwh_anterior: 0,
    custo_anterior: 0,
    balanco: 0
  };

  try {
    const promises = idsMeters.map(async (medidor_id) => {
      const url = `v3/medidor/${medidor_id}/comparativo`;
      try {
        const response = await hcApi.get<IComparativo | { error: string }>(url);
        const result = response.data;

        if ('error' in result) {
          // If result contains an error field, return the default value
          return default_return;
        }

        // If no error, assume result is of type IComparativo
        return result;
      } catch {
        return default_return;
      }
    });

    const results = await Promise.all(promises);

    return results.reduce((acc, value) => ({
      kwh_atual: acc.kwh_atual + (value?.kwh_atual ?? 0),
      custo_atual: acc.custo_atual + (value?.custo_atual ?? 0),
      kwh_anterior: acc.kwh_anterior + (value?.kwh_anterior ?? 0),
      custo_anterior: acc.custo_anterior + (value?.custo_anterior ?? 0),
      balanco: acc.balanco + (value?.balanco ?? 0)
    }), default_return);
    
  } catch (error) {
    console.error('Error fetching comparative data:', error);
    return default_return; // Return default values in case of error
  }
}

export async function getFechamento(id: number, meters_id=[] as number[]): Promise<IAnaliseDeConsumoFechamento | null> {
  const default_return = {  monetario: {
    diario: 0,
    semanal: 0,
    mensal: 0,
},
consumo: {
    diario: 0,
    semanal: 0,
    mensal: 0,
},
dia_de_fechamento: "",
fechamento: "",
total_mes_anterior_kwh: 0,
total_mes_anterior_brl: 0
}
  const idsMeters = meters_id.length>0 ? meters_id : await getProfileMeasures(id);
  if (!idsMeters) return null;

  const promises = idsMeters.map(async (medidor_id) => {
    isNaN(medidor_id) && default_return
    const url = `v2/metas/${medidor_id}/visualizar`;
    const result = await hcApi.get<IAnaliseDeConsumoFechamentoRootObject>(url).then((res)=>res.data.data).catch(()=>default_return);
    return result
  });


  const results = await Promise.all(promises);

  const aggregatedResult: IAnaliseDeConsumoFechamentoRootObject = {
    data: {
      monetario: {
        diario: 0,
        semanal: 0,
        mensal: 0,
      },
      consumo: {
        diario: 0,
        semanal: 0,
        mensal: 0,
      },
      dia_de_fechamento: '', // This field is not aggregated
      fechamento: '',        // This field is not aggregated
      total_mes_anterior_kwh: 0,
      total_mes_anterior_brl: 0,
    }
  };

  // Sum the properties
  results.forEach((fechamento) => {
    if (fechamento.monetario) {
      aggregatedResult.data.monetario.diario += fechamento.monetario.diario || 0;
      aggregatedResult.data.monetario.semanal += fechamento.monetario.semanal || 0;
      aggregatedResult.data.monetario.mensal += fechamento.monetario.mensal || 0;
    }
    if(fechamento.fechamento){
      aggregatedResult.data.fechamento = fechamento.fechamento
    }

    if (fechamento.consumo) {
      aggregatedResult.data.consumo.diario += (fechamento.consumo.diario || 0);
      aggregatedResult.data.consumo.semanal += (fechamento.consumo.semanal || 0);
      aggregatedResult.data.consumo.mensal += (fechamento.consumo.mensal || 0);
    }

    aggregatedResult.data.total_mes_anterior_kwh += fechamento.total_mes_anterior_kwh || 0;
    aggregatedResult.data.total_mes_anterior_brl += fechamento.total_mes_anterior_brl || 0;
  });

  

  return aggregatedResult.data;
}


export async function getProfileMeasures(id:number):  Promise<number[]>{
  const result = await hcApi.get(`v2/perfis/${id}`)
  let ids =  [result.data.general.id]
  let other_ids = result.data.setores.map((obj: IAnaliseDeConsumoMedidor)=> obj.id)
  ids = [ids, ...other_ids]
  return ids
}

export async function getProfileMeasuresWithName(id:number):  Promise<IAnaliseDeConsumoMedidor[]>{
  const result = await hcApi.get(`v2/perfis/${id}`)
  if(result.data){
    
  let ids =  result.data && result.data.general ? result.data.general : []
  let other_ids =  result.data && result.data.setores ? result.data.setores : []
  ids = [ids, ...other_ids]
  console.log(ids)
  // alert(JSON.stringify(ids))
  return ids
  }
  return []
}



export async function getProfileMeasuresType(id:number):  Promise<IAnaliseDeConsumoMedidorData>{
  const result = await hcApi.get(`v2/perfis/${id}`)
  
  return result.data
}

export async function getProfileMeasuresTypeV3(id:number):  Promise<IAnaliseDeConsumoMedidorData>{
  const result = await hcApi.get(`v3/perfis/${id}`)
  // const obj = Object.keys(result.data[0]).filter(i=>i!=='setores');
  
  if(result.data){

    
  const setor = result.data.map(e=> e.setor).filter(e=>e!=null)

  return {
    general: result.data,
    setores: setor
  };
}
return {
  general: [],
  setores: []
};
 
}

export async function getTotalMesMeasures(id:number):  Promise<number[]>{
  const result = await hcApi.get(`v2/perfis/${id}`)
  result.data as IAnaliseDeConsumoMedidor[]
  var kwh_mes = result.data.setores.map((obj:IAnaliseDeConsumoMedidor) => obj.kwh_mes).reduce((acc : number, amount:number) => acc + amount);
  var total_mes = result.data.setores.map((obj:IAnaliseDeConsumoMedidor) => obj.total_mes).reduce((acc : number, amount:number) => acc + amount);
  total_mes += result.data.general.total_mes
  kwh_mes += result.data.general.kwh_mes
  return kwh_mes
}



export async function getEachDayInAWeekMeasure(
  id: number,
  weeks: Date[],
  medidores_id = [] as number[]
): Promise<{ weeks_consumption: { id: string; label: string; value: number }[]; media_watts: number; media_moeda: number }> {
  const result = medidores_id.length > 0 ? medidores_id : await getProfileMeasures(id);

  if (!weeks || weeks.length !== 7) {
    throw new Error('Weeks array must have exactly 7 days');
  }

  const new_weeks: { id: any; label: any; value: any }[] = [];
  let media_watts = 0;
  let media_moeda = 0;

  await Promise.all(
    weeks.map(async (day) => {
      const dayString = day.toISOString().split('T')[0];

      try {
        const data = await getConsumptionDistributionByDate(result, dayString, dayString);

        if (data && 'media_watts' in data && 'media_moeda' in data) {
          media_watts += data.media_watts ?? 0;
          media_moeda += data.media_moeda ?? 0;
          new_weeks.push({
            id: day.toLocaleDateString('pt-br', { weekday: 'short' }),
            label: day.toLocaleDateString('pt-br', { weekday: 'short' }),
            value: data.media_watts ?? 0
          });
        } else {
          new_weeks.push({
            id: day.toLocaleDateString('pt-br', { weekday: 'short' }),
            label: day.toLocaleDateString('pt-br', { weekday: 'short' }),
            value: 0
          });
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${dayString}:`, error);
        new_weeks.push({
          id: day.toLocaleDateString('pt-br', { weekday: 'short' }),
          label: day.toLocaleDateString('pt-br', { weekday: 'short' }),
          value: 0
        });
      }
    })
  );

  return { weeks_consumption: new_weeks, media_watts, media_moeda };
}




export async function getPontaAndForaDePonta(id:number,data_inicial: string, data_final:string, medidores_id=[] as number[]){
  const idsMeters = medidores_id.length>0 ? medidores_id : await getProfileMeasures(id);
  let qs = idsMeters?.map(item => `${item}`)
  if(qs){
  
  const data = await getConsumptionDistributionByDate(idsMeters, data_inicial, '00', true);
  
  return data || {
    grafico: [
    {
      id: "",
      value: 0,
      color: "#00AEA3"
    
    },
  ],
      media_watts: 0, 
      media_moeda: 0
    
  
  }
} 
return  {
  grafico: [
  {
    id: "",
    value: 0,
    color: "#00AEA3"
  
  },
],
    media_watts: 0, 
    media_moeda: 0 }

}

export  async function getTimeConsumption(meters_id: number[] = [], date_start: Date,  date_end: Date){
  const times_object : IAnaliseDeConsumoGrafico[] = [{
    id: '00h',
    value: 0,
    color: "#00AEA3"
  },
  {
    id: '01h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '02h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '03h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '04h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '05h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '06h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '07h',
      value: 0,
      color: "#00AEA3",
  },

  {
    id: '08h',
      value: 0,
      color: "#00AEA3",
  },

  {
    id: '09h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '10h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '11h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '12h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '13h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '14h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '15h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '16h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '17h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '18h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '19h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '20h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '21h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '22h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '23h',
      value: 0,
      color: "#00AEA3",
  }]
   
    const data = await getConsumptionDistributionByDate(meters_id, date_start.toISOString(), date_end.toISOString(), false,true);
    
   console.log("called")
    if (data?.grafico) {
      const mergedArray = times_object.map(hourObj => {
        const dataHourObj = data.grafico.find(d => d.id === hourObj.id);
        return dataHourObj ? { ...hourObj, ...dataHourObj } : hourObj;
      });


    return mergedArray
    }

    return times_object
}


export async function getMonthlyProjectionForEach(id: number, measures_ids = [] as { value: string, label: string }[], consumo=false) {
  const idsMeters = measures_ids.length > 0 ? measures_ids : await getProfileMeasuresWithName(id).then(e => e.map(r => ({ value: r.id, label: r.nome })));

  const initialObject: IAnaliseDeConsumoMonthlyProjection = {
      kwh_registrado: 0,
      kwh_previsto: 0,
      kwh_anterior: 0,
      kwh_total: 0,
      custo_total: 0,
      items: [
          {
              intervalo: '',
              valor: 0,
              consumo: 0,
              projecao: false,
          }
      ]
  };

  let qs = idsMeters?.map(item => `${item.value}`);
  if (idsMeters) {
      const promises = idsMeters.map(async ({ value, label }) => {
          try {
              const url = `v2/medidor/${value}/projecao/mes`;
              const result = await hcApi.get<IAnaliseDeConsumoMonthlyProjection>(url);

              return { label, data: result.data || initialObject };
          } catch (error) {
              return { label, data: initialObject };
          }
      });

      const results = await Promise.all(promises);



      const formatData = (data: IAnaliseDeConsumoMonthlyProjection) => {

        const formattedItems = data && data.items ? data.items.map(item => ({
            x: item.intervalo ? item.intervalo : "",
            y: consumo ?  (item.consumo ? item.consumo : 0) : (item.valor ? item.valor : 0) 
        })) : [{ x: "", y: 0 }];


        return  {
              kwh_registrado: !isNaN(data.kwh_registrado) ? parseFloat(data.kwh_registrado.toFixed(2)) : 0,
              kwh_previsto: !isNaN(data.kwh_previsto) ? parseFloat(data.kwh_previsto.toFixed(2)): 0,
              kwh_anterior: !isNaN(data.kwh_anterior) ? parseFloat(data.kwh_anterior.toFixed(2)) : 0,
              kwh_total: !isNaN(data.kwh_total) ? parseFloat(data.kwh_total.toFixed(2)) : 0,
              custo_total: !isNaN(data.custo_total) ? parseFloat(data.custo_total.toFixed(2)) : 0,
              items: formattedItems
          } 
      };

      const formattedResults = results.map(({ label, data }) => ({
          // id: label,
          id: label, 
          data: formatData(data).items,
      }));
      
      const kwh_registrado_total = results.reduce((n, {data: {kwh_registrado}} )=> n + (!isNaN(kwh_registrado) ? parseFloat(kwh_registrado.toFixed(2)) : 0  ), 0 )
      const kwh_previsto_total = results.reduce((n, { data: {kwh_previsto} }  )=> n + (!isNaN(kwh_previsto) ? parseFloat(kwh_previsto.toFixed(2)) : 0  ), 0 )
      const kwh_anterior_total = results.reduce((n, {data: {kwh_anterior}} )=> n + (!isNaN(kwh_anterior) ? parseFloat(kwh_anterior.toFixed(2)) : 0  ), 0 )
      const kwh_total_total = results.reduce((n, {data: {kwh_total} })=> n + (!isNaN(kwh_total) ? parseFloat(kwh_total.toFixed(2)) : 0  ), 0 )
      const custo_total_total = results.reduce((n, {data: {custo_total} })=> n + (!isNaN(custo_total) ? parseFloat(custo_total.toFixed(2)) : 0  ), 0 )
      
      return {grafico : formattedResults, kwh_registrado: kwh_registrado_total, kwh_previsto: kwh_previsto_total, kwh_anterior: kwh_anterior_total, kwh_total: kwh_total_total, custo_total: custo_total_total };
  }
}





export async function getMonthlyProjectionTotal(id: number, measures_ids=[] as number[]) {
  const idsMeters = measures_ids.length > 0 ? measures_ids : await getProfileMeasures(id);

  const initialObject: IAnaliseDeConsumoMonthlyProjection = {
    kwh_registrado: 0,
    kwh_previsto: 0,
    kwh_anterior: 0,
    kwh_total: 0,
    custo_total: 0,
    items: [

      {
        intervalo: '',
        valor: 0,
        consumo: 0,
        projecao: false,
      }


    ]
};


  let qs = idsMeters?.map(item => `${item}`);
  if (idsMeters) {
      const promises = idsMeters.map(async (medidor_id) => {
          try {
            
          
          const url = `v2/medidor/${medidor_id}/projecao/mes`;
          const result = await hcApi.get<IAnaliseDeConsumoMonthlyProjection>(url);
          return result.data || initialObject;
        } catch (error) {
            return initialObject
        }
      });

     
      const results = await Promise.all(promises);

     

      const sumItems = (items: IAnaliseDeConsumoMonthlyProjectionItem[]) => {
          const itemMap: { [key: string]: IAnaliseDeConsumoMonthlyProjectionItem } = {};

          items.forEach(item => {
              if (!itemMap[item.intervalo]) {
                  itemMap[item.intervalo] = { ...item };
              } else {
                  itemMap[item.intervalo].valor += item.valor;
                  itemMap[item.intervalo].consumo += item.consumo;
              }
          });

          return Object.values(itemMap);
      };

      const initialAcc: IAnaliseDeConsumoMonthlyProjection = {
          kwh_registrado: 0,
          kwh_previsto: 0,
          kwh_anterior: 0,
          kwh_total: 0,
          custo_total: 0,
          items: []
      };
      // try{
      const aggregatedResult = results.reduce((acc, value) => {
        if(value){
          acc.kwh_registrado += value ? value.kwh_registrado : 0;
          acc.kwh_previsto += value ? value.kwh_previsto : 0;
          acc.kwh_anterior += value ? value.kwh_anterior : 0;
          acc.kwh_total += value ? value.kwh_total : 0;
          acc.custo_total += value ? value.custo_total : 0;
          acc.items = sumItems([...acc.items, ...value.items]);
        }
          return acc;
      }, initialObject);
      aggregatedResult.items.sort((a, b) => b.valor - a.valor);
      const formattedItems = {
        id: "Projecao",
        data: aggregatedResult.items.map(item => ({
            x: item ? item.consumo : 0,
            y: item ? item.valor : 0
        }))
    };

      return { grafico:[formattedItems], kwh_registrado: parseFloat(aggregatedResult.kwh_registrado.toFixed(2)), kwh_previsto : parseFloat(aggregatedResult.kwh_registrado.toFixed(2))};
  // } catch{
  //   return { grafico: [ {id: "Projeção", data:[{x:0,y:0 }] }], kwh_registrado: 0, kwh_previsto : 0};
  // }
  }
}


function isValidDate(dateObject: string){
  return new Date(dateObject).toString() !== 'Invalid Date';
}


interface IAnaliseDeConsumoTemperaturaMedicao {
  temperatura: number;
  umidade: number;
  data_de_medicao: string;
}

interface IAnaliseDeConsumoTemperatureMonthlyProjection {
  dispositivo_id: string;
  descricao_dispositivo: string;
  medicoes: IAnaliseDeConsumoTemperaturaMedicao[];
}

interface IAnaliseDeConsumoCardinalWithID {
  id: string;
  data: { x: string; y: number }[];
}

export async function getMonthlyTemperatureProjection(idsMeters: number[], startDate: string, endDate: string, umidade = false) {
  if (!idsMeters || idsMeters.length === 0) {
    return { grafico: [{ id: "", data: [{ x: 0, y: 0 }] }], dispositivo_id: '', descricao_dispositivo: '' };
  }

  const promises = idsMeters.map(async (medidor_id) => {
    const url = `v3/medidor/${medidor_id}/medicoes-temperatura?data_e_hora_inicial=${startDate}&data_e_hora_final=${endDate}`;
    const result = await hcApi.get<IAnaliseDeConsumoTemperatureMonthlyProjection[]>(url);
    if (result && result.data && result.data.length > 0) {
      return result.data[0];
    } else {
      return {
        dispositivo_id: '',
        descricao_dispositivo: '',
        medicoes: [{ temperatura: 0, umidade: 0, data_de_medicao: '' }]
      };
    }
  });

  const results = await Promise.all(promises);

  const sumItems = (items: IAnaliseDeConsumoTemperaturaMedicao[]) => {
    const itemMap: { [key: string]: IAnaliseDeConsumoTemperaturaMedicao } = {};

    items.forEach(item => {
      if (item && item.data_de_medicao && isValidDate(item.data_de_medicao)) {
        const date = new Date(item.data_de_medicao);
        date.setMinutes(Math.floor(date.getMinutes() / 30) * 30, 0, 0);
        const key = date.toISOString();

        if (!itemMap[key]) {
          itemMap[key] = { ...item, data_de_medicao: key };
        } else {
          itemMap[key].temperatura =  item.temperatura ;
          itemMap[key].umidade = (itemMap[key].umidade + item.umidade) / 2;
        }
      }
    });

    return Object.values(itemMap);
  };

  const initialAcc: IAnaliseDeConsumoTemperatureMonthlyProjection = {
    descricao_dispositivo: '',
    dispositivo_id: '',
    medicoes: []
  };

  const aggregatedResult = results.reduce((acc, value) => {
    acc.descricao_dispositivo += value.descricao_dispositivo || '';
    acc.dispositivo_id += value.dispositivo_id || '';
    acc.medicoes = sumItems([...acc.medicoes, ...value.medicoes]);
    return acc;
  }, initialAcc);

  const formattedItemsUmidade: IAnaliseDeConsumoCardinalWithID = {
    id: "Umidade",
    data: aggregatedResult.medicoes.map((item: IAnaliseDeConsumoTemperaturaMedicao) => ({
      x: item.data_de_medicao,
      y: Math.round(item.umidade)
    }))
  };

  const formattedItemsTemperatura: IAnaliseDeConsumoCardinalWithID = {
    id: "Temperatura",
    data: aggregatedResult.medicoes.map((item: IAnaliseDeConsumoTemperaturaMedicao) => ({
      x: item.data_de_medicao,
      y: Math.round(item.temperatura)
    }))
  };

  return { grafico: [formattedItemsTemperatura, formattedItemsUmidade], dispositivo_id: '', descricao_dispositivo: '' };
}



interface ITemperatureReport{
  "id": string,
  "mensagem": string
}

export async function temperatureReport(meters_id: number[], initialDate :Date, endDate: Date,  profileId=-1){
  let idsMeters = meters_id
  if (profileId > 0){
    idsMeters = await getProfileMeasures(profileId);
  }
  const default_return : ITemperatureReport = {
      "id": "0",
      "mensagem": "Não foi possível realizar a ação!"
  }

  if (idsMeters) {
       
          const promises = idsMeters.map(async (medidor_id) => {
            try {
              const url = 'v3/medidor/relatorio-temperatura'
              const result = await hcApi.post<ITemperatureReport>(url, {
                "medidor_id": medidor_id,
                "data_inicial": initialDate.toLocaleDateString('pt-br'),
                "data_final": endDate.toLocaleDateString('pt-br')
            });
              return result.data;
            } catch (error:any) {
              
              if (error.response && error.response.status === 404) {
                console.error(`Resource not found for medidor_id: ${medidor_id}`);
                default_return.id = medidor_id.toString()
                return  default_return
              } else {
                console.error(`Error fetching data for medidor_id: ${medidor_id}`, error);
                default_return.id = medidor_id.toString()
                return default_return
              }


            }

      });


    try{
          const results = await Promise.all(promises);
          const all_results = results.reduce((old_object, new_object)=>{
            old_object.id = new_object.id
            old_object.mensagem = new_object.mensagem
            return old_object
          }, default_return)
          return all_results

    }catch(error){
        return {
          id : '0',
          mensagem: 'Não foi possível realizar a ação!'
        }
    }

  }
}

export  async function getTimeConsumptionTwo(meters_id: number[] = [], date_start: Date,  date_end: Date){
  const times_object : IAnaliseDeConsumoGrafico[] = [{
    id: '00h',
    value: 0,
    color: "#00AEA3"
  },
  {
    id: '01h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '02h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '03h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '04h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '05h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '06h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '07h',
      value: 0,
      color: "#00AEA3",
  },

  {
    id: '08h',
      value: 0,
      color: "#00AEA3",
  },

  {
    id: '09h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '10h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '11h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '12h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '13h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '14h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '15h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '16h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '17h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '18h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '19h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '20h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '21h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '22h',
      value: 0,
      color: "#00AEA3",
  },
  {
    id: '23h',
      value: 0,
      color: "#00AEA3",
  }]
   
    const data = await getConsumptionDistributionByDate(meters_id, date_start.toISOString(), date_end.toISOString(), false,true);
    
   
    if (data?.grafico) {
      const mergedArray = times_object.map(hourObj => {
        const dataHourObj = data.grafico.find(d => d.id === hourObj.id);
        return dataHourObj ? { ...hourObj, ...dataHourObj } : hourObj;
      });


    return mergedArray
    }
    return times_object
}
