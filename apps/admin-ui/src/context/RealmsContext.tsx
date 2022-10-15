import type RealmRepresentation from "@sso/sso-admin-client/lib/defs/realmRepresentation";
import { sortBy } from "lodash-es";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import axios from "axios";

import { RecentUsed } from "../components/realm-selector/recent-used";
import { createNamedContext } from "../utils/createNamedContext";
import useRequiredContext from "../utils/useRequiredContext";
import { useAdminClient, useFetch } from "./auth/AdminClient";

type RealmsContextProps = {
  /** A list of all the realms. */
  realms: RealmRepresentation[];
  /** Refreshes the realms with the latest information. */
  refresh: () => Promise<void>;
};

export const RealmsContext = createNamedContext<RealmsContextProps | undefined>(
  "RealmsContext",
  undefined
);

export const RealmsProvider: FunctionComponent = ({ children }) => {
  const { sso, adminClient } = useAdminClient();
  const [realms, setRealms] = useState<RealmRepresentation[]>([]);
  const recentUsed = useMemo(() => new RecentUsed(), []);

  function updateRealms(realms: RealmRepresentation[]) {
    setRealms(sortBy(realms, "realm"));
    recentUsed.clean(realms.map(({ realm }) => realm!));
  }

  useFetch(
    async () => {
      try {
        return await adminClient.realms.find({ briefRepresentation: true });
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status < 500
        ) {
          return [];
        }

        throw error;
      }
    },
    (realms) => updateRealms(realms),
    []
  );

  const refresh = useCallback(async () => {
    //this is needed otherwise the realm find function will not return
    //new or renamed realms because of the cached realms in the token (perhaps?)
    await sso.updateToken(Number.MAX_VALUE);
    updateRealms(await adminClient.realms.find({ briefRepresentation: true }));
  }, []);

  const value = useMemo<RealmsContextProps>(
    () => ({ realms, refresh }),
    [realms, refresh]
  );

  return (
    <RealmsContext.Provider value={value}>{children}</RealmsContext.Provider>
  );
};

export const useRealms = () => useRequiredContext(RealmsContext);
