const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  Plan: {
    type: String,
    default: "free",
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  podcast: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});
//all  the user admin
let adminUser = [
  "rahulmandyal079@gmail.com",
  "example@gmail.com",
  "unknown@gmail.com",
  "usermeet@gmail.com",
];

// hashing  the user password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  if (adminUser.includes(this.email)) {
    this.isadmin = true;
    // console.log(" the user is one of  the admin");
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
