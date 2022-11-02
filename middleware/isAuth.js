const jwt = require ('jsonwebtoken');
const Wallet = require ('../models/wallet');




exports.isAuth = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: 'Token Is missing' });
      }
  
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
        throw new Error();
      }
      req.wallet = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Token expired' });
    }
  };