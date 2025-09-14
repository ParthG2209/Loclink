const Service = require('../models/Service');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find().populate({
    path: 'provider',
    select: 'name rating avatar phone'
  });

  res.status(200).json({
    success: true,
    count: services.length,
    services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate({
    path: 'provider',
    select: 'name rating avatar phone email'
  });

  if (!service) {
    return next(new ErrorResponse('Service not found', 404));
  }

  res.status(200).json({
    success: true,
    service
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (provider/admin only)
exports.createService = asyncHandler(async (req, res, next) => {
  req.body.provider = req.user.id;

  if (req.user.role !== 'provider' && req.user.role !== 'admin') {
    return next(new ErrorResponse('Only providers can create services', 401));
  }

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (provider/admin only)
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse('Service not found', 404));
  }

  if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 401));
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (provider/admin only)
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse('Service not found', 404));
  }

  if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 401));
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
});

// @desc    Search services
// @route   GET /api/services/search?q=...&category=...
// @access  Public
exports.searchServices = asyncHandler(async (req, res, next) => {
  const { q, category } = req.query;
  let query = {};

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) {
    query.category = category;
  }

  const services = await Service.find(query).populate({
    path: 'provider',
    select: 'name rating avatar phone'
  });

  res.status(200).json({
    success: true,
    count: services.length,
    services
  });
});