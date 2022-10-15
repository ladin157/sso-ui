import { useTranslation } from "react-i18next";
import {
  CodeBlock,
  CodeBlockAction,
  EmptyState,
  EmptyStateBody,
  Title,
} from "@patternfly/react-core";

import type UserRepresentation from "@sso/sso-admin-client/lib/defs/userRepresentation";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { SsoTextArea } from "../../components/sso-text-area/SsoTextArea";

type GeneratedCodeTabProps = {
  user?: UserRepresentation;
  text: string;
  label: string;
};

export const GeneratedCodeTab = ({
  text,
  user,
  label,
}: GeneratedCodeTabProps) => {
  const { t } = useTranslation("clients");

  return user ? (
    <CodeBlock
      id={label}
      actions={
        <CodeBlockAction>
          <CopyToClipboardButton id="code" text={text} label={label} />
        </CodeBlockAction>
      }
    >
      <SsoTextArea id={`text-area-${label}`} rows={20} value={text} />
    </CodeBlock>
  ) : (
    <EmptyState variant="large">
      <Title headingLevel="h4" size="lg">
        {t(`${label}No`)}
      </Title>
      <EmptyStateBody>{t(`${label}IsDisabled`)}</EmptyStateBody>
    </EmptyState>
  );
};
