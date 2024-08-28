import {Group, Text, Card, Skeleton, Grid} from '@mantine/core'
import { createStyles } from "@mantine/styles";
import React, {useEffect , useState} from 'react';
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface';
import CarbonEmissionInterface from '@components/Geral/CarbonEmission/CarbonEmissionInterface'
import { Icon } from '@iconify/react';
import {getCarbonEmission} from '@core/domain/Geral/Geral.service'

function CarbonEmission({
    idsMeters,
    initialDate,
    finalDate,
    timeout,
    heightCard
}: DefaultPropsInterface) {
    const { classes, cx } = useStyles();
    const [dataMensal, setDataMensal] = useState<CarbonEmissionInterface>({
        "carbono": 0,
        "unidade_carbono": "",
        "replantio": 0,
    });
    const [dataAnual, setDataAnual] = useState<CarbonEmissionInterface>({
      "carbono": 0,
      "unidade_carbono": "",
      "replantio": 0,
  });
    const [anual, setAnual] = useState()
    const [mensal, setMensal] = useState();
    const currencyFormatter =  new Intl.NumberFormat('pt-br')
    const getCarbon = (
        idsMeters:Array<string|number>|null,
        initialDate:string,
        finalDate:string
      ) =>  {
        const today = new Date();
        const priorDateMensal = new Date(today.setDate(today.getDate() - 30));
       
        const priorDateAnual = new Date(today.setDate(today.getDate() - 365));
      
        const now = new Date();
        getCarbonEmission(idsMeters,priorDateMensal.toISOString(),now.toISOString()).then(function (response) {
          setDataAnual({
            "carbono": response?.carbono,
            "unidade_carbono": response?.unidade_carbono,
            "replantio": response?.replantio_equivalente,
          })
        });

        getCarbonEmission(idsMeters,priorDateAnual.toISOString(),now.toISOString()).then(function (response) {
          setDataMensal({
            "carbono": response?.carbono,
            "unidade_carbono": response?.unidade_carbono,
            "replantio": response?.replantio_equivalente,
          })
        });
    }   
  
    useEffect(() => {

        getCarbon(idsMeters, initialDate,finalDate)
        const timer = setInterval(() => {
          getCarbon(idsMeters, initialDate,finalDate)
        }, timeout);

        return () => {
          clearInterval(timer);
        };

      }, [idsMeters, timeout]);


      return( <Skeleton visible={false}> 
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
          <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontFamily: 'DM Sans', fontSize: 21, fontWeight:700, marginLeft:"7px", marginBottom:"5px", color: '#000000'}}>
                Ação ESG
          </Grid>
           <Grid style={{marginTop:"0px"}} >
            
               <Grid.Col span={12} md={8}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{marginLeft:10}}>
            <Grid gutter={0}> 
              <Grid.Col span={2}>
               <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 28.5C5.68629 28.5 3 25.8137 3 22.5C3 19.7036 4.91298 17.3541 7.50166 16.6886C7.50056 16.6259 7.5 16.563 7.5 16.5C7.5 10.701 12.201 6 18 6C23.4148 6 27.8723 10.0987 28.4391 15.3629C31.0926 16.2721 33 18.7883 33 21.75C33 25.4779 29.9779 28.5 26.25 28.5C20.6413 28.5 15.2815 28.5 9 28.5Z" stroke="#00AEA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>    </Grid.Col>
<Grid.Col span={8}  >
<Text  className={classes.descriptionFont}  style={{marginTop:6,marginLeft:6, fontWeight:700}} >CO2 Equivalente emitido</Text>
</Grid.Col>
</Grid>
</Grid.Col>
</Grid>
<Grid style={{marginLeft:0}}>
      <Grid.Col span={4}>
      <Text style={{fontWeight: 700, color: "#00AEA3", fontSize: 34}}>
  { (dataMensal && dataMensal?.carbono &&  dataMensal?.unidade_carbono)  ? `${ currencyFormatter.format(parseFloat(dataMensal.carbono.toFixed(1))) + ''+ dataMensal?.unidade_carbono?.toLowerCase()}` : '-'}
</Text>
<Text  style={{fontWeight:700, color: "#B0B0B0", fontSize: 16}}>mensal</Text>

      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={4}>
            <Text style={{fontWeight: 700, color: "#00AEA3", fontSize: 34}}>
  { (dataAnual && dataAnual?.carbono &&  dataAnual?.unidade_carbono)  ? `${currencyFormatter.format(parseFloat(dataAnual.carbono.toFixed(1)))+ ''+ dataAnual?.unidade_carbono?.toLowerCase()}` : '-'}
</Text>
<Text  style={{fontWeight:700, color: "#B0B0B0", fontSize: 16}}>anual</Text>
      </Grid.Col>

    </Grid>
    <Group style={{ marginTop: 20, marginLeft: 10 }}>
  <Icon icon="entypo:tree" style={{ width: 36, height: 36, color: '#00AEA3' }} />
  <Text className={classes.descriptionFont} style={{marginTop:6, fontWeight:700}}>Replantio Equivalente</Text>
</Group>
<Group style={{ marginTop: 14, marginLeft: 10 }} >
  <Text style={{ alignSelf:'left', fontSize: 29, fontWeight: 700, color: '#00AEA3' }}>
    {dataAnual && dataAnual.replantio ? currencyFormatter.format(parseFloat(dataAnual.replantio.toFixed(1))) : '-'}
  </Text>
  <Text style={{ fontSize: 16, fontWeight: 700, color: '#B0B0B0', marginTop:0 }}>Árvores por ano</Text>
</Group>

        </Card>
     </Skeleton>
     )  
}

const useStyles = createStyles(() => {  
    return {
      spaceTop: {
        marginTop: "10px"
      },
      textValue: {
        color:"#00AEA3",
        fontWeight: "bold",
        fontSize: "18px",
      },
      defaultFont: {
        fontSize: "16px",
      },
      descriptionFont: {
        fontSize: "14px",
        color: "#000",
        fontWeight: '500'
      },
      iconCustom: {
        fontSize: "23px",
        marginTop: "-15px"
      },
      iconClass: {
        fontSize: "80px",
        color: "#000",
        marginTop: "-15px"
      },
      iconClassArvore: {
        fontSize: "80px",
      },
      center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop:"-10px",
      },
    };
});

export default CarbonEmission