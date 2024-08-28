import {Skeleton,Group, Grid, Space} from '@mantine/core'
import { createStyles } from "@mantine/styles";
import React from 'react';
import DefaultPropsInterface from 'components/Geral/DefaultPropsInterface';
import Image from "next/image";
import Moment from 'moment';
import {getMonth} from '@utils/getMonth';
import NotificationDropdown from "@components/Layout/PrivateLayout/Header/NotificationDropdown";
import UserMenu from "@components/Layout/PrivateLayout/Header/UserMenu";
import { FullLogo } from '@components/Layout/LogoLayout';

const useStyles = createStyles((theme) => {  
    return {
      image: {
        width: "150px",
        display: "inline-block",
        marginRight:"16px",
      },
      parceiro: {
        width: "100px",
        display: "inline-block",
        marginLeft:"20px",
      },
      spaceTop: {
        marginTop: "10px",
      },
      iconSpace: {
        marginRight:"-13px"
      },
      hr: {
        height: "55px",
        borderRight: "1px solid  #C8C8C8",
        display: "inline-block",
      },
      actions: {
        display: "flex",
        float: "right"
      },
    };
});

function Header({
    cidade,
    estado,
    distribuidora,
    bandeira,
    updateAt
}: DefaultPropsInterface) {
    
    const { classes } = useStyles();
 
    return (
        <Skeleton visible={false}>
        <Grid>
            {true ? (
            <>
                <Grid.Col span={12} md={4} style={{marginRight:"-10px"}}>
                    <div className={classes.image}>
                        {/* <FullLogo /> */}
                    </div> 
                    
                </Grid.Col>
              
                <Grid.Col span={12} md={4} className={classes.spaceTop} >
                    {/* <Group className={"mantine-Title-root mantine-1a5ts6o"} style={{ fontSize: "16px", float:"right" }}>
                       {cidade} ({estado}), { Moment().format('DD')} de { getMonth(Moment().format('MM'))} 
                    </Group> <br></br>
                    <Group style={{ fontSize: "14px",  float:"right", marginTop:"-5px" }}>    
                        Última atualização: {updateAt}
                    </Group>     */}
                </Grid.Col>
                <Grid.Col span={12} md={2} className={classes.spaceTop} style={{paddingLeft: "22px"}}>
                    {/* <Group className={"mantine-Title-root mantine-1a5ts6o"} style={{ fontSize: "16px"}}>
                        {distribuidora}
                    </Group>
                    <Group style={{ fontSize: "14px", marginTop:"-5px"}}>    
                        {bandeira}
                    </Group> */}
                </Grid.Col>
                <Grid.Col span={12} md={2} className={classes.spaceTop} >
                <div className={classes.actions}>
                    {/* <NotificationDropdown /> */}
                    <Space w="md" />
                    {/* <UserMenu /> */}
                </div>
                </Grid.Col>    
            </>) : (<Group></Group>)}
        </Grid>
        </Skeleton>
    );
}

export default Header