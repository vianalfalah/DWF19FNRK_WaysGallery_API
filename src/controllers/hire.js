const { Project, User, Hired, ProjectFiles } = require("../../models");
const responSuccess = "Response Success";
const Joi = require("joi");

exports.addOffer = async (req, res) => {
  try {
    const { body } = req.body;
    const { id: userID } = req.user;
    const schema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().min(10).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      price: Joi.number().required(),
      orderTo: Joi.number().required(),
    });
    const { error } = schema.validate(
      { ...req.body },
      {
        abortEarly: false,
      }
    );
    req.body.orderBy = userID;
    req.body.status = "Waiting Approve";
    const hired = await Hired.create(req.body);
    const afterCreated = await Hired.findOne({
      where: { id: hired.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo", "status"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    res.send({
      status: responSuccess,
      message: "succesfully add offer",
      data: { hired: afterCreated },
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

exports.getOrder = async (req, res) => {
  try {
    const { id: userID } = req.user;
    const order = await Hired.findAll({
      where: { orderBy: userID },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "vendor",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: Project,
          as: "projects",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: ProjectFiles,
            as: "files",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      ],
    });
    if (order.length === 0) {
      return res.status(404).send({
        status: "your order is empty",
        data: null,
      });
    }
    res.send({
      status: responSuccess,
      message: "succesfully get your oder",
      data: { order },
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

exports.getOffer = async (req, res) => {
  try {
    const { id: userID } = req.user;
    const offer = await Hired.findAll({
      where: { orderTo: userID },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "vendor",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    if (offer.length === 0) {
      return res.status(404).send({
        status: "your offer is empty",
        data: null,
      });
    }
    res.send({
      status: responSuccess,
      message: "succesfully get your oder",
      data: { offer },
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

exports.editHired = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const schema = Joi.object({
      status: Joi.string().required(),
    });
    const { error } = schema.validate(body, {
      abortEarly: false,
    });
    const getHireById = await Hired.findOne({ where: { id } });
    if (!getHireById) {
      return res.status(404).send({
        status: `Hired With id: ${id} Not Found`,
        data: null,
      });
    }
    const hired = await Hired.update(body, { where: { id } });
    const afterUpdate = await Hired.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "vendor",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    res.send({
      status: responSuccess,
      message: "succesfully update Hired",
      data: { hired: afterUpdate },
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
