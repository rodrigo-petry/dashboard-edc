import Moment from 'moment';

export function rulesQueryParams(
    queryParams: any ,
  ) {
   
    const group = queryParams.group
    
    if(queryParams.startDate) {
      let start = queryParams.startDate.split("T");
      queryParams.startDate = start[0]+'T'+queryParams.startHour +':00:00';
    }
  
    if(queryParams.endDate) {
      let end = queryParams.endDate.split("T")
      queryParams.endDate = end[0]+'T'+  queryParams.endHour +':59:59';
    }
  
    if(group == 'minutos') {
      let start = queryParams.startDate ? queryParams.startDate.split("T") : Moment().format('YYYY-MM-DD');
      queryParams.endDate = start[0] +"T"+ queryParams.endHour +':59:59';
    }

    queryParams.endHour;
  
    Moment().defaultFormat = "YYYY-MM-DDTHH:mm:ss";
    let start = Moment(queryParams.startDate)
    let end= Moment(queryParams.endDate)
    let diffOfDays = end.diff(start, 'days')
  
    if(diffOfDays > 45) {
      alert("Atenção! A diferença entre as datas não pode passar de 45 dias!")
      queryParams.startDate = Moment().format('YYYY-MM-DDT'+ queryParams.startHour +':00:00');
      queryParams.endDate = Moment().format('YYYY-MM-DDT'+ queryParams.endHour +':59:59');
    }

    return queryParams;
  }