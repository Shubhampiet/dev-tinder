const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionSchema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true },
);

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
