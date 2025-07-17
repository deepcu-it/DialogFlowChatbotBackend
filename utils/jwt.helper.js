import jwt from 'jsonwebtoken'
const tokenExpiryTime = '5m'
const signUser = (username) => {
    const AccessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenExpiryTime })
    const RefreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET)
    return {
        accessToken: AccessToken,
        refreshToken: RefreshToken
    }
}

const verifyToken = (token, type) => {
    try {
        const decodedToken = type.toUpperCase() === "REFRESH" ? jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) : jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return {
            "status":200,
            "decoded":decodedToken
        }
    } catch (error) {
        return {
            "status":404,
            "message":error.message
        }
    }
}

const newAccessToken=(username)=>{
    const AccessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenExpiryTime })
    return {
        accessToken:AccessToken
    }
}

export {
    signUser,
    verifyToken,
    newAccessToken
}