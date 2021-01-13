const { Profile } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const profile = await Profile.findOne({ where: { userId: id } });
    if (!profile || profile.isAdmin === false) {
      return res.status(401).send({
        status: "Response fail",
        error: {
          message: "Access Denied",
        },
      });
    }
    req.user.isAdmin = true;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "Response fail",
      error: {
        message: "Invalid Access",
      },
    });
  }
};
