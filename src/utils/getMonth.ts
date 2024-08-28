export function getMonth(mes: string|number) {
    let nomeMes = "janeiro";
    switch (mes) {
        case '01':
          nomeMes = "janeiro" 
          break;
        case '02':
            nomeMes = "fevereiro" 
            break;
        case '03':
            nomeMes = "março" 
            break;
        case '04':
            nomeMes = "abril" 
            break;
        case '05':
            nomeMes = "maio" 
            break;
        case '06':
            nomeMes = "junho" 
            break;  
        case '07':
            nomeMes = "julho" 
            break;
        case '08':
            nomeMes = "agosto" 
            break;
        case '09':
            nomeMes = "setembro" 
            break;
        case '10':
            nomeMes = "outubro" 
            break;
        case '11':
            nomeMes = "novembro" 
            break;
        case '12':
            nomeMes = "dezembro" 
            break;     
       
    }  

    return nomeMes;
}

