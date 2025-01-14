import { BeneficiaryModel } from "../beneficiaries/beneficiary.model";
import { BusinessModel } from "../businesses/business.model";
import { PartnershipModel } from "../partnerships/partnership.model";

interface GuaranteeModel {

}

export interface TemplateModel {
    _id: string
    businessId: string
    templatePartnershipId: string
    startDate: string
    business: BusinessModel
    guaranties: GuaranteeModel[]
    partnership: PartnershipModel | null
    beneficiary: BeneficiaryModel
    tenderNumber: string
}