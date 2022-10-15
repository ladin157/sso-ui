import { forwardRef, MutableRefObject, Ref, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, InputGroup } from "@patternfly/react-core";
import { EyeIcon, EyeSlashIcon } from "@patternfly/react-icons";

import {
  SsoTextInput,
  SsoTextInputProps,
} from "../sso-text-input/SsoTextInput";

type PasswordInputProps = SsoTextInputProps & {
  hasReveal?: boolean;
};

const PasswordInputBase = ({
  hasReveal = true,
  innerRef,
  ...rest
}: PasswordInputProps) => {
  const { t } = useTranslation("common-help");
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <InputGroup>
      <SsoTextInput
        {...rest}
        type={hidePassword ? "password" : "text"}
        ref={innerRef}
      />
      {hasReveal && (
        <Button
          variant="control"
          aria-label={t("showPassword")}
          onClick={() => setHidePassword(!hidePassword)}
        >
          {hidePassword ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
      )}
    </InputGroup>
  );
};

export const PasswordInput = forwardRef(
  (props: PasswordInputProps, ref: Ref<HTMLInputElement>) => (
    <PasswordInputBase {...props} innerRef={ref as MutableRefObject<any>} />
  )
);
PasswordInput.displayName = "PasswordInput";
