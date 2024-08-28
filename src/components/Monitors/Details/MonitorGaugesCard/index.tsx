import { useEffect, useState } from "react";
import {
  ActionIcon,
  Card,
  Group,
  Skeleton,
  Text,
  Tooltip,
} from "@mantine/core";

import { Monitor } from "@core/domain/Monitors/Monitors.types";
import { useMonitorLiveData } from "@core/domain/Proxies/Proxies.hooks";

import { metricPrefixFormatter } from "@utils/metricPrefix";

import GaugeMeter from "@components/_shared/GaugeMeter";
import { FaInfoCircle } from "react-icons/fa";
import { getConsumptionRange, getMedidorLiveData } from "@core/domain/Geral/Geral.service";
import { getStartAndEndDateOfWeek, getWeekNumber } from "functions/getWeekNumber";

function getMarks(max: number) {
  return [...Array(10)]
    .map((_, i) => {
      const markPercent = (i + 1) * 10;

      return {
        value: (max * markPercent) / 100,
        color: i + 1 === 7 ? "red" : "white",
      };
    })
    .slice(0, 7);
}

interface MonitorGaugesCardProps {
  monitor?: Monitor;
}

interface SemanalPeriodo {
  inicio:Date;
  fim:Date;
}

interface MensalPeriodo {
  inicio:Date;
  fim:Date;
}


function MonitorGaugesCard({ monitor }: MonitorGaugesCardProps) {
  const { data, isLoading, error } = useMonitorLiveData(monitor?.meterId);
  const[resumo, setResumo] = useState<any>({});
  const [semanalPeriodo, setSemanalPeriodo] = useState<SemanalPeriodo>({} as SemanalPeriodo);
  const [mensalPeriodo, setMensalPeriodo] = useState<MensalPeriodo>({} as MensalPeriodo);
  const[semanaAtual, setSemanaAtual] = useState<any>();
  useEffect(() => {
    if(monitor?.meterId){
      getResumoMensal(monitor?.meterId)
    }  
  },[monitor]);

  async function getResumoMensal(meterId: string|number|null) {
    let result = await getMedidorLiveData(meterId);
   
    try{
      if (result && result.semanal_periodo){
      
      const periodoSemanal = {inicio: new Date(result.semanal_periodo.inicio), fim: new Date(result.semanal_periodo.fim) } 
      setSemanalPeriodo(periodoSemanal);
      }
      if (result && result.mensal_periodo){
        const periodoMensal = {inicio: new Date(result.mensal_periodo.inicio), fim: new Date(result.mensal_periodo.fim) } 
        setMensalPeriodo(periodoMensal);
      }
      
    }catch(err){
      alert(err)
    }
    result && setResumo(result)
}
  useEffect(() => {
    if (error) {
      console.log("deu erro");
    }
  }, [error]);

  const weeklyMax = ((data?.meta_semanal || 0) * 100) / 70;
  const monthlyMax = ((data?.meta_mensal || 0) * 100) / 70;

  const weeklyMarks = getMarks(weeklyMax);
  const monthlyMarks = getMarks(monthlyMax);

  return (
    <Skeleton visible={isLoading} style={{ height: "100%" }}>
      <Card
        style={{
          height: "100%",
        }}
      >
        <Text  style={{
          fontWeight: "700",
          // marginBottom:"5px",
          marginTop:"5px",
          textAlign: "center",
        }}>Ciclo de Faturamento: { mensalPeriodo.inicio instanceof Date ? mensalPeriodo.inicio.toLocaleDateString('pt-BR', {day: "2-digit",  month: '2-digit'}) : "-"}  até  {mensalPeriodo.fim instanceof Date  ? mensalPeriodo.fim.toLocaleDateString('pt-BR', {day: "2-digit",  month: '2-digit'}) : "-"}</Text>
        {data ? (
          <Tooltip
            label={
              <div>
                <Group position="apart">
                  <span>Meta Semanal:</span>
                  <span>{metricPrefixFormatter(data?.meta_semanal)}</span>
                </Group>
               
                <Group position="apart">
                  <span>Meta Mensal:</span>
                  <span>{metricPrefixFormatter(data?.meta_mensal)}</span>
                </Group>
              </div>
            }
            style={{ position: "absolute", top: 16, right: 16 }}
          >
            <ActionIcon>
              <FaInfoCircle />
            </ActionIcon>
          </Tooltip>
        ) : null}
        <Group
          position="center"
          align="center"
          spacing="xl"
          style={{
            height: "100%",
          }}
        >
          {data && !error ? (
            <>
              <GaugeMeter
                min={0}
                max={weeklyMax}
                value={data?.watts_semanal}
                marks={weeklyMarks}
                formatter={(value: number) => metricPrefixFormatter(value,1,false)}
                label="Parcial Semanal"
                 //@ts-ignore
                unidade={"kWh"}
                // @ts-ignore
                semana={semanalPeriodo.inicio instanceof Date && semanalPeriodo.fim instanceof Date ? getWeekNumber(mensalPeriodo.inicio, mensalPeriodo.fim) : null}
                // @ts-ignore
                inicioEfimDaSemana={semanalPeriodo.inicio instanceof Date && semanalPeriodo.fim instanceof Date ? semanalPeriodo : null}
              />
              
              <GaugeMeter
                min={0}
                max={monthlyMax}
                value={data?.watts_mensal}
                marks={monthlyMarks}
                formatter={(value: number) =>  metricPrefixFormatter(value,1,false)}
                label="Parcial Mensal"
                //@ts-ignore
                unidade={"kWh"}
              />
            </>
          ) : (
            <Text>Não existem metas cadastradas para este monitor.</Text>
          )}
        </Group>
      </Card>
    </Skeleton>
  );
}

export default MonitorGaugesCard;
