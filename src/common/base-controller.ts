import {
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { APIResponse } from '../model/api-response';


export abstract class BaseController {
    protected readonly logger = new Logger(BaseController.name);

    /**
     * Handles the execution of a Promise, catching errors and standardizing responses.
     * @param promise The Promise to be executed
     * @param successMessage Optional success message
     * @param context Optional context for logging (usually the method name)
     * @returns Standardized response format
     */
    protected async handleResponse<T>(
        promiseOrFunction: (() => Promise<APIResponse<T>>) | (() => Promise<T>),
    ): Promise<APIResponse<T>> {
        try {
            const rawResponse = await (typeof promiseOrFunction === 'function' ? promiseOrFunction() : promiseOrFunction);
            let data: T;

            if ((rawResponse as APIResponse<T>).message !== undefined || (rawResponse as APIResponse<T>).data !== undefined) {
                const apiResponse = rawResponse as APIResponse<T>;
                if (apiResponse.message) {
                    return { data: null, message: apiResponse.message };
                }
                data = apiResponse.data;
            } else {
                data = rawResponse as T;
            }

            return { data: data, message: 'Ok' };
        } catch (error) {
            this.logError(error);

            if (Object.getPrototypeOf(error)?.constructor?.name === 'HttpException') {
                throw error;
            }

            throw new InternalServerErrorException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal server error',
            });
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