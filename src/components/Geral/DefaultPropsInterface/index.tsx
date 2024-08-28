interface DefaultPropsInterface {
    idsMeters?: Array<number>|null,
    initialDate?: string|null,
    finalDate?: string|null,
    timeout?: number,
    heightCard?: number|string,
    bandeira?: string|null,
    cidade?: string|null,
    distribuidora?: string|null,
    temperature?: string|number|null,
    humidity?: string|number|null,
    isItLiveTemperature?: boolean,
    estado?: string|null,
    updateAt?: string|null,
    setUpdateAt?: any,
    title?: string|null,
    subtitle? : string|null,
    setConsumoLive? : any
    consumoLive?: any,
}

export default DefaultPropsInterface;