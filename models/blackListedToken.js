import mongoose, { Model, Schema } from "mongoose";

const BlackListedTokenSchema = new Schema({
    token:{
        type:String,
        required:true
    }
})

const blackListedToken= mongoose.model('BlackListedToken',BlackListedTokenSchema);
export default blackListedToken;