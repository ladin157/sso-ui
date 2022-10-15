import SsoAdminClient from "@sso/sso-admin-client";
import axios from "axios";
import Sso from "sso-js";
import { DependencyList, useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";

import environment from "../../environment";
import { createNamedContext } from "../../utils/createNamedContext";
import useRequiredContext from "../../utils/useRequiredContext";

export type AdminClientProps = {
  sso: Sso;
  adminClient: SsoAdminClient;
};

export const AdminClientContext = createNamedContext<
  AdminClientProps | undefined
>("AdminClientContext", undefined);

export const useAdminClient = () => useRequiredContext(AdminClientContext);

/**
 * Util function to only set the state when the component is still mounted.
 *
 * It takes 2 functions one you do your adminClient call in and the other to set your state
 *
 * @example
 * useFetch(
 *  () => adminClient.components.findOne({ id }),
 *  (component) => setupForm(component),
 *  []
 * );
 *
 * @param adminClientCall use this to do your adminClient call
 * @param callback when the data is fetched this is where you set your state
 */
export function useFetch<T>(
  adminClientCall: () => Promise<T>,
  callback: (param: T) => void,
  deps?: DependencyList
) {
  const { adminClient } = useAdminClient();
  const onError = useErrorHandler();

  useEffect(() => {
    const source = axios.CancelToken.source();

    adminClient.setConfig({
      requestConfig: { cancelToken: source.token },
    });

    adminClientCall()
      .then((result) => {
        if (!source.token.reason) {
          callback(result);
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          onError(error);
        }
      });

    adminClient.setConfig({
      requestConfig: { cancelToken: undefined },
    });

    return () => {
      source.cancel();
    };
  }, deps);
}

export async function initAdminClient() {
  const sso = new Sso({
    url: environment.authServerUrl,
    realm: environment.loginRealm,
    clientId: environment.isRunningAsTheme
      ? "security-admin-console"
      : "security-admin-console-v2",
  });

  await sso.init({ onLoad: "check-sso", pkceMethod: "S256" });

  const adminClient = new SsoAdminClient();

  adminClient.setConfig({ realmName: environment.loginRealm });
  adminClient.baseUrl = environment.authUrl;
  adminClient.registerTokenProvider({
    async getAccessToken() {
      try {
        await sso.updateToken(5);
      } catch (error) {
        sso.login();
      }

      return sso.token;
    },
  });

  return { sso, adminClient };
}
