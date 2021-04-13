const { User, Art, Post, Photo, Profile } = require("../../models");
const responSuccess = "Response Success";
const Joi = require("joi");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;
    // const latestPost = await Post.max("id", { where: { userID: id } });
    // const latestArt = await Art.max("id", { where: { userID: id } });
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },

      include: [
        {
          model: Profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userID", "id"],
          },
        },
        {
          model: Post,
          as: "posts",

          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["updatedAt", "userID"],
          },
          include: {
            model: Photo,
            as: "photos",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
        {
          model: Art,
          as: "arts",
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["updatedAt", "userID"],
          },
        },
      ],
    });
    if (!user) {
      return res.status(404).send({
        status: `User With id: ${id} Not Found`,
        data: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Get User Profile Success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },

      include: [
        {
          model: Profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userID"],
          },
        },
        {
          model: Post,
          as: "posts",
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt", "userID"],
          },
          include: {
            model: Photo,
            as: "photos",

            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
        {
          model: Art,
          as: "arts",
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt", "userID"],
          },
        },
      ],
    });
    if (!user) {
      return res.status(404).send({
        status: `User With id: ${id} Not Found`,
        data: null,
      });
    }
    res.send({
      status: responSuccess,
      message: "succesfully get profile",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.satus(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

exports.editProfileUser = async (req, res) => {
  try {
    const { body } = req.body;
    const { id: userID } = req.user;

    const schema = Joi.object({
      avatar: Joi.string(),
      greeting: Joi.string().min(5),
      fullName: Joi.string().min(5),
    });
    const { error } = schema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).send({
        status: "Validation Error",
        error: {
          message: error.details.map((error) => error.message),
        },
      });
    }

    const profile = await Profile.findOne({ where: { userID } });
    if (!profile) {
      return res.status(404).send({
        status: `Profile With id: ${id} Not Found`,
        data: null,
      });
    }
    if (req.body.fullName) {
      await User.update(
        { fullName: req.body.fullName },
        { where: { id: userID } }
      );
    }
    await Profile.update(
      { ...req.body, avatar: req.file.path },
      {
        where: { userID },
      }
    );

    console.log(body);
    const afterUpdate = await User.findOne({
      where: {
        id: userID,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "userID", "id"],
        },
      },
    });

    res.send({
      status: responSuccess,
      message: "Update Success",
      data: {
        user: afterUpdate,
      },
    });
  } catch (error) {
    //error here
    console.log(error);
    return res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.addArt = async (req, res) => {
  try {
    const { body } = req.body;
    const { id: userID } = req.user;
    const file = req.files;

    const art = [];
    await Promise.all(
      file.map(async (file) => {
        return await Art.create({ userID, images: file.path });
      })
    );

    res.send({
      status: responSuccess,
      message: "Arts Succesfully Added",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
