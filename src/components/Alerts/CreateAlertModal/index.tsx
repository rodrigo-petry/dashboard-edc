import { Modal } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

import { useCreateAlert } from "@core/domain/Alerts/Alerts.hooks";

import AlertForm, { AlertFormData } from "../AlertForm";
import { CreateAlertRequest } from "@core/domain/Alerts/Alerts.types";

interface CreateAlertModalProps {
  opened: boolean;
  onClose: () => void;
}

function CreateAlertModal({ opened, onClose }: CreateAlertModalProps) {
  const notifications = useNotifications();

  const mutation = useCreateAlert();

  const handleSubmit = async (values: AlertFormData) => {
    try {
      const obj: CreateAlertRequest = {
        ...values,
        meterId: +values.meterId,
        parameter: +values.parameter,
        notificationDestinations: values.notificationDestinations.map(
          (item) => +item
        ),
      };
      await mutation.mutateAsync(obj);

      notifications.showNotification({
        color: "brand",
        title: "Alerta cadastrado",
        message: "O alerta foi registrado com sucesso.",
      });

      onClose();
    } catch (err) {}
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Cadastrar Alerta">
      <AlertForm
        loading={mutation.isLoading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}

export default CreateAlertModal;
