const { Router }     = require("express");
const { protect }    = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/roleMiddleware");
const { createAdmin, getAdmins }    = require("../controllers/superAdminController");
 
const router = Router();
 
// All routes require valid JWT + superadmin role
router.use(protect, superAdminOnly);
 
// POST /superadmin/admins
router.post("/admins", createAdmin);
router.get("/admins", getAdmins); 
 
module.exports = router;