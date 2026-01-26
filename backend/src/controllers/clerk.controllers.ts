import { Response } from 'express';
import { Request } from 'express';
import { User } from '../models/user.model';
const clerkWebhook = async (req: Request , res : Response) => {
    try {
        const {type:eventType,data} =req.body;
        const {first_name,last_name,image_url} = data|| {};
        const email = data.email_addresses?.[0]?.email_address;
        let fullName = "";
        if(first_name && last_name) {
            fullName = `${first_name} ${last_name}`;
        }else {
            fullName = first_name || last_name || "No Name";
        }
        switch(eventType) {
            case "user.created":
                if(!email || !fullName || !image_url) {
                    return res.status(400).json({error:"Incomplete user data from Clerk"});
                }
                const isUserDetailEmpty = [email,fullName,image_url]?.some(
                    (field) => field?.trim() === ""
                );
                if(isUserDetailEmpty) {
                    return res.status(400).json({error:"Incomplete user data from Clerk"});
                }
                const existedUser = await User.findOne({email})

                if(existedUser) {
                    return res.status(409)
                    .json({error:"User with this email already exists"});
                }

                const newUser = new User({
                    fullName,
                    email,
                    imageUrl:image_url,
                });

                await newUser.save();
                return res.status(201).json({message:"User created successfully"});
                
                default: {
                    return res.status(400).json({error:"Unhandled event type"});
                }
            }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return res.status(500).json({error: `Failed to process webhook: ${errorMessage}`}); 
    }
};

export default clerkWebhook;