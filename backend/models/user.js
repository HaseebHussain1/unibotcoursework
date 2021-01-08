const mongoose= require("mongoose");

const usersSchema= mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  // [{ type: String },{ optional: false }]

});

module.exports= mongoose.model("User", usersSchema);
