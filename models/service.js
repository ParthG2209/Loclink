const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a service title'],
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: 500
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'plumbing',
            'electrical',
            'cleaning',
            'tutoring',
            'moving',
            'gardening',
            'painting',
            'carpentry',
            'beauty',
            'fitness',
            'other'
        ]
    },
    price: {
        amount: {
            type: Number,
            required: [true, 'Please provide a price']
        },
        type: {
            type: String,
            enum: ['hourly', 'fixed', 'daily'],
            default: 'hourly'
        }
    },
    images: [{
        url: String,
        alt: String
    }],
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String
        },
        coordinates: {
            lat: Number,
            lng: Number
        },
        serviceRadius: {
            type: Number,
            default: 10
        }
    },
    availability: {
        schedule: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            startTime: String,
            endTime: String,
            available: Boolean
        }],
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

serviceSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Service', serviceSchema);
