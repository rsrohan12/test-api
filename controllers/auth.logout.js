
export const logout = async(req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        res.status(200).json({
            message: "Logout Successfully"
        })
        
    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}