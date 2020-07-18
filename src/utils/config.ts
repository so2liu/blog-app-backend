const mongoURL = process.env.MONGO_URL;
const port = process.env.PORT || 3001;
const pwdSalt = Number(process.env.PWD_SALT);
const tokenSecret = process.env.TOKEN_SECRET;

export default { mongoURL, port, pwdSalt, tokenSecret };
