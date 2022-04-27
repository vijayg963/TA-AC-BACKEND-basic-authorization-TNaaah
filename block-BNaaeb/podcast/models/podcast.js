const mongoose = require("mongoose");
let podcastSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  podcastplan: {
    type: String,
  },
});
let Podcast = mongoose.model("Podcast", podcastSchema);
module.exports = Podcast;
