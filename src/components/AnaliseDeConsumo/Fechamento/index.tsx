import { Text, Card, Skeleton, Grid, Title} from '@mantine/core'
import { createStyles } from "@mantine/styles";
import React, {useEffect , useState} from 'react';
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface';

import { useProfile } from '@core/domain/Dashboards/Dashboards.hooks';
import { IAnaliseDeConsumoFechamento } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.types';
import { getFechamento } from '@core/domain/AnaliseDeConsumo/AnaliseDeConsumo.service';

function Fechamento({
    idsMeters,
    initialDate,
    finalDate,
    timeout,
    heightCard 
}: DefaultPropsInterface) {
    const { classes, cx } = useStyles();
    const [state, setState] = useState(false);
    const currencyFormatter =  new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
  })
    const default_object =   {
      monetario: {
          diario: 0,
          semanal: 0,
          mensal: 0,
      },
      consumo: {
          diario: 0,
          semanal: 0,
          mensal: 0,
      },
      dia_de_fechamento: "",
      fechamento: "",
      total_mes_anterior_kwh: 0,
      total_mes_anterior_brl: 0
  }
    const [data, setData] = useState<IAnaliseDeConsumoFechamento>(
      default_object
    );


    const { data: profileData, isFetching: isFetchingProfile } = useProfile()


    async function getCarbon() {
      setData(default_object)
      if (profileData && idsMeters && idsMeters.length > 0){ 
       const result = await getFechamento(profileData[0].id, idsMeters)
       
       result && setData(result)
      }
    

    }   

    useEffect(() => {
        getCarbon()
      }, [profileData, idsMeters]);


      return( <Skeleton visible={false}> 
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
          <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontSize: "17px", marginLeft:"0px", marginBottom:"10px", color: '#000000'}}>
                <Grid.Col>
                <Title style={{ fontSize: 21, fontWeight: 700, marginBottom: 5 }}> Meta e fechamento (kWh e R$)</Title></Grid.Col> 
                
          </Grid>
            <Grid style={{marginBottom:10}}>
              <Grid.Col span={1} offset={0} style={{marginRight:70}} onClick={()=>{ setState(false)}}>
              <svg width="93" height="30" viewBox="0 0 93 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="93" height="30" rx="6" fill={!state ? '#00AEA3': '#F9F9F9'}/>
              <path d="M21.4396 21V9.8H28.7516V11.448H23.4876V14.52H28.2716V16.12H23.4876V19.352H28.7516V21H21.4396ZM30.6416 21V13.064H32.4496L32.6256 14.136C32.8816 13.752 33.2176 13.448 33.6336 13.224C34.0602 12.9893 34.5509 12.872 35.1056 12.872C36.3322 12.872 37.2016 13.3467 37.7136 14.296C38.0016 13.8587 38.3856 13.512 38.8656 13.256C39.3562 13 39.8896 12.872 40.4656 12.872C41.5002 12.872 42.2949 13.1813 42.8496 13.8C43.4042 14.4187 43.6816 15.3253 43.6816 16.52V21H41.6336V16.712C41.6336 16.0293 41.5002 15.5067 41.2336 15.144C40.9776 14.7813 40.5776 14.6 40.0336 14.6C39.4789 14.6 39.0309 14.8027 38.6896 15.208C38.3589 15.6133 38.1936 16.1787 38.1936 16.904V21H36.1456V16.712C36.1456 16.0293 36.0122 15.5067 35.7456 15.144C35.4789 14.7813 35.0682 14.6 34.5136 14.6C33.9696 14.6 33.5269 14.8027 33.1856 15.208C32.8549 15.6133 32.6896 16.1787 32.6896 16.904V21H30.6416ZM49.4384 21V9.48H51.4864V16.28L54.3024 13.064H56.7344L53.4864 16.68L57.2624 21H54.7024L51.4864 17.016V21H49.4384ZM60.8522 21L57.8922 9.8H60.0842L62.1002 18.712L64.4682 9.8H66.7242L69.0282 18.712L71.0442 9.8H73.2522L70.2122 21H67.7802L65.5562 12.696L63.2682 21H60.8522Z" fill={!state ? 'white': '#B9B9B9'}/>
              </svg>

              </Grid.Col>

              <Grid.Col span={1} offset={0} style={{marginRight:70}} onClick={()=>{ setState(true) }} >
                  <svg width="93" height="30" viewBox="0 0 93 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="93" height="30" rx="6" fill={state ? '#00AEA3': '#F9F9F9'}/>
                  <path d="M24.3068 21V9.8H31.6188V11.448H26.3548V14.52H31.1388V16.12H26.3548V19.352H31.6188V21H24.3068ZM33.5088 21V13.064H35.3168L35.4928 14.136C35.7488 13.752 36.0848 13.448 36.5008 13.224C36.9274 12.9893 37.4181 12.872 37.9728 12.872C39.1994 12.872 40.0688 13.3467 40.5808 14.296C40.8688 13.8587 41.2528 13.512 41.7328 13.256C42.2234 13 42.7568 12.872 43.3328 12.872C44.3674 12.872 45.1621 13.1813 45.7168 13.8C46.2714 14.4187 46.5488 15.3253 46.5488 16.52V21H44.5008V16.712C44.5008 16.0293 44.3674 15.5067 44.1008 15.144C43.8448 14.7813 43.4448 14.6 42.9008 14.6C42.3461 14.6 41.8981 14.8027 41.5568 15.208C41.2261 15.6133 41.0608 16.1787 41.0608 16.904V21H39.0128V16.712C39.0128 16.0293 38.8794 15.5067 38.6128 15.144C38.3461 14.7813 37.9354 14.6 37.3808 14.6C36.8368 14.6 36.3941 14.8027 36.0528 15.208C35.7221 15.6133 35.5568 16.1787 35.5568 16.904V21H33.5088ZM52.3536 21V9.8H56.4656C57.3616 9.8 58.0976 9.95467 58.6736 10.264C59.2603 10.5627 59.6976 10.9733 59.9856 11.496C60.2736 12.008 60.4176 12.5787 60.4176 13.208C60.4176 13.8907 60.2363 14.5147 59.8736 15.08C59.5216 15.6453 58.967 16.056 58.2096 16.312L60.5296 21H58.1776L56.0976 16.584H54.4016V21H52.3536ZM54.4016 15.08H56.3376C57.0203 15.08 57.5216 14.9147 57.8416 14.584C58.1616 14.2533 58.3216 13.816 58.3216 13.272C58.3216 12.7387 58.1616 12.312 57.8416 11.992C57.5323 11.672 57.0256 11.512 56.3216 11.512H54.4016V15.08ZM65.4584 22.392V21.16C64.4237 21.0427 63.581 20.68 62.9304 20.072C62.2797 19.464 61.9437 18.648 61.9224 17.624H64.0824C64.1037 18.0507 64.2317 18.424 64.4664 18.744C64.7117 19.064 65.0424 19.2827 65.4584 19.4V16.024C65.3624 15.992 65.261 15.96 65.1544 15.928C65.0584 15.896 64.957 15.864 64.8504 15.832C63.9864 15.5333 63.325 15.1493 62.8664 14.68C62.4184 14.2107 62.1944 13.5867 62.1944 12.808C62.1837 11.8907 62.4824 11.1547 63.0904 10.6C63.6984 10.0347 64.4877 9.70933 65.4584 9.624V8.328H66.5304V9.64C67.4904 9.736 68.2637 10.072 68.8504 10.648C69.4477 11.2133 69.7624 11.944 69.7944 12.84H67.6024C67.5917 12.5307 67.4904 12.248 67.2984 11.992C67.117 11.7253 66.861 11.5387 66.5304 11.432V14.408C66.6157 14.44 66.701 14.472 66.7864 14.504C66.8717 14.5253 66.957 14.552 67.0424 14.584C67.597 14.776 68.1037 15 68.5624 15.256C69.021 15.512 69.389 15.8533 69.6664 16.28C69.9437 16.696 70.0824 17.2347 70.0824 17.896C70.0824 18.4507 69.9437 18.968 69.6664 19.448C69.3997 19.928 68.9997 20.328 68.4664 20.648C67.9437 20.9573 67.2984 21.1333 66.5304 21.176V22.392H65.4584ZM64.3384 12.664C64.3384 13.0053 64.4397 13.2827 64.6424 13.496C64.845 13.6987 65.117 13.8747 65.4584 14.024V11.368C65.1277 11.432 64.8557 11.576 64.6424 11.8C64.4397 12.024 64.3384 12.312 64.3384 12.664ZM67.9064 18.04C67.9064 17.6133 67.7784 17.2773 67.5224 17.032C67.2664 16.7867 66.9357 16.5787 66.5304 16.408V19.448C66.957 19.384 67.293 19.2293 67.5384 18.984C67.7837 18.7387 67.9064 18.424 67.9064 18.04Z" fill={!state ? '#B9B9B9': 'white'}/>
                  </svg>

                  
              </Grid.Col>
          </Grid>
           <Grid style={{marginTop:"2px"}} >
            
               <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
          <Text className={classes.descriptionFont}>{ (data && data.monetario.diario && data.consumo.diario) && (state ? currencyFormatter.format(data.monetario.diario): data.consumo.diario.toFixed() +  ' kWh' ) }</Text>
          </Grid.Col>
          <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                    <Text className={classes.descriptionFont}>{(data && data.monetario.semanal && data.consumo.semanal) && (state ?  currencyFormatter.format(data.monetario.semanal): data.consumo.semanal.toFixed() +  ' kWh' ) }</Text>
          </Grid.Col>
          <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                    <Text className={classes.descriptionFont}>{(data && data.monetario.semanal && data.consumo.mensal) && (state ?  currencyFormatter.format(data.monetario.mensal) : data.consumo.mensal.toFixed() +  ' kWh' ) }</Text>
          </Grid.Col>
</Grid>
<Grid>
     
    <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
              <Text className={classes.descriptionFont} style={{fontSize: 14}}>Diária</Text>
    </Grid.Col>
    <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
              <Text className={classes.descriptionFont}  style={{fontSize: 14}}>Semanal</Text>
    </Grid.Col>
    <Grid.Col span={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
              <Text className={classes.descriptionFont}  style={{fontSize: 14}}>Mensal</Text>
    </Grid.Col>

    </Grid>
      <Grid>
            <Grid.Col span={6}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                  <Text className={classes.descriptionFont}  style={{color: 'black', fontSize: 16, marginBottom:10, marginTop:10}}>Fechamento</Text>
        </Grid.Col>

        <Grid.Col span={6}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                  <Text className={classes.descriptionFont}  style={{color: 'black', fontSize: 16, marginBottom:10, marginTop:10}}>Total do mês anterior</Text>
        </Grid.Col>
      </Grid>

    <Grid>
          <Grid.Col span={6} md={5}  style={{backgroundColor: '#EFFCFB', padding: "15px 20px", marginRight:20, borderRadius: 6 }}   >
            <Grid >
                <Grid.Col  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                <Text className={classes.descriptionFont}  style={{ fontSize: 28}}>{data && data.fechamento}</Text>
                </Grid.Col>
                <Grid.Col  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                <Text className={classes.descriptionFont}  style={{ fontSize: 17, color: '#B9B9B9'}}>({data && data.consumo.mensal} kWh)</Text>
                </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={6} md={5} style={{backgroundColor: '#EFFCFB', padding: "15px 20px", borderRadius: 6}}>
              <Grid >
                    <Grid.Col  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                    <Text className={classes.descriptionFont}  style={{ fontSize: 28}}>R${ data && data.total_mes_anterior_brl}</Text>
                    </Grid.Col>
                    <Grid.Col  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                    <Text className={classes.descriptionFont}  style={{fontSize: 17, color: '#B9B9B9'}}>({data && data.total_mes_anterior_kwh} kWh)</Text>
                    </Grid.Col>
              </Grid>
          </Grid.Col>

    </Grid>
      
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
        fontSize: "25px",
        color: "#00AEA3",
        fontWeight: '700',
        lineHeight: '36.46px'
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

export default Fechamento