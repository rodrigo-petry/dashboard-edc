interface WeatherClimateInterface {
    cidade: string|null,
    estado: string|null,
    data: string|null,
    ultima_atualizacao: string|null,
    chuva: string|null|number,
    temperatura: string|null|number,
    bandeira: string|null,
    distribuidora: string|null,
}

export default WeatherClimateInterface;