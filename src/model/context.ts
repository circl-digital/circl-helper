import { User } from "./user";

export type Context = {
    user: User;
    isAdmin: boolean;
    isOwner: boolean;
    isStaff: boolean;
};
