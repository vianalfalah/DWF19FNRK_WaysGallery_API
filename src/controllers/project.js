const { Project, ProjectFiles, Hired } = require("../../models");
const responSuccess = "Response Success";
const Joi = require("joi");

exports.sendProject = async (req, res) => {
  try {
    const { id: hireID } = req.params;
    const { id: userID } = req.user;
    const files = req.files;
    const hired = await Hired.findOne({
      where: { id: hireID },
    });
    if (!hired) {
      return res.status(404).send({
        status: `Hired With id: ${id} Not Found`,
        data: null,
      });
    }
    if (hired.orderTo !== userID) {
      return res.status(400).send({
        status: `User Not Found`,
        message: "access denied",
        data: {},
      });
    }

    const schema = Joi.object({
      description: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(
      { ...req.body },
      {
        abortEarly: false,
      }
    );
    const { description } = req.body;
    const project = await Project.create({
      description,
      hireID,
    });
    const image = async () => {
      await Promise.all(
        files.map(async (image) => {
          await ProjectFiles.create({
            projectID: project.id,
            fileName: image.filename,
          });
        })
      );
    };
    await Hired.update({ status: "Success" }, { where: { id: hireID } });

    image().then(async () => {
      const afterSend = await Project.findOne({
        where: { id: project.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: ProjectFiles,
          as: "files",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      });
      res.send({
        status: responSuccess,
        message: "succesfully send project",
        data: {
          project: afterSend,
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

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: ProjectFiles,
        as: "files",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });
    if (!project) {
      return res.status(404).send({
        status: `Project With id: ${id} Not Found`,
        data: null,
      });
    }

    res.send({
      status: responSuccess,
      message: "Succesfully Get Project",
      data: { project },
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
