import {clerkClient} from "@clerk/express";



const protectAdmin = async(req,res,next) => {
    try{
        const {userId} = req.auth();

        const user = await clerkClient.users.getUser(userId);

        if(user.privateMetadata.role !== "admin"){
            return res.json(
                {
                    success : false,
                    message : "Not authorized as Admin"
                }
            )
        }

        next();
    }
    catch(error) {
        console.log("Error in protectedAdmin : ",error.message);
        return res.json(
            {
                success : false,
                message : error.message
            }
        )
    }
}

export default protectAdmin;
