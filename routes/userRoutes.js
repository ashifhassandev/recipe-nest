const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateJWT = require("../middlewares/jwtMiddleware");
const upload = require("../config/multerConfig");

router
  .route("/login")
  .get(userController.getUserLogin)
  .post(userController.userLogin);

router
  .route("/signup")
  .get(userController.getUserSignup)
  .post(userController.userSignup);

router.get("/logout", userController.userLogout);

router.get("/user-profile", authenticateJWT, userController.getUserProfile);

router
  .route("/user-profile/edit/:id")
  .get(authenticateJWT, userController.getEditUserProfile)
  .put(authenticateJWT, userController.editUserProfile);

router.get(
  "/favourite-recipes",
  authenticateJWT,
  userController.getFavouriteRecipes,
);

router.post("/add-favourites", userController.addFavouriteRecipes);

router
  .route("/add-category")
  .get(authenticateJWT, userController.getAddCategory)
  .post(authenticateJWT, upload, userController.addCategory);

router
  .route("/edit-category/:id")
  .get(authenticateJWT, userController.getEditCategory)
  .put(authenticateJWT, upload, userController.editCategory);

router
  .route("/add-recipe")
  .get(authenticateJWT, userController.getAddRecipe)
  .post(authenticateJWT, upload, userController.addRecipe);

router
  .route("/edit-recipe/:id")
  .get(authenticateJWT, userController.getEditRecipe)
  .put(authenticateJWT, upload, userController.editRecipe);

router.post("/contact/send-email", userController.processSendEmail);

module.exports = router;