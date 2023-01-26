import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../handlers/logger';

export const create = (user: string) => {
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: 365 * 24 * 3600 });
    console.log(token);
    return token;
};

export const generate = (request: Request, response: Response) => {
    const token = create(request.params.user);
    return response.status(201).json(token);
};

export const verify = (request: Request, response: Response, next: NextFunction) => {
    const token = request.body.token;
    try {
        const { user } = jwt.verify(token, process.env.TOKEN_SECRET);
        logger.request(`${user} authenticated`);
        if (!user) {
            const message = 'forbidden access';
            const code = 403;
            return response.status(code).json({ message, code });
        }
        next();
    } catch (_error) {
        const message = 'invalid authentication token';
        const code = 401;
        return response.status(code).json({ message, code });
    }
};