export interface Monitor {
  id: number;
  meterId: number;
  name: string;
  demandLimit: number;
  startRushHour: string;
  endRushHour: string;
  acumulatedActivePowerTotal: number;
  acumulatedActivePowerPonta: number;
  acumulatedActivePowerForaDePonta: number;
  overDemandConsumn: number;
  overDemandOcurrencesCount: number;
  avereageDemand: number;
  generatedReactiveEnergy: number;
}

export interface MonitorsQuery {
  startDate?: Date;
  endDate?: Date;
  clientId?: number;
  meterId?: number;
}

export interface MonitorsResult {
  monitors: Monitor[];
}

export interface UpdateMonitorRequest {
  meterId: number;
  name: string;
  demandLimit?: number;
  startRushHour?: string;
  endRushHour?: string;
}

export interface UpdateMonitorResult {
  id: number;
  name: string;
  demandLimit?: number;
  startRushHour?: string;
  endRushHour?: string;
}
