import User from "../models/User.js";
import { addTokenToRequest } from "./tokenChecker.js"
import { verifyAccessToken, verifyRefreshToken } from "./tokenVerifier.js";

export const isAuthenticatedAccess = (req,res,next)=> {
        addTokenToRequest(req, res, (err) => {
          if (err) return; // Stop execution if an error response has been sent
      
          verifyAccessToken(req, res, (err) => {
            if (err) return; // Stop execution if an error response has been sent
      
            next();
          });
        });
}
export const isAuthenticatedRefresh = (req,res,next)=> {
    addTokenToRequest(req, res, (err) => {
      if (err) return; // Stop execution if an error response has been sent
  
      verifyRefreshToken(req, res, (err) => {
        if (err) return; // Stop execution if an error response has been sent
  
        next();
      });
    });
}

export const isAuthrorizeRoles = (role) => async (req,res,next)=> {
    const username = req.username;
    const user = await User.findOne({username:username});
    if(!user) {
        res.status(401).json({
            success:false,
            message:"User not found"
        })
    }
    if(user.role!==role) {
        res.status(401).json({
            success:false,
            message:`Only ${role} are allowed`
        })
    } 
    next();
}