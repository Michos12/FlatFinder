import mongoose, { Schema } from "mongoose";

function isModifiedValidator(value, next) {
    if(!Document.prototype.isModified(value)) {
        return next();
    } else {
        return ;
    }
}

export default isModifiedValidator;