import { UserModel } from "../users/user.model";
import { GroupModel } from "./group.model";

export interface AuthModel {
    user: UserModel
    group: GroupModel
}