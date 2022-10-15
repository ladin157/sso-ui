/**
 * @vitest-environment jsdom
 */
import type SsoAdminClient from "@sso/sso-admin-client";
import type { ServerInfoRepresentation } from "@sso/sso-admin-client/lib/defs/serverInfoRepesentation";
import { render, waitFor } from "@testing-library/react";
import type Sso from "sso-js";
import { FunctionComponent } from "react";
import { HashRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AccessContextProvider } from "../../context/access/Access";
import { AdminClientContext } from "../../context/auth/AdminClient";
import { RealmContext } from "../../context/realm-context/RealmContext";
import { ServerInfoContext } from "../../context/server-info/ServerInfoProvider";
import serverInfo from "../../context/server-info/__tests__/mock.json";
import { WhoAmIContextProvider } from "../../context/whoami/WhoAmI";
import whoamiMock from "../../context/whoami/__tests__/mock-whoami.json";
import { DataLoader } from "./DataLoader";

const MockAdminClient: FunctionComponent = ({ children }) => {
  const sso = {
    init: () => Promise.resolve(),
  } as unknown as Sso;
  const adminClient = {
    whoAmI: { find: () => Promise.resolve(whoamiMock) },
    setConfig: () => {},
  } as unknown as SsoAdminClient;

  return (
    <HashRouter>
      <ServerInfoContext.Provider
        value={serverInfo as unknown as ServerInfoRepresentation}
      >
        <AdminClientContext.Provider value={{ sso, adminClient }}>
          <WhoAmIContextProvider>
            <RealmContext.Provider value={{ realm: "master" }}>
              <AccessContextProvider>{children}</AccessContextProvider>
            </RealmContext.Provider>
          </WhoAmIContextProvider>
        </AdminClientContext.Provider>
      </ServerInfoContext.Provider>
    </HashRouter>
  );
};

describe("DataLoader", () => {
  it("loads the data and renders the result", async () => {
    const loader = () => Promise.resolve(["a", "b"]);
    const { container } = render(
      <MockAdminClient>
        <DataLoader loader={loader}>
          {(result) => (
            <div>
              {result.map((value) => (
                <i key={value}>{value}</i>
              ))}
            </div>
          )}
        </DataLoader>
      </MockAdminClient>
    );

    await waitFor(() => expect(container.textContent).toEqual("ab"));
  });
});
