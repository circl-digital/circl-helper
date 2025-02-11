import {
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { APIResponse } from '../model/api-response';
import { errorHandler as commonErrorHandler } from './error-handler';


export abstract class BaseController {
    protected readonly logger = new Logger(BaseController.name);

    /**
     * Handles the execution of a Promise, catching errors and standardizing responses.
     * @param promise The Promise to be executed
     * @param successMessage Optional success message
     * @param context Optional context for logging (usually the method name)
     * @returns Standardized response format
     */
    protected async buildResponse<T>(
        promiseOrFunction: (() => Promise<APIResponse<T>>) | (() => Promise<T>),
        onError?: (error: Error) => void | undefined,
    ): Promise<APIResponse<T>> {
        try {
            const rawResponse = await (typeof promiseOrFunction === 'function' ? promiseOrFunction() : promiseOrFunction);
            let data: T;

            if ((rawResponse as APIResponse<T>).message !== undefined || (rawResponse as APIResponse<T>).data !== undefined) {
                const apiResponse = rawResponse as APIResponse<T>;
                if (apiResponse.message) {
                    return { statusCode: apiResponse.statusCode, message: apiResponse.message, data: apiResponse.data };
                }
                data = apiResponse.data;
            } else {
                data = rawResponse as T;
            }

            const response: APIResponse<T> = { statusCode: HttpStatus.OK, message: 'Ok' };
            if (data !== undefined) {
                response.data = data;
            }
            return response;
        } catch (error) {
            this.logError(error);
            commonErrorHandler(error);
        }
    }

    private logError(error: Error, context?: string) {
        const errorContext = context ? ` in ${context}` : '';
        this.logger.error(
            `Error${errorContext}: ${error.message}`,
            error.stack,
        );
    }
}