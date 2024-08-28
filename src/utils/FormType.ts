export interface FormType<T> {
  values: T;
  errors: Record<keyof T, boolean>;
  validate: () => boolean;
  reset: () => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<keyof T, boolean>>>;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setFieldValue: <K extends keyof T, U extends T[K]>(
    field: K,
    value: U
  ) => void;
  setFieldError: (field: keyof T, error: boolean) => void;
  validateField: (field: keyof T) => void;
  resetErrors: () => void;
  onSubmit: (
    handleSubmit: (values: T) => any
  ) => (event?: React.FormEvent) => void;
}
