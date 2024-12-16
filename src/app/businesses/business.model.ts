import { ExperienceModel } from "../experiences/experience.model"
import { ShareholderModel } from "../shareholders/shareholder.model"
import { UserModel } from "../users/user.model"

export interface BusinessModel {
    _id: string
    document: string
    name: string
    emailOne: string
    observations: string
    assignedUser: UserModel
    shareholders: ShareholderModel[]
    experiences: ExperienceModel[]
}