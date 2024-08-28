import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Col, Grid, MultiSelect, Select } from '@mantine/core'

import {
  GetMultiMonitorRequest,
  MEDITION_TYPES,
  MEDITION_TYPES_BASIC
} from '@core/domain/Dashboards/Dashboards.types'
import { useMonitors } from '@core/domain/Monitors/Monitors.hooks'
import { useNotifications } from '@mantine/notifications'
import DatePicker from "@components/_shared/DatePicker"
import { FaCalendar } from "react-icons/fa"
import dayjs from 'dayjs'
import {hours} from '@utils/hours'
import {listMonitorsNovoSmart} from '@core/domain/Geral/Geral.service'


interface MultiMonitorQueryFormProps {
  queryParams: GetMultiMonitorRequest
  setQueryParams: Dispatch<SetStateAction<GetMultiMonitorRequest>>
  getMeasurements: Function
}

function MultiMonitorQueryForm({
    queryParams,
    setQueryParams,
    getMeasurements
}: MultiMonitorQueryFormProps) {
  const notifications = useNotifications()
  const [medidoresBasicos, setMedidoresBasicos] = useState<Array<any>>([]);
  const [mostrarSomenteDadosBasicos, setMostrarSomenteDadosBasicos] = useState<boolean>(true);

  const { data } = useMonitors()

  const Agrupamento = [
    { value: 'minutos', label: 'Minutos' },
    { value: 'horas', label: 'Horas' },
    { value: 'dia', label: 'Dia' },
  ];

  const AgrupamentoMinuto = [
   
    { value: '2', label: '15 Minutos' },
    { value: '0', label: '1 Minuto' }
  
  ];

  const horas = hours()


  useEffect(() => {
    getNovoSmart(null)
    if (data && data?.length) {
      setQueryParams(prev => ({
        ...prev
      }))
    }
  }, [data])

  async function  getNovoSmart(medidorId: any)
  {
     const medidoresNovoSmart = await listMonitorsNovoSmart();
     setMedidoresBasicos(medidoresNovoSmart);

     if(medidorId) {
        setMostrarSomenteDadosBasicos(medidoresNovoSmart.includes(parseFloat(medidorId)));
     }
  }

  function hasCommonElements(array1:Array<any>, array2:Array<any>) {
    for (const element of array1) {
      if (array2.includes(parseFloat(element))) {
        return true;
      }
    }
    return false;
  }

  async function showBasicData(medidoresIds:any)
  {
      setMostrarSomenteDadosBasicos(hasCommonElements(medidoresIds, medidoresBasicos));
  }

  return (
    <Grid>
      <Col span={12}>
        <Grid>
          <Col span={8} md={4}>
            <MultiSelect
              label="Monitores"
              data={
                data?.map(item => ({
                  value: item.meterId.toString(),
                  label: item.name
                })) || []
              }
              value={queryParams.meterIds?.map(item => item.toString())}
              onChange={value => {
                showBasicData(value)
                setQueryParams(prev => ({
                  ...prev,
                  meterIds: value.map(a => +a)
                }))
              }}
            />
          </Col>
          <Col span={8} md={3}>
            <Select
              label="Parâmetro"
              placeholder="Parâmetro a ser observado"
              value={queryParams?.parameters?.toString()}
              onChange={value => {
                setQueryParams(prev => ({
                  ...prev,
                  parameters: value ? +value : 1
                }))
              }}
              data={mostrarSomenteDadosBasicos ? MEDITION_TYPES_BASIC.map(item => ({
                  label: item.label,
                  value: item.value.toString()
                }))
                  : MEDITION_TYPES.map(item => ({
                  label: item.label,
                  value: item.value.toString()
                }))}
            />
          </Col>

          <Col span={8} md={3}>
            <Select
              label="Agrupamento "
              placeholder="Agrupamento"
              value={queryParams?.group?.toString()}
              data={Agrupamento}
              onChange={value => {
                setQueryParams(prev => ({
                  ...prev,
                  group: value ? value : 'horas'
                }))
              }}
            />
          </Col>
              { queryParams?.group?.toString() == 'minutos'  &&
          <Col span={8} md={3}>
            <Select
              label="Agrupamento Minuto "
              placeholder="Minutos"
              value={queryParams?.groupType?.toString()}
              data={AgrupamentoMinuto}
             
              onChange={value => {
                setQueryParams(prev => ({
                  ...prev,
                  groupType: value ? parseInt(value) : 0
                }))
              }}
            />
          </Col>
}
         
          {<Col span={8} md={3}>
            <DatePicker
              label="Data Inicial"
              icon={<FaCalendar />}
              placeholder="Selecione uma data"
              value={
                queryParams?.startDate
                  ? dayjs(queryParams?.startDate).toDate()
                  : undefined
              }
              onChange={(value) => {
                setQueryParams({
                  ...queryParams,
                  startDate: value?.toISOString(),
                  //endDate: undefined,
                });
              }}
            />
          </Col>} 

         

          { <Col span={8} md={3}>
          <DatePicker
            label="Data Final"
            disabled= {queryParams?.group?.toString() == 'minutos' ? true : false}

            icon={<FaCalendar />}
            excludeDate={(date) => {
              const currentDjs = dayjs(date);
              const startDjs = dayjs(queryParams.startDate);

              return (
                currentDjs.isBefore(startDjs) ||
                currentDjs.isAfter(startDjs.add(31, "days"))
              );
            }}
            placeholder="Selecione uma data"
            value={
              queryParams?.endDate
                ? dayjs(queryParams?.endDate).toDate()
                : undefined
            }
            onChange={(value) => {
              setQueryParams({
                ...queryParams,
                endDate: value?.toISOString(),
              });
            }}
          />
          </Col>}


           {<Col span={8} md={3}>
           <Select
              label="Horário Inicial "
              placeholder="Horário Inicial"
              value={queryParams?.startHour?.toString()}
              data={horas}
              onChange={value => {
                setQueryParams(prev => ({
                  ...prev,
                  startHour: value ? value : '01'
                }))
              }}
             
            /> 
          </Col> }  

          { <Col span={8} md={3}>
           <Select
              label="Horário Final"
              placeholder="Horário Final"
              value={queryParams?.endHour?.toString()}
              data={horas}
              onChange={value => {
                setQueryParams(prev => ({
                  ...prev,
                  endHour: value ? value : '23'
                }))
              }}
            /> 
          </Col> }
        </Grid>
      </Col>

      <Col span={8} md={12}>
        <Button   style={{ float: 'right' }} onClick={() => { getMeasurements(queryParams)}} >
         Aplicar
        </Button>
      </Col>
    </Grid>
  )
}

export default MultiMonitorQueryForm
