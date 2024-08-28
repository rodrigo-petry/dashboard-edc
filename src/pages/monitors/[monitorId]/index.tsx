import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Col, Grid, Text } from "@mantine/core";

import { MonitorsQuery } from "@core/domain/Monitors/Monitors.types";
import { useMonitors } from "@core/domain/Monitors/Monitors.hooks";

import { usePageTitle } from "@contexts/PageTitleContextProvider";

import MonitorsQueryForm from "@components/Monitors/MonitorsQueryForm";
import UpdateMonitorDataModal from "@components/Monitors/UpdateMonitorDataModal";
import MonitorMetadataCard from "@components/Monitors/Details/MonitorMetadataCard";
import MonitorGaugesCard from "@components/Monitors/Details/MonitorGaugesCard";
import MonitorCurrentConsumptionCard from "@components/Monitors/Details/MonitorCurrentConsumptionCard";
import MonitorDetailsTabs from "@components/Monitors/Details/MonitorDetailsTabs";
import MonitorMeasuresCard from "@components/Monitors/Details/MonitorMeasuresCard";
import {listMonitorsNovoSmart} from '@core/domain/Geral/Geral.service';
 

function MonitorDetailsPage() {
  const router = useRouter();
  usePageTitle("Detalhes do monitor");
  const [mostrarSomenteDadosBasicos, setMostrarSomenteDadosBasicos] = useState<boolean>(true);


  async function  getNovoSmart(medidorId: any)
  {
     const medidoresNovoSmart = await listMonitorsNovoSmart();

     if(medidorId) {
        setMostrarSomenteDadosBasicos(medidoresNovoSmart.includes(parseFloat(medidorId)));
     }
  }

  const [updateMonitorModalOpen, setUpdateMonitorModalOpen] = useState(false);

  const { data, refetch } = useMonitors();

  const monitor = data?.find(
    (item) => item.meterId.toString() === router.query.monitorId
  );

  useEffect(() => {
      getNovoSmart(monitor?.meterId);
  }, [monitor]);

  const handleCreateModalClose = () => {
    refetch();

    setUpdateMonitorModalOpen(false);
  };

  return monitor ? (
    <>
      <Grid gutter="xl">
        <Col xs={12} sm={12} md={6} lg={6} xl={4} span={4}>
          <MonitorMetadataCard
            monitor={monitor}
            onEditClick={() => setUpdateMonitorModalOpen(true)}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={4} span={4}>    
          <MonitorGaugesCard monitor={monitor} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} xl={4} span={4}>
          <MonitorCurrentConsumptionCard monitor={monitor} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={8} xl={4} span={4}>
          <MonitorMeasuresCard monitor={monitor} mostrarSomenteDadosBasicos={mostrarSomenteDadosBasicos} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={8} span={8}>
          <MonitorDetailsTabs meter={monitor}  mostrarSomenteDadosBasicos={mostrarSomenteDadosBasicos}/>
        </Col>
      </Grid>

      <UpdateMonitorDataModal
        opened={updateMonitorModalOpen}
        onClose={() => handleCreateModalClose()}
        monitor={monitor}
      />
    </>
  ) : (
    <div>Carregando...</div>
  );
}

export default MonitorDetailsPage;
