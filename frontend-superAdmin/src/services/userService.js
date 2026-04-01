import api from "../constants/api";

export const getUsers = (params) =>
  api.get("/superadmin/users", { params }).then((r) => r.data);

export const getUser = (id) =>
  api.get(`/superadmin/users/${id}`).then((r) => r.data);

export const createUser = (body) =>
  api.post("/superadmin/users", body).then((r) => r.data);

export const updateUser = (id, body) =>
  api.patch(`/superadmin/users/${id}`, body).then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/superadmin/users/${id}`).then((r) => r.data);

export const toggleUserStatus = (id) =>
  api.patch(`/superadmin/users/${id}/status`).then((r) => r.data);

export const changeUserPassword = (id, password, confirmPassword) =>
  api
    .patch(`/superadmin/users/${id}/password`, { password, confirmPassword })
    .then((r) => r.data);

export const loginUser = (username, password) =>
  api.post("/auth/login", { username: username.trim().toLowerCase(), password })
     .then((r) => r.data);