import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";


export const verifyToken = (req : Request , res : Response , next : NextFunction) : void => {


    const token = req.headers.authorization?.split(' ')[1] ;

    if(!token) {
        res.status(403).json({error : 'No token provider'}) ;
        return ;
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET || "KpwFLooK0KCagRqklDtiomkzxzN2WcEyfBXKBo0a6U6") ;
        next() ;
    } catch (e) {
        res.status(401).json({error : 'Invalid Token'})
    }
}