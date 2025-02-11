import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function errorHandler(error: Error): void {

    if (Object.getPrototypeOf(error)?.constructor?.name === 'PrismaClientKnownRequestError') {
        console.log('Prisma Error')
        switch ((error as PrismaClientKnownRequestError).code) {
            case 'P2002':
                throw new HttpException('Already Exist', HttpStatus.CONFLICT);
            case 'P2003':
                throw new HttpException('Foreign key constraint failed', HttpStatus.BAD_REQUEST);
            case 'P2001':
            case 'P2025':
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            // Add more cases as needed
            default:
                throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    if (Object.getPrototypeOf(error)?.constructor?.name === 'HttpException') {
        throw error;
    }

    throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server errosr',
    });

}