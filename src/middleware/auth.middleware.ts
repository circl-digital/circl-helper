import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { Context } from '../model/context';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: () => void) {
        const contextString = req.headers.context;
        const context: Context = JSON.parse(contextString as string);
        req['context'] = context;
        next();
    }
}
