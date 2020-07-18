import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IUser extends mongoose.Document {
  token: string;
  username: string;
  displayName: string;
  passwordHash: string;
  blogs: string[];
}

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  displayName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret._id;
    delete ret.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
