const mongoose= require("mongoose");
const {Schema} = mongoose;

const coursesSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  course_name: String, // String is shorthand for {type: String}
  course_type: String,
  duration: String,
  ucas_code: String, // String is shorthand for {type: String}
  start_date: String,
  supervisor: String,
  overview: String,
  location: String,
  cost: {uk: String, eu: String},
  requirments: {
    basic: [String],
    international: [String],
    experience: [String],
  },
  faq: [{question: String, answer: String}],
  modules: [{name: String, mtype: String}],
  tags: [String],

});
module.exports= mongoose.model("course", coursesSchema);
