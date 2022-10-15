import LoginPage from "../support/pages/LoginPage";
import Masthead from "../support/pages/admin_console/Masthead";
import { ssoBefore } from "../support/util/sso_hooks";

const username = "admin";
const password = "admin";

const loginPage = new LoginPage();
const masthead = new Masthead();

describe("Logging In", () => {
  beforeEach(() => {
    ssoBefore();
  });

  it("displays errors on wrong credentials", () => {
    loginPage.logIn("wrong", "user{enter}");

    loginPage.checkErrorMessage("Invalid username or password.").isLogInPage();
  });

  it("logs in", () => {
    loginPage.logIn(username, password);

    masthead.checkIsAdminConsole();

    cy.getCookie("SSO_SESSION_LEGACY").should("exist");
  });
});
