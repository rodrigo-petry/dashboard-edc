import React from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Button,
  LoadingOverlay,
  Space,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { EnvelopeClosedIcon, LockClosedIcon } from "@modulz/radix-icons";

import { AuthRequest } from "@core/domain/Auth/Auth.types";
import { useAuthenticate } from "@core/domain/Auth/Auth.hooks";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const notifications = useNotifications();

  const authenticateMutation = useAuthenticate();

  const form = useForm({
    initialValues: {
      email: "",
      pass: "",
    },
    validationRules: {
      email: (value) => !!value,
      pass: (value) => !!value,
    },
  });

  const handleSubmit = async () => {
    if (form.validate()) {
      try {
        const values = form.values as AuthRequest;

        await authenticateMutation.mutateAsync(values);

        router.push("/dashboard");
      } catch (err) {
        notifications.showNotification({
          color: "red",
          title: "Não foi possível autenticar o seu usuário",
          message: "Favor inserir novamente o seu e-mail e senha.",
        });
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={false} />
      <TextInput
        id="email"
        required
        placeholder="Seu e-mail"
        label="E-Mail"
        icon={<EnvelopeClosedIcon />}
        value={form.values.email}
        onChange={(event) => {
          form.setFieldValue("email", event.currentTarget.value);
        }}
        onFocus={() => form.setFieldError("email", false)}
        error={form.errors.email && "Digite um e-mail válido"}
      />

      <PasswordInput
        id="password"
        required
        mt="sm"
        placeholder="Senha"
        label="Senha"
        icon={<LockClosedIcon />}
        value={form.values.pass}
        onChange={(event) => {
          form.setFieldValue("pass", event.currentTarget.value);
        }}
        onFocus={() => {
          form.setFieldError("pass", false);
        }}
        error={
          form.errors.pass &&
          "A senha deve conter 1 número, 1 letra e ao menos 6 caracteres"
        }
      />
      <Space h="md" />
      <Button
        type="submit"
        style={{ width: "100%" }}
        loading={authenticateMutation.isLoading}
      >
        Entrar
      </Button>
    </form>
  );
};

export default LoginForm;
