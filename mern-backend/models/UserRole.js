const mongoose = require('mongoose')

const userRoleSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ADMIN", "VENDOR", "CUSTOMER"],
        default: ["CUSTOMER"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const UserRole = mongoose.model('user_roles', userRoleSchema);
