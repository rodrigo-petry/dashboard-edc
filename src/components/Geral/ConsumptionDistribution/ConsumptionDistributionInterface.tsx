interface ConsumptionDistributionInterface {
    data_inicio: string|null,
    data_fim: string|null,
    consumo_total: string|number|null,
    ponta_periodo: string|null,
    ponta_percent: string|number|null,
    ponta_consumo: string|number|null,
    transicao_periodo: string|null,
    transicao_percent: string|number|null,
    transicao_consumo: string|number|null,
    fora_ponta_periodo: string|null,
    fora_ponta_percent: string|number|null,
    fora_ponta_consumo: string|number|null,
}

export default ConsumptionDistributionInterface;