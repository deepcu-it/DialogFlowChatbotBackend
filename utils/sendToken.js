const sendToken = (res, user, accessToken, refreshToken) => {
    res.status(201).json({
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        user
    });
};

export default sendToken;