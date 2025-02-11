export interface APIResponse<T = any> {
    statusCode: number;
    message?: string;
    data?: T | undefined;
}