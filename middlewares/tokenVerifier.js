import blackListedToken from "../models/blackListedToken.js"
import { verifyToken } from "../utils/jwt.helper.js"

const verifyAccessToken=(req,res,next)=>{
    const token=req.token
    const payload=verifyToken(token,"ACCESS")
    if(payload.status!==200){
        res.status(404).send({
            message:payload.message
        })
    }else{
        const {username} = payload.decoded
        req.username=username
        next()
    }
}

const verifyRefreshToken=async (req,res,next)=>{
    const token=req.token
    const isTokenBlacklisted = await blackListedToken.findOne({token:token});
    if(!isTokenBlacklisted){
        const payload=verifyToken(token,"REFRESH")

        if(payload.status!==200){
            res.status(404).send({
                message:payload.message
            })
        }else{
            const {username} = payload.decoded
            req.username=username
            next()
        }
    }else{
        res.status(404).send({
            message:`TOKEN EXPIRED`
        })
    }
}

export {
    verifyAccessToken,
    verifyRefreshToken
}