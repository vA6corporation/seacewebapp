import { ActiveModuleModel } from "../auth/active-module.model"

export class UserModel {
    _id: string = ''
    name: string = ''
    firstName: string = ''
    email: string = ''
    password: string = ''
    isAdmin: boolean = false
    privileges: ActiveModuleModel = {}
}
