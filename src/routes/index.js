const express = require("express");

const router = express.Router();

const { uploadImage } = require("../../multer/uploadimg");
const { uploadSingle } = require("../../multer/uploadSingle");

//Authentication
const { register, login, auth } = require("../controllers/auth");
router.post("/register", register);
router.post("/login", login);
///////////

//Post
const {
  addPost,
  getPosts,
  getPostById,
  deletePost,
} = require("../controllers/post");
router.post("/post/add", auth, uploadImage("images"), addPost);
router.get("/posts", getPosts);
router.get("/post/:id", getPostById);
router.delete("/post/:id", auth, deletePost);

//User
const {
  getUser,
  getUserProfileById,
  editProfileUser,
  addArt,
} = require("../controllers/user");
router.get("/user", auth, getUser);
router.get("/user/:id", auth, getUserProfileById);
router.patch("/user", auth, uploadSingle("avatar"), editProfileUser);
router.post("/upload-arts", auth, uploadImage("images"), addArt);

//Hired
const {
  addOffer,
  getOrder,
  getOffer,
  editHired,
} = require("../controllers/hire");

router.post("/hired", auth, addOffer);
router.get("/my-order", auth, getOrder);
router.get("/my-offer", auth, getOffer);
router.patch("/hired/:id", auth, editHired);

//Project
const { sendProject, getProjectById } = require("../controllers/project");

router.post("/send-project/:id", auth, uploadImage("fileName"), sendProject);
router.get("/project/:id", auth, getProjectById);

module.exports = router;
