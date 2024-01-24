const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneno: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gndr: {
        type: String,
        enum: ['Male', 'Female', 'Prefer not to say'],
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 12);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

UserSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id}, process.env.jwtPrivateKey);

        if (!token) {
            throw new Error('Token not generated');
        }

        this.tokens = this.tokens.concat({ token });
        console.log("yeudge");
        await this.save();

        return token;
    } catch (err) {
        console.error(err);
        throw err;  // Propagate the error
    }
};

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
