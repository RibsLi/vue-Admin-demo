import request from "./request";

// 获取权限列表数据
export function getRightsList(key) {
  return request({
    url: `rights/${key}`,
    method: "get"
  })
}

// 获取角色列表数据
export function getRolesList() {
  return request({
    url: "roles",
    method: "get"
  })
}

// 添加角色
export function addRoles(roleName, roleDesc) {
  return request({
    url: "roles",
    method: "post",
    data: {
      roleName,
      roleDesc
    }
  })
}

// 根据id获取角色信息
export function getRolesInfo(id) {
  return request({
    url: `roles/${id}`,
    method: "get"
  })
}

// 修改角色信息
export function setRolesInfo(id, roleName, roleDesc) {
  return request({
    url: `roles/${id}`,
    method: "put",
    data: {
      roleName,
      roleDesc
    }
  })
}

// 删除角色
export function deleteRoles(id) {
  return request({
    url: `roles/${id}`,
    method: "delete",
    params: {
      id
    }
  })
}

// 删除角色权限tag
export function deleteTag(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete",
    params: {
      roleId,
      rightId
    }
  })
}