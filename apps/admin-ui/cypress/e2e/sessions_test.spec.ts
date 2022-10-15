import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import SessionsPage from "../support/pages/admin_console/manage/sessions/SessionsPage";
import CommonPage from "../support/pages/CommonPage";
import ListingPage from "../support/pages/admin_console/ListingPage";
import GroupPage from "../support/pages/admin_console/manage/groups/GroupPage";
import { ssoBefore } from "../support/util/sso_hooks";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const sessionsPage = new SessionsPage();
const commonPage = new CommonPage();
const listingPage = new ListingPage();
const groupPage = new GroupPage();

describe("Sessions test", () => {
  const admin = "admin";
  const client = "security-admin-console";
  beforeEach(() => {
    ssoBefore();
    loginPage.logIn();
    sidebarPage.goToSessions();
  });

  describe("Sessions list view", () => {
    it("check item values", () => {
      commonPage
        .tableUtils()
        .checkRowItemExists(admin)
        .checkRowItemExists(client);
    });

    it("go to item accessed clients link", () => {
      commonPage.tableUtils().clickRowItemLink(client);
    });
  });

  describe("Search", () => {
    it("search existing session", () => {
      listingPage.searchItem(admin, false);
      listingPage.itemExist(admin, true);
      groupPage.assertNoSearchResultsMessageExist(false);
    });

    it("search non-existant session", () => {
      listingPage.searchItem("non-existant-session", false);
      groupPage.assertNoSearchResultsMessageExist(true);
    });
  });

  describe("revocation", () => {
    it("Clear revocation notBefore", () => {
      sessionsPage.clearNotBefore();
    });

    it("Check if notBefore cleared", () => {
      sessionsPage.checkNotBeforeCleared();
    });

    it("Set revocation notBefore", () => {
      sessionsPage.setToNow();
    });

    it("Check if notBefore saved", () => {
      sessionsPage.checkNotBeforeValueExists();
    });

    it("Push when URI not configured", () => {
      sessionsPage.pushRevocation();
      commonPage
        .masthead()
        .checkNotificationMessage(
          "No push sent. No admin URI configured or no registered cluster nodes available"
        );
    });
  });

  describe("logout all sessions", () => {
    it("logout all sessions", () => {
      sessionsPage.logoutAllSessions();
      cy.get("#kc-page-title").contains("Sign in to your account");
    });
  });
});
