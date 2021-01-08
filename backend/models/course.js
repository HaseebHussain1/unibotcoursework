const mongoose= require("mongoose");

const courseSchema= mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  modules: [{
    moduleName: String,
    optional: false,
  }],
  // [{ type: String },{ optional: false }]

});

module.exports= mongoose.model("Course", courseSchema);
