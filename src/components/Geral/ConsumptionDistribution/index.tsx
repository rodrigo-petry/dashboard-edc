import React, {useEffect , useState} from 'react';
import { getConsumptionDistribution } from "@core/domain/Geral/Geral.service";
import DefaultPropsInterface from "../DefaultPropsInterface";
import ConsumptionDistributionInterface from './ConsumptionDistributionInterface';
import { Card, Grid, Group, Paper, Skeleton, Text, Title, createStyles } from '@mantine/core';

function ConsumptionDistribution({
    idsMeters,
    timeout,
    heightCard
}: DefaultPropsInterface) {
    const { classes, cx } = useStyles();
    const [data, setData] = useState<ConsumptionDistributionInterface>({
        "data_inicio": null,
        "data_fim": null,
        "consumo_total": null,
        "ponta_periodo": null,
        "ponta_percent": null,
        "ponta_consumo": null,
        "transicao_periodo": null,
        "transicao_percent": null,
        "transicao_consumo": null,
        "fora_ponta_periodo": null,
        "fora_ponta_percent": null,
        "fora_ponta_consumo": null,
    });

    useEffect(() => {
        getConsumption(idsMeters)
            const timer = setInterval(() => {
                getConsumption(idsMeters)
            }, timeout);
      }, []);

    const getConsumption = (
        idsMeters:Array<string|number>|null,
      ) =>  {
        getConsumptionDistribution(idsMeters).then(function (response) {
            setData({
                "data_inicio": response?.data_inicio,
                "data_fim": response?.data_fim,
                "consumo_total": response?.consumo_total,
                "ponta_periodo": response?.ponta_periodo,
                "ponta_percent": response?.ponta_percent,
                "ponta_consumo": response?.ponta_consumo,
                "transicao_periodo": response?.transicao_periodo,
                "transicao_percent": response?.transicao_percent,
                "transicao_consumo": response?.transicao_consumo,
                "fora_ponta_periodo": response?.fora_ponta_periodo,
                "fora_ponta_percent": response?.fora_ponta_percent,
                "fora_ponta_consumo": response?.fora_ponta_consumo,
            })
        });
    }

    const formatPeriodoData = (dataInicio: string|null, dataFim: string|null) => {
        const inicio = dataInicio?.split(" ")[0].split("-");
        const fim = dataFim?.split(" ")[0].split("-");

        if(inicio != null && inicio != undefined && fim != null && fim != undefined ) {
            var inicioFormatado =  inicio[2] + "/" + inicio[1] + "/" + inicio[0];
            var fimFormatado =  fim[2] + "/" + fim[1] + "/" + fim[0];

            return inicioFormatado + " a " + fimFormatado;
        } else {
            return "";
        }
    }

    const formatPeriodoFaixas = (data: string|null) => {
        return data?.split('-').map(tempo => tempo.split(":").slice(0, -1).join(":")).join(" até ") ?? "";
    }

    return (
        <Skeleton visible={false}>
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
                
                <Grid grow>
                <Grid.Col>
                <Title style={{fontWeight:700, fontSize:21}}>
                    Consumo por faixa de horário
                </Title> 
                <Text style={{fontWeight:500, fontSize:16, color:'#B9B9B9'}}>
                        Período de referência - { formatPeriodoData(data?.data_inicio, data?.data_fim) }
                    </Text>
                    </Grid.Col>
                    <Grid.Col span={12} md={4} className={ classes.principalCell }>
                        <Text className={ classes.subtitleText }>
                            Faixa de Ponta - { formatPeriodoFaixas(data?.ponta_periodo) } 
                        </Text>
                        <Title className={ classes.contentValue }>
                            {data?.ponta_percent?.toFixed(1).replace(".", ",")}% 
                        </Title>
                        <Title className={ classes.contentValue }  style={{fontSize: 17, color: '#B9B9B9', fontWeight:500}}>
                        ({ data?.ponta_consumo?.toFixed(0) } kWh)
                        </Title>
                    </Grid.Col>
                    <Grid.Col span={12} md={4} className={ classes.cell }>
                        <Text className={ classes.subtitleText }>
                            Faixa Fora Ponta - { formatPeriodoFaixas(data?.fora_ponta_periodo) } 
                        </Text>
                        <Title className={ classes.contentValue }>
                            {data?.fora_ponta_percent?.toFixed(1).replace(".", ",")}% 
                            <Title className={ classes.contentValue } style={{fontSize: 17, color: '#B9B9B9', fontWeight:500}}>
                            ({ data?.fora_ponta_consumo?.toFixed(0) } kWh)
                            </Title>
                        </Title>
                    </Grid.Col>
                </Grid>
                <Group style={{ float:"right", fontSize: "12px", marginTop:"10px", marginRight:"16px", fontWeight:"bold" }}>
                   
                </Group>
            </Card>
        </Skeleton>
    );
}

const useStyles = createStyles(() => {
    return {
        principalCell: {
            
            borderRadius: "6px",
            padding: "15px 20px",
            backgroundColor: '#EFFCFB',
            marginRight:20,
            textAlign: 'center'
        },
        cell: {
            padding: "15px 20px",
            backgroundColor: '#EFFCFB',
            borderRadius: "6px",
            textAlign: 'center'
           
        },
        titleText: {
            fontSize: "17px",
            marginBottom:"20px",
            color: "#00AEA3"
        },
        subtitleText: {
            fontWeight: 500,
            fontSize: 16,
            marginBottom:"10px",
        },
        contentValue: {
            color: "#00AEA3",
        },
        referenceText: {
            float:"right",
            fontSize: "14px",
            marginTop:"10px",
            fontWeight:"bold"
        }
    };
});

export default ConsumptionDistribution;