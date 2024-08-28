import { Modal } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

import { useUpdateAlert } from "@core/domain/Alerts/Alerts.hooks";
import { Alert, UpdateAlertRequest } from "@core/domain/Alerts/Alerts.types";

import AlertForm, { AlertFormData } from "../AlertForm";

interface UpdateAlertModalProps {
  opened: boolean;
  onClose: () => void;
  alert?: Alert;
}

function UpdateAlertModal({ opened, onClose, alert }: UpdateAlertModalProps) {
  const notifications = useNotifications();

  const mutation = useUpdateAlert();

  const handleSubmit = async (values: AlertFormData) => {
    try {
      if (!alert) return;

      const obj: UpdateAlertRequest = {
        ...values,
        id: +alert?.id,
        meterId: +values.meterId,
        parameter: +values.parameter,
        notificationDestinations: values.notificationDestinations.map(
          (item) => +item
        ),
      };

      await mutation.mutateAsync(obj);

      notifications.showNotification({
        color: "brand",
        title: "Alerta editado",
        message: "O alerta foi editado com sucesso.",
      });

      onClose();
    } catch (err) {}
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Editar Alerta">
      <AlertForm
        submitLabel="Editar"
        loading={mutation.isLoading}
        onSubmit={handleSubmit}
        onCancel={onClose}
        alert={alert}
      />
    </Modal>
  );
}

export default UpdateAlertModal;
