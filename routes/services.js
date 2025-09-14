const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isActive: true })
            .populate('provider', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
             services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching services'
        });
    }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Provider only)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, price, tags } = req.body;

        // Validation
        if (!title || !description || !category || !price) {
            return res.status(400).json({
                success: false,
                error: 'Please provide title, description, category, and price'
            });
        }

        if (!price.amount || !price.type) {
            return res.status(400).json({
                success: false,
                error: 'Please provide valid price amount and type'
            });
        }

        // Create service
        const service = new Service({
            title,
            description,
            category,
            price: {
                amount: parseFloat(price.amount),
                type: price.type
            },
            tags: tags || [],
            provider: req.user.id,
            isActive: true
        });

        await service.save();

        // Populate provider info for response
        await service.populate('provider', 'name email phone');

        res.json({
            success: true,
            message: 'Service created successfully',
             service
        });

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while creating service'
        });
    }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('provider', 'name email phone');

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        res.json({
            success: true,
             service
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching service'
        });
    }
});

module.exports = router;
