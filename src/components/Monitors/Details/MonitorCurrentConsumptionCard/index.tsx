import { Monitor } from '@core/domain/Monitors/Monitors.types'
import { useCurrentConsumption } from '@core/domain/Proxies/Proxies.hooks'
import { Icon } from '@iconify/react'
import { Card, createStyles, Grid, Group, Skeleton, Text } from '@mantine/core'
import { metricPrefixFormatter } from '@utils/metricPrefix'

const useStyle = createStyles(theme => ({
  wrapper: {
    // backgroundColor:
    //   theme.colorScheme === 'dark'
    //     ? theme.colors.dark[4]
    //     : theme.colors.gray[2],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  iconCustom: {
    fontSize: "60px",
    color: "orange",
    marginTop:"43px"
  },
  subtitleText: {
    fontWeight: "bold",
    marginBottom:"10px",
    marginTop:"50px",
    fontSize:"40px",
    color: "#00AEA3"
},
titleText: {
  fontSize: "17px",
  marginBottom:"20px",
  color: "black"
},
}))

interface MonitorCurrentConsumptionCardProps {
  monitor?: Monitor
}

function MonitorCurrentConsumptionCard({
  monitor
}: MonitorCurrentConsumptionCardProps) {
  const { classes } = useStyle()

  const { data, isLoading } = useCurrentConsumption(monitor?.meterId)

  return (
    <Skeleton visible={isLoading} style={{ height: '100%' }}>
      <Card className={classes.wrapper}>
        {/* <Text weight="bold" size="lg">
          Potência Instantânea
        </Text>
        <Text style={{ fontSize: '2.5em' }} weight="800">
          {data?.consumo ? metricPrefixFormatter(data.consumo) : 0} W
        </Text> */}
        <Grid className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} style={{ fontSize: "16px", marginLeft:"16px"}}>
        <Text weight="bold" size="lg">
          Potência Instantânea
        </Text> 
                </Grid>
                
        
                <Grid >
                    <Grid.Col span={12} md={2}  className={"mantine-Group-root mantine-Title-root mantine-5bhg3d"} >
                        < Icon icon="fluent-emoji-high-contrast:electric-plug"  className={classes.iconCustom} />
                    </Grid.Col>
                    <Grid.Col span={12} md={8} >
                        <Text  className={classes.subtitleText}>
                        {data?.consumo ? metricPrefixFormatter(data.consumo) : 0} W
                        </Text>
                        
                    </Grid.Col>
                </Grid>
      </Card>
    </Skeleton>
  )
}

export default MonitorCurrentConsumptionCard
