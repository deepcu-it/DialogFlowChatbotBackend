import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        validator: function (value) {
            const re = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
            return re.test(value);
        },
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', UserSchema);

export default User;