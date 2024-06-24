import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 32,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: []
            }
        ],
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: []
            }
        ],
        profileImg: {
            type: String,
            default: ''
        },
        coverImg: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

export const User = mongoose.model('User', userSchema)