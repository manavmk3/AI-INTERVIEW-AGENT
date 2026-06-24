import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        console.log("isAuth called. Cookies:", req.cookies)
        let { token } = req.cookies

        if (!token) {
            console.log("isAuth: Token missing")
            return res.status(400).json({ message: "user does not have a token" })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifyToken) {
            console.log("isAuth: Token verification failed")
            return res.status(400).json({ message: "user does not have a valid token" })
        }
        console.log("isAuth: User verified successfully. UserID:", verifyToken.userId)
        req.userId = verifyToken.userId
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "isAuth error " })
    }
}

export default isAuth