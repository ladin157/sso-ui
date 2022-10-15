import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { initAdminClient } from "./context/auth/AdminClient";
import { initI18n } from "./i18n";

import "./index.css";

async function initialize() {
  const { sso, adminClient } = await initAdminClient();

  await initI18n(adminClient);

  ReactDOM.render(
    <StrictMode>
      <App sso={sso} adminClient={adminClient} />
    </StrictMode>,
    document.getElementById("app")
  );
}

initialize();
