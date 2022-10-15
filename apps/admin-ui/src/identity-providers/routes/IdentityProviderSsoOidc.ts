import { lazy } from "react";
import type { Path } from "react-router-dom-v5-compat";
import { generatePath } from "react-router-dom-v5-compat";
import type { RouteDef } from "../../route-config";

export type IdentityProviderSsoOidcParams = { realm: string };

export const IdentityProviderSsoOidcRoute: RouteDef = {
  path: "/:realm/identity-providers/sso-oidc/add",
  component: lazy(() => import("../add/AddOpenIdConnect")),
  breadcrumb: (t) => t("identity-providers:addSsoOpenIdProvider"),
  access: "manage-identity-providers",
};

export const toIdentityProviderSsoOidc = (
  params: IdentityProviderSsoOidcParams
): Partial<Path> => ({
  pathname: generatePath(IdentityProviderSsoOidcRoute.path, params),
});
