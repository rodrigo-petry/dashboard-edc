import { Dispatch, SetStateAction } from 'react'
import { Group, Select } from '@mantine/core'
import { FaCalendar } from 'react-icons/fa'
import dayjs from 'dayjs'

import {
  GetConsumptionRequest,
  GROUP_TYPES
} from '@core/domain/Dashboards/Dashboards.types'

import DatePicker from '@components/_shared/DatePicker'

interface DashboardQueryFormProps {
  queryParams: GetConsumptionRequest
  setQueryParams: Dispatch<SetStateAction<GetConsumptionRequest>>
}

function DashboardQueryForm({
  queryParams,
  setQueryParams
}: DashboardQueryFormProps) {
  const handleGroupTypeChange = (value: string) => {
    const djs = dayjs()

    switch (value) {
      case '0':
        setQueryParams(prev => ({
          ...prev,
          groupType: 0,
          startDate: djs.startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      case '1':
        setQueryParams(prev => ({
          ...prev,
          groupType: 1,
          startDate: djs.startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      case '2':
        setQueryParams(prev => ({
          ...prev,
          groupType: 2,
          startDate: djs.startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      case '3':
        setQueryParams(prev => ({
          ...prev,
          groupType: 3,
          startDate: djs.add(-5, 'day').startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      case '4':
        setQueryParams(prev => ({
          ...prev,
          groupType: 4,
          startDate: djs.add(-14, 'day').startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      case '5':
        setQueryParams(prev => ({
          ...prev,
          groupType: 5,
          startDate: djs.add(-3, 'month').startOf('day').toISOString(),
          endDate: djs.endOf('day').toISOString()
        }))
        break
      default:
        setQueryParams(prev => ({ ...prev, groupType: value ? +value : 0 }))
        break
    }
  }

  const renderDatePickers = () => {
    const { groupType } = queryParams

    if (groupType === 0) {
      return null
    }

    if (groupType === 1 || groupType === 2) {
      return (
        <DatePicker
          label="Dia"
          icon={<FaCalendar />}
          placeholder="Selecione uma data"
          value={dayjs(queryParams?.startDate).toDate()}
          onChange={value => {
            const djs = dayjs(value)
            setQueryParams({
              ...queryParams,
              startDate: djs.toISOString(),
              endDate: djs.endOf('day').toISOString()
            })
          }}
        />
      )
    }

    if (groupType === 3 || groupType === 4) {
      return (
        <Group grow>
          <DatePicker
            label="Início"
            icon={<FaCalendar />}
            placeholder="Selecione uma data"
            value={
              queryParams?.startDate
                ? dayjs(queryParams?.startDate).toDate()
                : undefined
            }
            onChange={value => {
              setQueryParams({
                ...queryParams,
                startDate: value?.toISOString(),
                endDate: undefined
              })
            }}
          />
          <DatePicker
            label="Fim"
            icon={<FaCalendar />}
            excludeDate={date => {
              const currentDjs = dayjs(date)
              const startDjs = dayjs(queryParams.startDate)

              return (
                currentDjs.isBefore(startDjs) ||
                currentDjs.isAfter(startDjs.add(5, 'days'))
              )
            }}
            placeholder="Selecione uma data"
            value={
              queryParams?.endDate
                ? dayjs(queryParams?.endDate).toDate()
                : undefined
            }
            onChange={value => {
              setQueryParams({
                ...queryParams,
                endDate: value?.toISOString()
              })
            }}
          />
        </Group>
      )
    }

    return (
      <Group grow>
        <DatePicker
          label="Início"
          icon={<FaCalendar />}
          placeholder="Selecione uma data"
          value={
            queryParams?.startDate
              ? dayjs(queryParams?.startDate).toDate()
              : undefined
          }
          onChange={value => {
            setQueryParams({
              ...queryParams,
              startDate: value?.toISOString(),
              endDate: undefined
            })
          }}
        />
        <DatePicker
          label="Fim"
          icon={<FaCalendar />}
          excludeDate={date => {
            const currentDjs = dayjs(date)
            const startDjs = dayjs(queryParams.startDate)

            return currentDjs.isBefore(startDjs)
          }}
          placeholder="Selecione uma data"
          value={
            queryParams?.endDate
              ? dayjs(queryParams?.endDate).toDate()
              : undefined
          }
          onChange={value => {
            setQueryParams({
              ...queryParams,
              endDate: value?.toISOString()
            })
          }}
        />
      </Group>
    )
  }

  return (
    <Group grow direction="column">
      <Select
        label="Granularidade"
        value={queryParams.groupType.toString()}
        onChange={handleGroupTypeChange}
        data={GROUP_TYPES.map(type => ({
          value: type.value.toString(),
          label: type.label
        }))}
      />
      {renderDatePickers()}
    </Group>
  )
}

export default DashboardQueryForm
