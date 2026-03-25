import api from "../constants/api";

export const getAdmins = (params) =>
  api.get("/superadmin/admins", { params }).then((r) => r.data);

export const createAdmin = (body) =>
  api.post("/superadmin/admins", body).then((r) => r.data);

export const toggleAdminStatus = (id) =>
  api.patch(`/superadmin/admins/${id}/status`).then((r) => r.data);

export const changeAdminPassword = (id, password, confirmPassword) =>
  api
    .patch(`/superadmin/admins/${id}/password`, { password, confirmPassword })
    .then((r) => r.data);