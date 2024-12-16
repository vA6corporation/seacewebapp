import { BusinessModel } from "../businesses/business.model";
import { SeaceModel } from "../seaces/seace.model";
import { UserModel } from "../users/user.model";

export interface NotificationModel {
    _id: string
    business: BusinessModel
    seace: SeaceModel
    assignedUser: UserModel
    createdAt: string
    adjudicatedAt: string
}