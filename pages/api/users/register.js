import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs'
import User from '@/models/user/User';
import db from '@/utils/DB/db';
import { singToken } from '@/utils/auth/auth';

const handler = nextConnect();

handler.post(async (req, res) =>{
    await db.connect();

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
    });
    const user = await newUser.save();

    await db.disconnect();
    
    const token = singToken(user);
    res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
   
});

export default handler;