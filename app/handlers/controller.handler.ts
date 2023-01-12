import { Request, Response, NextFunction } from 'express';

export default (controller) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        console.log('controller handler calling : ', controller.name);
        await controller(request, response, next);
    } catch (err) {
        next(err);
    }
};