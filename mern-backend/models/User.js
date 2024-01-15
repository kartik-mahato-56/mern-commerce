const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        countrycode: { type: String, default: "+91" },
        phone: { type: String, required: true, unique: true },
        password: { required: true, type: String },
        profile_image: { type: String, default: "" },
        role: {
            type: [
                {
                    type: String,
                    enum: ["ADMIN", "VENDOR", "CUSTOMER"],
                },
            ],
            default: ["CUSTOMER"],
            validate: {
                validator: function (array) {
                    return array.every((item) => typeof item === "string");
                },
                message: "All elements in the array must be strings.",
            },
        },
        isDelete: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        emailToken: { type: String, default: "" },
        emailVerified: { type: Boolean, default: false },
    },
    { timestamps: true },
);
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);   // this.confirmPassword = undefined
    }
    next();
});
userSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};
const User = new mongoose.model("User", userSchema);
module.exports = User;
