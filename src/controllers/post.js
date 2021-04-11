const { Post, Photo, User, Profile } = require("../../models");
const responSuccess = "Response Success";
const Joi = require("joi");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Photo,
          as: "photos",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "createdBy",
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          include: {
            model: Profile,
            as: "profile",
            attributes: {
              exclude: ["createdAt", "updatedAt", "userID", "id"],
            },
          },
        },
      ],
    });
    res.status(200).json({
      status: "success",
      message: "Posts loaded successfully",
      data: {
        posts,
      },
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

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userID"],
      },
      where: {
        id,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Photo,
          as: "photos",
          attributes: {
            exclude: ["createdAt", "updatedAt", "postID"],
          },
        },
        {
          model: User,
          as: "createdBy",
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
        },
      ],
    });

    if (!post) {
      return res.status(404).send({
        status: `Post With id: ${id} Not Found`,
        data: null,
      });
    }

    res.send({
      status: responSuccess,
      data: {
        post,
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

exports.addPost = async (req, res) => {
  try {
    const { body } = req.body;
    const file = req.files;

    const schema = Joi.object({
      title: Joi.string().min(5).required(),
      description: Joi.string().min(8).required(),
      images: Joi.array(),
    });

    const { error } = schema.validate(
      { ...req.body, images: file.path },
      {
        abortEarly: false,
      }
    );

    if (error) {
      return res.status(400).send({
        status: "Validation Error",
        error: {
          message: error.details.map((error) => error.message),
        },
      });
    }

    const { title, description, images } = req.body;
    const { id: userID } = req.user;
    const post = await Post.create({
      title,
      description,
      images: file.path,
      userID,
    });

    const image = async () => {
      return Promise.all(
        file.map(async (photo) => {
          await Photo.create({
            postID: post.id,
            images: photo.path,
          });
        })
      );
    };

    image().then(async () => {
      const afterAdd = await Post.findOne({
        where: { id: post.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "userID"],
        },
        include: [
          {
            model: User,
            as: "createdBy",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
          {
            model: Photo,
            as: "photos",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      res.send({
        status: responSuccess,
        message: "Post Succesfully Created",
        data: {
          post: afterAdd,
        },
      });
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

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const getPostById = await Post.findOne({
      where: {
        id,
      },
    });

    if (!getPostById) {
      return res.status(404).send({
        status: `Post With id: ${id} Not Found`,
        data: null,
      });
    }

    await Post.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: responSuccess,
      message: `Post With id: ${id} Deleted Success`,
      data: {
        post: null,
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
