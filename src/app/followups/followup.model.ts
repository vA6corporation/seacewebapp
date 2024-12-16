import { UserModel } from "../users/user.model"

export interface FollowupModel {
    _id: string
    observations: string
    deletedAt: string | null
    assignedUser: UserModel | null
}