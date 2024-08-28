import { useRouter } from 'next/router';
import { Modal } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import dayjs from 'dayjs';

import {
  Monitor,
  UpdateMonitorRequest,
} from '@core/domain/Monitors/Monitors.types';
import { useUpdateMonitor } from '@core/domain/Monitors/Monitors.hooks';

import MonitorDataForm, { MonitorFormData } from '../MonitorDataForm';

interface UpdateMonitorDataModalProps {
  opened: boolean;
  onClose: () => void;
  monitor?: Monitor;
}

function UpdateMonitorDataModal({
  onClose,
  opened,
  monitor,
}: UpdateMonitorDataModalProps) {
  const notifications = useNotifications();
  const { monitorId } = useRouter().query;

  const mutation = useUpdateMonitor();

  const onSubmit = async (values: MonitorFormData) => {
    const obj: UpdateMonitorRequest = {
      ...values,
      meterId: +(monitorId || 0),
      startRushHour: dayjs(values.startRushHour).format('HH:mm'),
      endRushHour: dayjs(values.endRushHour).format('HH:mm'),
    };

    await mutation.mutateAsync(obj);

    notifications.showNotification({
      color: 'brand',
      title: 'Monitor editado',
      message: 'O monitor foi editado com sucesso.',
    });

    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Editar dados do monitor">
      <MonitorDataForm
        monitor={monitor}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={mutation.isLoading}
      />
    </Modal>
  );
}

export default UpdateMonitorDataModal;
