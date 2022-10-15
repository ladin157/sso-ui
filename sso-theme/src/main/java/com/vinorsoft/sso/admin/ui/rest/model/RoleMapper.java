package com.vinorsoft.sso.admin.ui.rest.model;

import java.util.stream.Stream;
import com.vinorsoft.sso.models.ClientModel;
import com.vinorsoft.sso.models.RoleModel;

public class RoleMapper {

    public static ClientRole convertToModel(RoleModel roleModel, Stream<ClientModel> clients) {
        ClientRole clientRole = new ClientRole(roleModel.getId(), roleModel.getName(), roleModel.getDescription());
        ClientModel clientModel = clients.filter(c -> roleModel.getContainerId().equals(c.getId())).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Could not find referenced client"));
        clientRole.setClientId(clientModel.getId());
        clientRole.setClient(clientModel.getClientId());
        return clientRole;
    }
}
