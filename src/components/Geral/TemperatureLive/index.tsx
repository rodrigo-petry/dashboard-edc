import {Skeleton, Group, Card, Text,Grid} from '@mantine/core'
import { createStyles } from "@mantine/styles";
import React from 'react';
import DefaultPropsInterface from '@components/Geral/DefaultPropsInterface';

import { Icon } from '@iconify/react';

import {
    FaThermometerHalf,
} from 'react-icons/fa';


function TemperatureLive({
    heightCard,
    temperature,
    humidity,
    title,
    subtitle
}: DefaultPropsInterface) {
    
    const { classes } = useStyles();

    return( <Skeleton visible={false}> 
       <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
            <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontSize: "16px"}}>
                <div>
                 { title}
                </div>    
            </Grid>
           
          <Grid style={{marginTop:"11px"}}>
              <Grid.Col span={12} md={2}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                <Icon icon="carbon:humidity"  className={classes.iconCustom} />
              </Grid.Col>
              <Grid.Col span={12} md={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                  <Group className={classes.center}>{ humidity ? Math.trunc(humidity) + '' : '-'}% </Group>
              </Grid.Col>
              <Grid.Col span={12} md={2}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                <Icon icon="clarity:thermometer-line"  className={classes.iconTemperature} /> 
              </Grid.Col>
              <Grid.Col span={12} md={4}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                  <Group className={classes.center}>{temperature ? Math.trunc(temperature) : '-'}° </Group>
              </Grid.Col>
          </Grid>
          <Grid >  
              <Grid.Col span={12} md={12} className={classes.spaceTop} >
                <Group style={{ float:"right", fontSize: "12px",marginRight:"16px", fontWeight:"bold" }}>
                  {subtitle}
                </Group>
              </Grid.Col>  
          </Grid>
       </Card>
    </Skeleton>
    )  
}

const useStyles = createStyles(() => {  
    return {
      iconCustom: {
        fontSize: "60px",
        color: "#1E90FF",
      },
      iconTemperature: {
        fontSize: "50px",
        color: "#FF0000	",
      },
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
      center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
    };
  });

export default TemperatureLive