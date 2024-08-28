export function axisBottom(
    group: string ,
    chartData: any
  ): object {
    let config = {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: '%H:%M',
        tickValues: "every 1 hours",
        legendOffset: 36,
        legendPosition: 'middle'
      }; 
    
      if(group == 'dia') {
        config.format = '%d/%m';
        config.tickValues = "every 1 days"
      }
    
      if(group == 'horas') {
        config.format = '%d/%m %Hh';
      }
    
     if(chartData['0'] && chartData['0'].data.length > 15 && group == 'horas') {
        config.tickValues = 10
     }

    if(chartData['0'] && chartData['0'].data.length > 15 && group != 'horas') {
        delete config.tickValues 
    }

     return config;
  }