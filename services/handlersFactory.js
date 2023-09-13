const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeature = require("../utils/apiFeatures");

exports.getAll = (model, ModelName = "") =>
  asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeature(model.find(req.filterObj), req.query)
      .paginate(await model.countDocuments())
      .filter()
      .search(ModelName)
      .limitFields()
      .sort();

    const { pagination, mongooseQuery } = apiFeatures;

    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      pagination,
      data: {
        documents,
      },
    });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const newDocument = await model.create(req.body);
    res.status(201).json({
      status: "Sucess",
      data: {
        newDocument,
      },
    });
  });

exports.getOne = (model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const document = await query;
    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 400)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 400)
      );
    }
    // Trigger "save" event when update document
    document.save();

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findOneAndDelete({
      id: req.params._id,
    });

    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.Id}`, 400)
      );
    }

    // Call calcAvgRatingAndRatingQuantity after the document is removed
    if (model === "review")
      await model.calcAvgRatingAndRatingQuantity(document.product);

    res.status(204).json({
      status: "success",
    });
  });
