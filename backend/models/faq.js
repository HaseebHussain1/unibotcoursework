const mongoose= require("mongoose");
const {Schema} = mongoose;

const faqschema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  question: String, // String is shorthand for {type: String}
  answer: String,


});
module.exports= mongoose.model("faq", faqschema);
