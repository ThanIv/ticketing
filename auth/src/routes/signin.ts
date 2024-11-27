import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import {validationRequest, BadRequestError} from '@thantickets/common';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validationRequest,
    async (req: Request , res: Response) => {
        const {email, password} = req.body;

        const existingUer = await User.findOne({email});

        if(!existingUer){
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUer.password,
            password
        );

        if(!passwordsMatch){
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUer.id,
            email: existingUer.email
        }, 
        process.env.JWT_KEY!
        );
    
        //Store it on session object
        req.session= {
            jwt: userJwt
        };
    
        res.status(200).send(existingUer);

    }
);

export {router as signinRouter};