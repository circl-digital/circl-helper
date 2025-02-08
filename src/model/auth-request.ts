import { Context } from "./context";

export interface AuthRequest extends Request {
    context: Context;
}
