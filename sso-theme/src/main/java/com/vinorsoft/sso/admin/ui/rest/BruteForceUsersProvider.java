package com.vinorsoft.sso.admin.ui.rest;

import com.vinorsoft.sso.Config;
import com.vinorsoft.sso.models.SsoSession;
import com.vinorsoft.sso.models.SsoSessionFactory;
import com.vinorsoft.sso.models.RealmModel;
import com.vinorsoft.sso.services.resources.admin.AdminEventBuilder;
import com.vinorsoft.sso.services.resources.admin.ext.AdminRealmResourceProvider;
import com.vinorsoft.sso.services.resources.admin.ext.AdminRealmResourceProviderFactory;
import com.vinorsoft.sso.services.resources.admin.permissions.AdminPermissionEvaluator;

public final class BruteForceUsersProvider implements AdminRealmResourceProviderFactory, AdminRealmResourceProvider {
    public AdminRealmResourceProvider create(SsoSession session) {
        return this;
    }

    public void init(Config.Scope config) {

    }

    public void postInit(SsoSessionFactory factory) {

    }

    public void close() {
    }

    public String getId() {
        return "admin-ui-brute-force-user";
    }

    public Object getResource(SsoSession session, RealmModel realm, AdminPermissionEvaluator auth, AdminEventBuilder adminEvent) {
        return new  BruteForceUsersResource(realm, auth);
    }
}
