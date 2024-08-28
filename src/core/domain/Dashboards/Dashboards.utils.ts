import { HeatMapDatum } from '@nivo/heatmap'
import { Datum, Serie } from '@nivo/line'
import dayjs from 'dayjs'
import HeatMapInterface from '@components/Geral/HeatMap/HeatMapInterface'


import {
  Consumption,
  ConsumptionBehavior,
  Measurement,
  MultiMonitors
} from './Dashboards.types'

import 'dayjs/locale/pt-br'
import { getWeeklyConsumption } from './Dashboards.service'

export function transformConsumptionToLineChartData(
  parameter: string,
  rawData?: Consumption
): Serie[] {
  if (!rawData) return []

  let phase1: Datum[] = []
  let phase2: Datum[] = []
  let phase3: Datum[] = []

  rawData.items.forEach(item => {
    phase1 = [
      ...phase1,
      { x: item.referenceDate, y: (item[parameter] as Measurement)?.phase1 }
    ]
    phase2 = [
      ...phase2,
      { x: item.referenceDate, y: (item[parameter] as Measurement)?.phase2 }
    ]
    phase3 = [
      ...phase3,
      { x: item.referenceDate, y: (item[parameter] as Measurement)?.phase3 }
    ]
  })

  return [
    {
      id: 'Fase R',
      data: phase1
    },
    {
      id: 'Fase S',
      data: phase2
    },
    {
      id: 'Fase T',
      data: phase3
    }
  ]
}

export function getLineChartPropsByGroupType(groupType: number) {
  switch (groupType) {
    case 0:
    case 1:
      return { format: '%H:%M', tickValues: 'every 30 minutes' }
    case 2:
      return { format: '%H:%M', tickValues: 'every 2 hours' }
    case 3:
      return { format: '%d/%m %H:%M', tickValues: 'every 6 hours' }
    case 4:
      return { format: '%d/%m/%Y', tickValues: 'every 1 day' }
    case 5:
      return { format: '%d/%m/%Y', tickValues: 'every 2 days' }
    default:
      return { format: '%m/%Y', tickValues: 'every 1 month' }
  }
}

export function transformConsumptionBehaviorToHeatMapChartData(
  rawData?: ConsumptionBehavior
): HeatMapDatum[] {
  if (!rawData) return []

  return rawData.consumptionBehavior.map(item => ({
    dayOfWeek: dayjs()
      .locale('pt-br')
      .day(item.dayOfWeek)
      .format('ddd')
      .toUpperCase(),
    ...item.consumptionRelation.reduce((acc, curr) => {
      return {
        ...acc,
        [`${curr.hour}h`.padStart(3, '0')]: curr.consumption * 1000
      }
    }, {})
  }))
}

export function formatHeatMapFinal(dados: Array<HeatMapInterface|any>)
{
  for (let i = 0; i <  7; i++) {
      let diaDaSemana =  i  
      if(!dados[diaDaSemana]) {
          continue;
      }
      dados[diaDaSemana]['01h'] =  dados[diaDaSemana]['01h'] ?  dados[diaDaSemana]['01h']  : -0.1;
      dados[diaDaSemana]['02h'] =  dados[diaDaSemana]['02h'] ?  dados[diaDaSemana]['02h']  : -0.1;
      dados[diaDaSemana]['03h'] =  dados[diaDaSemana]['03h'] ?  dados[diaDaSemana]['03h']  : -0.1;
      dados[diaDaSemana]['04h'] =  dados[diaDaSemana]['04h'] ?  dados[diaDaSemana]['04h']  : -0.1;
      dados[diaDaSemana]['05h'] =  dados[diaDaSemana]['05h'] ?  dados[diaDaSemana]['05h']  : -0.1;
      dados[diaDaSemana]['06h'] =  dados[diaDaSemana]['06h'] ?  dados[diaDaSemana]['06h']  : -0.1;
      dados[diaDaSemana]['07h'] =  dados[diaDaSemana]['07h'] ?  dados[diaDaSemana]['07h']  : -0.1;
      dados[diaDaSemana]['08h'] =  dados[diaDaSemana]['08h'] ?  dados[diaDaSemana]['08h']  : -0.1;
      dados[diaDaSemana]['09h'] =  dados[diaDaSemana]['09h'] ?  dados[diaDaSemana]['09h']  : -0.1;
      dados[diaDaSemana]['10h'] =  dados[diaDaSemana]['10h'] ?  dados[diaDaSemana]['10h']  : -0.1;
      dados[diaDaSemana]['11h'] =  dados[diaDaSemana]['11h'] ?  dados[diaDaSemana]['11h']  : -0.1;
      dados[diaDaSemana]['12h'] =  dados[diaDaSemana]['12h'] ?  dados[diaDaSemana]['12h']  : -0.1;
      dados[diaDaSemana]['13h'] =  dados[diaDaSemana]['13h'] ?  dados[diaDaSemana]['13h']  : -0.1;
      dados[diaDaSemana]['14h'] =  dados[diaDaSemana]['14h'] ?  dados[diaDaSemana]['14h']  : -0.1;
      dados[diaDaSemana]['15h'] =  dados[diaDaSemana]['15h'] ?  dados[diaDaSemana]['15h']  : -0.1;
      dados[diaDaSemana]['16h'] =  dados[diaDaSemana]['16h'] ?  dados[diaDaSemana]['16h']  : -0.1;
      dados[diaDaSemana]['17h'] =  dados[diaDaSemana]['17h'] ?  dados[diaDaSemana]['17h']  : -0.1;
      dados[diaDaSemana]['18h'] =  dados[diaDaSemana]['18h'] ?  dados[diaDaSemana]['18h']  : -0.1;
      dados[diaDaSemana]['19h'] =  dados[diaDaSemana]['19h'] ?  dados[diaDaSemana]['19h']  : -0.1;
      dados[diaDaSemana]['20h'] =  dados[diaDaSemana]['20h'] ?  dados[diaDaSemana]['20h']  : -0.1;
      dados[diaDaSemana]['21h'] =  dados[diaDaSemana]['21h'] ?  dados[diaDaSemana]['21h']  : -0.1;
      dados[diaDaSemana]['22h'] =  dados[diaDaSemana]['22h'] ?  dados[diaDaSemana]['22h']  : -0.1;
      dados[diaDaSemana]['23h'] =  dados[diaDaSemana]['23h'] ?  dados[diaDaSemana]['23h']  : -0.1;
      dados[diaDaSemana]['00h'] =  dados[diaDaSemana]['00h'] ?  dados[diaDaSemana]['00h']  : -0.1;
   }
    let primeiraParte = [];
    let segundaParte = [];
    let dadosEmKw = false;

    let hoje = dayjs().day()
    for(let id in dados) {
        for(let dia  in dados[id]) { 
            if(dados[id][dia] > 1000) {
              dadosEmKw = true
            }
        }
        if(id <= hoje) {
          segundaParte.push(dados[id])
        } else {
          primeiraParte.push(dados[id])
        }
    }  

    return [
        primeiraParte.concat(segundaParte),
        true
    ];
}

export function transformPowerFactorToBarChartData(rawData?: Consumption) {
  if (!rawData) return []

  return rawData.items.map(item => ({
    referenceDate: item.referenceDate,
    'Fase T': item.powerFactor.phase1,
    'Fase S': item.powerFactor.phase2,
    'Fase R': item.powerFactor.phase3
  }))
}

export function transformMultiMonitorsToLineChartData(
  parameter: string,
  rawData?: MultiMonitors
): Serie[] {
  if (!rawData) return []

  return rawData.items.reduce<Serie[]>((acc, curr) => {
    if(parameter == 'tension' || parameter == 'current') {
      return [
        ...acc,

        {
          id: `${curr.name} / Fase R`,
          data: curr.items.map(a => ({
            x: a.referenceDate,
            y: (a[parameter] as Measurement)?.phase1
          }))
        },
        {
          id: `${curr.name} / Fase S`,
          data: curr.items.map(a => ({
            x: a.referenceDate,
            y: (a[parameter] as Measurement)?.phase2
          }))
        },
        {
          id: `${curr.name} / Fase T`,
          data: curr.items.map(a => ({
            x: a.referenceDate,
            y: (a[parameter] as Measurement)?.phase3
          }))
        }
      ]
    }
    return [
      ...acc,
      {
        id: curr.name,
        data: curr.items.map(a => ({
          x: a.referenceDate,
          y: (a[parameter] as Measurement)?.total
        }))
      },
      {
        id: `${curr.name} / Fase R`,
        data: curr.items.map(a => ({
          x: a.referenceDate,
          y: (a[parameter] as Measurement)?.phase1
        }))
      },
      {
        id: `${curr.name} / Fase S`,
        data: curr.items.map(a => ({
          x: a.referenceDate,
          y: (a[parameter] as Measurement)?.phase2
        }))
      },
      {
        id: `${curr.name} / Fase T`,
        data: curr.items.map(a => ({
          x: a.referenceDate,
          y: (a[parameter] as Measurement)?.phase3
        }))
      }
    ]
  }, [])
}