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
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcM1rhxmlTdYut_kPrI7eWXC4SdZ0CDpxTg&usqp=CAU',
      
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
