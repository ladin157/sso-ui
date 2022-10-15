import { useFormContext } from "react-hook-form";

import { FieldProps, FormGroupField } from "./FormGroupField";
import { SsoTextInput } from "../../components/sso-text-input/SsoTextInput";

export const TextField = ({ label, field, isReadOnly = false }: FieldProps) => {
  const { register } = useFormContext();
  return (
    <FormGroupField label={label}>
      <SsoTextInput
        type="text"
        id={label}
        data-testid={label}
        name={field}
        ref={register}
        isReadOnly={isReadOnly}
      />
    </FormGroupField>
  );
};
