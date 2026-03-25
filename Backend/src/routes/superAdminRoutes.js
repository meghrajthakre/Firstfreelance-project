const { Router }     = require("express");
const { protect }    = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/roleMiddleware");
const { createAdmin, getAdmins, updateAdmin, changeAdminPassword, toggleAdminStatus }    = require("../controllers/superAdminController");
 
const router = Router();
 
// All routes require valid JWT + superadmin role
router.use(protect, superAdminOnly);
 
// POST /superadmin/admins
router.post("/admins", createAdmin);
router.get("/admins", getAdmins); 
router.put("/admins/:id", updateAdmin);
router.patch("/admins/:id/password", changeAdminPassword);
router.patch("/admins/:id/status", toggleAdminStatus);
 
module.exports = router;