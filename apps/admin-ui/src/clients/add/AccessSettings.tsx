import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup } from "@patternfly/react-core";

import type ClientRepresentation from "@sso/sso-admin-client/lib/defs/clientRepresentation";
import type { ClientSettingsProps } from "../ClientSettings";
import { MultiLineInput } from "../../components/multi-line-input/MultiLineInput";
import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { SsoTextInput } from "../../components/sso-text-input/SsoTextInput";
import { SaveReset } from "../advanced/SaveReset";
import environment from "../../environment";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useAccess } from "../../context/access/Access";
import { convertAttributeNameToForm } from "../../util";

export const AccessSettings = ({
  client,
  save,
  reset,
}: ClientSettingsProps) => {
  const { t } = useTranslation("clients");
  const { register, watch } = useFormContext<ClientRepresentation>();
  const { realm } = useRealm();

  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || client.access?.configure;

  const protocol = watch("protocol");
  const idpInitiatedSsoUrlName: string = watch(
    "attributes.saml_idp_initiated_sso_url_name"
  );

  return (
    <FormAccess
      isHorizontal
      fineGrainedAccess={client.access?.configure}
      role="manage-clients"
    >
      {!client.bearerOnly && (
        <>
          <FormGroup
            label={t("rootUrl")}
            fieldId="kc-root-url"
            labelIcon={
              <HelpItem
                helpText="clients-help:rootURL"
                fieldLabelId="clients:rootUrl"
              />
            }
          >
            <SsoTextInput
              type="text"
              id="kc-root-url"
              name="rootUrl"
              ref={register}
            />
          </FormGroup>
          <FormGroup
            label={t("homeURL")}
            fieldId="kc-home-url"
            labelIcon={
              <HelpItem
                helpText="clients-help:homeURL"
                fieldLabelId="clients:homeURL"
              />
            }
          >
            <SsoTextInput
              type="text"
              id="kc-home-url"
              name="baseUrl"
              ref={register}
            />
          </FormGroup>
          <FormGroup
            label={t("validRedirectUri")}
            fieldId="kc-redirect"
            labelIcon={
              <HelpItem
                helpText="clients-help:validRedirectURIs"
                fieldLabelId="clients:validRedirectUri"
              />
            }
          >
            <MultiLineInput
              name="redirectUris"
              aria-label={t("validRedirectUri")}
              addButtonLabel="clients:addRedirectUri"
            />
          </FormGroup>
          <FormGroup
            label={t("validPostLogoutRedirectUri")}
            fieldId="kc-postLogoutRedirect"
            labelIcon={
              <HelpItem
                helpText="clients-help:validPostLogoutRedirectURIs"
                fieldLabelId="clients:validPostLogoutRedirectUri"
              />
            }
          >
            <MultiLineInput
              name={convertAttributeNameToForm(
                "attributes.post.logout.redirect.uris"
              )}
              aria-label={t("validPostLogoutRedirectUri")}
              addButtonLabel="clients:addPostLogoutRedirectUri"
            />
          </FormGroup>
          {protocol === "saml" && (
            <>
              <FormGroup
                label={t("idpInitiatedSsoUrlName")}
                fieldId="idpInitiatedSsoUrlName"
                labelIcon={
                  <HelpItem
                    helpText="clients-help:idpInitiatedSsoUrlName"
                    fieldLabelId="clients:idpInitiatedSsoUrlName"
                  />
                }
                helperText={
                  idpInitiatedSsoUrlName !== "" &&
                  t("idpInitiatedSsoUrlNameHelp", {
                    url: `${environment.authServerUrl}/realms/${realm}/protocol/saml/clients/${idpInitiatedSsoUrlName}`,
                  })
                }
              >
                <SsoTextInput
                  type="text"
                  id="idpInitiatedSsoUrlName"
                  name="attributes.saml_idp_initiated_sso_url_name"
                  ref={register}
                />
              </FormGroup>
              <FormGroup
                label={t("idpInitiatedSsoRelayState")}
                fieldId="idpInitiatedSsoRelayState"
                labelIcon={
                  <HelpItem
                    helpText="clients-help:idpInitiatedSsoRelayState"
                    fieldLabelId="clients:idpInitiatedSsoRelayState"
                  />
                }
              >
                <SsoTextInput
                  type="text"
                  id="idpInitiatedSsoRelayState"
                  name="attributes.saml_idp_initiated_sso_relay_state"
                  ref={register}
                />
              </FormGroup>
              <FormGroup
                label={t("masterSamlProcessingUrl")}
                fieldId="masterSamlProcessingUrl"
                labelIcon={
                  <HelpItem
                    helpText="clients-help:masterSamlProcessingUrl"
                    fieldLabelId="clients:masterSamlProcessingUrl"
                  />
                }
              >
                <SsoTextInput
                  type="text"
                  id="masterSamlProcessingUrl"
                  name="adminUrl"
                  ref={register}
                />
              </FormGroup>
            </>
          )}
          {protocol !== "saml" && (
            <FormGroup
              label={t("webOrigins")}
              fieldId="kc-web-origins"
              labelIcon={
                <HelpItem
                  helpText="clients-help:webOrigins"
                  fieldLabelId="clients:webOrigins"
                />
              }
            >
              <MultiLineInput
                name="webOrigins"
                aria-label={t("webOrigins")}
                addButtonLabel="clients:addWebOrigins"
              />
            </FormGroup>
          )}
        </>
      )}
      {protocol !== "saml" && (
        <FormGroup
          label={t("adminURL")}
          fieldId="kc-admin-url"
          labelIcon={
            <HelpItem
              helpText="clients-help:adminURL"
              fieldLabelId="clients:adminURL"
            />
          }
        >
          <SsoTextInput
            type="text"
            id="kc-admin-url"
            name="adminUrl"
            ref={register}
          />
        </FormGroup>
      )}
      {client.bearerOnly && (
        <SaveReset
          className="sso__form_actions"
          name="settings"
          save={save}
          reset={reset}
          isActive={!isManager}
        />
      )}
    </FormAccess>
  );
};
