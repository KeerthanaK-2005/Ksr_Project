const bcrypt = require("bcrypt");

const encript = async (password) => {
  const salt = await bcrypt.genSalt(11);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const decript = async (password, hashpassword) => {
  const bcryptResult = await bcrypt.compare(password, hashpassword);
  return bcryptResult;
};

module.exports = {
  encript,
  decript,
};
