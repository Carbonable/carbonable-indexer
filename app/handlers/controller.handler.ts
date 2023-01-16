import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export default (controller) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        logger.request(`${request.originalUrl} (${controller.name})`);
        await controller(request, response, next);
    } catch (err) {
        next(err);
    }
};