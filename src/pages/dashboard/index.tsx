import {useState,useEffect} from 'react'

import {getMultiMonitors} from '@core/domain/Dashboards/Dashboards.service'
import {
  GetMultiMonitorRequest,
  MEDITION_TYPES,
  MultiMonitors
} from '@core/domain/Dashboards/Dashboards.types'

import { usePageTitle } from '@contexts/PageTitleContextProvider'
import MultiMonitorQueryForm from '@components/Dashboard/MultiMonitorQueryForm'
import { Card, Col, Grid, Skeleton } from '@mantine/core'
import MultiMonitorLineChart from '@components/Dashboard/MultiMonitorLineChart'
import MultiMonitorCard from '@components/Dashboard/MultiMonitorCard'
import Moment from 'moment';
import {rulesQueryParams} from 'functions/dashboard/rulesQueryParams'
import resetInterval from "@utils/resetInterval"

function DashboardPage() {
  usePageTitle('Dashboard')

  let [queryParams, setQueryParams] = useState<GetMultiMonitorRequest>({
    startDate:  Moment().format('YYYY-MM-DDT00:00:00'),
    endDate:  Moment().format('YYYY-MM-DDT23:59:59'),
    parameters: 4,
    groupType: 2,
    group: "minutos",
    startHour: "00",
    endHour: "23",
  })

  const parameter = MEDITION_TYPES[queryParams.parameters].enumValue
  const group = queryParams.group
  queryParams = rulesQueryParams(queryParams)

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [data, setData] = useState<MultiMonitors|undefined>(undefined);
  const [parametro, setParametro] = useState<string>("");
  const [groupValue, setGroupValue] = useState<string>("minutos");

  const getMeasurements = (params:GetMultiMonitorRequest) => {
    setIsFetching(true);
    getMultiMonitors(params).then(function (response) {
      setGroupValue(group);
      setParametro(parameter);
      setData(response);  
      setIsFetching(false);
    });
  }
  
  useEffect(() => {
    resetInterval()
  },[])

  return (
    <Grid>
      <Col span={12}>
        <Card>
          <MultiMonitorQueryForm
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            getMeasurements={getMeasurements} 
          />
        </Card>
      </Col>
      <Col span={12}>
        { data?.items.length  ? <MultiMonitorLineChart
          multiMonitors={data}
          isLoading={isFetching}
          parameter={parametro}
          group={groupValue}
          queryParams={queryParams}
        /> : ""
        }
      </Col>
      {isFetching && !data?.items.length
        ? queryParams.meterIds?.map(item => (
            <Col key={item} span={3}>
              <Skeleton visible={isFetching} style={{ height: '332px' }}>
                <Card>Carregando...</Card>
              </Skeleton>
            </Col>
          ))
        : null}
      { queryParams.groupType==2 && queryParams.group=="minutos"  && data?.items.map(item => (
        <MultiMonitorCard
          key={item.meterId}
          multiMonitor={item}
          parameter={parametro}
          isLoading={isFetching}
        />
      ))}
    </Grid>
  )
}

export default DashboardPage
