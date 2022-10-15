package com.vinorsoft.sso.admin.ui.rest;

import static com.vinorsoft.sso.admin.ui.rest.model.RoleMapper.convertToModel;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import com.vinorsoft.sso.admin.ui.rest.model.ClientRole;
import com.vinorsoft.sso.models.RealmModel;
import com.vinorsoft.sso.models.RoleContainerModel;
import com.vinorsoft.sso.models.RoleModel;
import com.vinorsoft.sso.services.resources.admin.permissions.AdminPermissionEvaluator;

public abstract class RoleMappingResource {
    private final RealmModel realm;
    private final AdminPermissionEvaluator auth;

    public RoleMappingResource(RealmModel realm, AdminPermissionEvaluator auth) {
        this.realm = realm;
        this.auth = auth;
    }

    public final Stream<ClientRole> mapping(Predicate<RoleModel> predicate) {
        return realm.getClientsStream().flatMap(RoleContainerModel::getRolesStream).filter(predicate)
                .filter(auth.roles()::canMapClientScope).map(roleModel -> convertToModel(roleModel, realm.getClientsStream()));
    }

    public final List<ClientRole> mapping(Predicate<RoleModel> predicate, long first, long max, final String search) {
        return mapping(predicate).filter(clientRole -> clientRole.getClient().contains(search) || clientRole.getRole().contains(search))
                .skip(first).limit(max).collect(Collectors.toList());
    }
}
