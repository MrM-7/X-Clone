import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    try {

        const { username } = req.params

        if(!username) return res.status(400).json({ error: "Username is required" })
        
        const user = await User.findOne({ username }).select("-password")

        if(!user){
            return res.status(404).json({ error: "User not found" })
        }

        res
        .status(200)
        .json(user)

    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const toggleFollow = async (req, res) => {
    try {
        const { id } = req.params

        if(id === req.user._id.toString()){
            return res.status(400).json({ error: "You can't follow/unfollow yourself" })
        }

        const currentUser = await User.findById(req.user._id)
        const modifiedUser = await User.findById(id)

        if(!currentUser || !modifiedUser){
            return res.status(404).json({ error: "User not found" })
        }

        const isFollowing = modifiedUser.followers.includes(currentUser._id)

        if(isFollowing){
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id }})
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id }})

            res.status(200).json({ message: "User unfollowed successfully" })
        } else{
            await User.findByIdAndUpdate(id, { $push: { followers: currentUser._id }})
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id }})

            const followNotification = await Notification.create({
                from: currentUser._id,
                to: modifiedUser._id,
                type: 'follow'
            })
            
            res.status(200).json({ message: "User followed successfully" })
        }

    } catch (error) {
        console.log("Error in toggleFollow: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}