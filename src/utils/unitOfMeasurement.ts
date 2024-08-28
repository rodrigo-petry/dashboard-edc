export function unitOfMeasurement(
    parameter: string ,
  ):string {
    let unidade = "";

    // Fator de Potência
    if(parameter == 'powerFactor') {
        unidade = "Fator de potência";
    }

  
    // Potência Ativa
    if(parameter == 'activePowerData') {
      unidade = "W";
    }
  
    // Potência Aparente
    if(parameter == 'apparentPower') {
      unidade = "VA";
    }

     // Potência Reativa
     if(parameter == 'reactivePower') {
        unidade = "VAr";
    }
  
     // Corrente
    if(parameter == 'current') {
      unidade = "A";
    }
  
    // Tensão
    if(parameter == 'tension') {
      unidade = "V";
    }

    return unidade;
  }