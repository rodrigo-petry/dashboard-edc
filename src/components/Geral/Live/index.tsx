import React, {useEffect , useState} from 'react';
import { Icon } from '@iconify/react';
import DefaultPropsInterface from "../DefaultPropsInterface";
import { Card, Grid, Group, Paper, Skeleton, Text, Title, createStyles } from '@mantine/core';

function Live({
    consumoLive,
    heightCard
}: DefaultPropsInterface) {
    const { classes, cx } = useStyles();

    return (
        <Skeleton visible={false}> 
           <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: heightCard }}>
                <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontSize: "21px", fontWeight: 700, color: '#000000', textAlign:'left'}}>
                    <div>
                    Potência Ativa Total instantânea
                    </div>    
                </Grid>
                
        
                <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{textAlign: 'center', paddingTop:20}} >
                   
                    <Grid.Col style={{ backgroundColor: '#EFFCFB', borderRadius: "6px", paddingBottom:40}}>
                        <Text className={ classes.subtitleText }>
                              {consumoLive.toLocaleString('pt-BR')} kWh
                        </Text>
                        
                    </Grid.Col>
                </Grid>
            </Card>
        </Skeleton>
    );
}

const useStyles = createStyles(() => {
    return {
        principalCell: {
            border: "3px #E38282 solid",
            borderRadius: "10px",
            padding: "15px 20px",
        },
        cell: {
            padding: "15px 20px",
        },
        titleText: {
            fontSize: "17px",
            marginBottom:"20px",
            color: "black"
        },
        subtitleText: {
            fontWeight: "bold",
            // marginBottom:"10px",
            marginTop:"40px",
            fontSize:"34px",
            color: "#00AEA3"
        },
        contentValue: {
            color: "black",
        },
        referenceText: {
            float:"right",
            fontSize: "14px",
            marginTop:"10px",
            fontWeight:"bold"
        },
        iconCustom: {
            fontSize: "60px",
            color: "orange",
            marginTop:"43px"
          },
    };
});

export default Live;