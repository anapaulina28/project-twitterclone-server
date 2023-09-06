const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    profileImage: {
      type: String,
      default: 'https://secure.gravatar.com/avatar/2d14cad3de67f425899320c1335d7e43?s=512&d=mm&r=g',
      
    },
    tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }], 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    //followers: [{ type: Schema.Types.ObjectId, ref: 'Follower' }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
