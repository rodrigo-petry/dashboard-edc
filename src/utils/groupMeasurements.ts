export function groupMeasurements(
    group: string ,
    chartData:any,
    parameter: string
  ) {
  
    let dataFormatted = [];

    if(group == 'dia' || group == 'horas') {
        chartData.forEach(function(data: any, i: string) {
            dataFormatted = executeGroupData(data,i,group,parameter);   
            chartData[i]['data'] = dataFormatted;
        });
    }
      
    return chartData;
  }

  function executeGroupData(data: any,i :any,group :any,parameter: string) {
    let dataFormatted: any = [];

    dataFormatted = getDateToStandardExpected(data,group,dataFormatted);
    let groupedData =  performGrouping(dataFormatted);
    dataFormatted =  sumTheValuesWithTheSameGrouping(groupedData,parameter)
    
    return dataFormatted;
  }

function getDateToStandardExpected(data: any,group: any,dataFormatted: any)
{
    data.data.forEach(function(value: any) {
        if(group == 'dia') {
            let date = value.x.split('T');
            dataFormatted.push({"x": date[0]+'T00:00:00', "y": value.y});
        }    

        if(group == 'horas') {
            let date = value.x.split(':');
            dataFormatted.push({"x": date[0]+':00:00', "y": value.y});
        } 
    }); 

    return dataFormatted;
}

function performGrouping(dataFormatted:any)
{
    let key = 'x';

    return dataFormatted.reduce((acc: any, item: any) => {
        if (!acc[item[key]]) acc[item[key]] = []
        acc[item[key]].push(item.y)
        return acc
    }, {}) 
}

function sumTheValuesWithTheSameGrouping(groupedData: any, parameter: string)
{
    let dataFormatted = [];
    for(let date in groupedData) {
       
        let sum = 0;
        for (let i = 0; i < groupedData[date].length; i++) {
            sum += groupedData[date][i];
        }

        //if(parameter == 'powerFactor') {
            sum = sum / groupedData[date].length;
        //}
       
        dataFormatted.push({"x": date, "y": parseFloat(sum.toFixed(2))});
    } 
    return dataFormatted;
}