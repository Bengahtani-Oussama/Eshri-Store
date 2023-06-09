import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs'
import User from '@/models/user/User';
import db from '@/utils/DB/db';
import { singToken } from '@/utils/auth/auth';

const handler = nextConnect();

handler.post(async (req, res) =>{
    await db.connect();

    const user = await User.findOne({email: req.body.email});

    await db.disconnect();

    if (user && bcrypt.compareSync(req.body.password , user.password)) {
        const token = singToken(user);
        res.send({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(401).send({message:'Invalid User Or Password!'})
    }
})

export default handler;