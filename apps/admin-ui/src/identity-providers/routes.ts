import type { RouteDef } from "../route-config";
import { IdentityProviderRoute } from "./routes/IdentityProvider";
import { IdentityProviderSsoOidcRoute } from "./routes/IdentityProviderSsoOidc";
import { IdentityProviderOidcRoute } from "./routes/IdentityProviderOidc";
import { IdentityProviderSamlRoute } from "./routes/IdentityProviderSaml";
import { IdentityProvidersRoute } from "./routes/IdentityProviders";
import { IdentityProviderAddMapperRoute } from "./routes/AddMapper";
import { IdentityProviderEditMapperRoute } from "./routes/EditMapper";
import { IdentityProviderCreateRoute } from "./routes/IdentityProviderCreate";

const routes: RouteDef[] = [
  IdentityProviderAddMapperRoute,
  IdentityProviderEditMapperRoute,
  IdentityProvidersRoute,
  IdentityProviderOidcRoute,
  IdentityProviderSamlRoute,
  IdentityProviderSsoOidcRoute,
  IdentityProviderCreateRoute,
  IdentityProviderRoute,
];

export default routes;
