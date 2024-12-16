import { FollowupModel } from "../followups/followup.model"

export interface SeaceModel {
    _id: string
    idProcess: string
    publishedAt: string
    advertisementAt: string
    convener: string
    goodProAt: string
    adjudicatedAt: string | null
    objectDescription: string
    objectContract: string
    nomenclature: string
    referenceValue: string
    state: string
    department: string
    isOfferAtag: string
    isBaseAtag: string
    followup: FollowupModel | null
    winners: string[]
}