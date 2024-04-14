import { IUnitOfWork } from "src/@core/common/application/unit-of-work.interface";
import { IPartnerRepository } from "../domain/repositories/partner-repository.interface";
import { Partner } from "../domain/entities/partner.entity";

export class PartnerService {
    
    constructor(
        private partnerRepo: IPartnerRepository,
        private uow: IUnitOfWork
        ) {}
    
    list() {
        return this.partnerRepo.findAll();
    }

    async register(input: {name: string}) {
        const partner = Partner.create(input);
        this.partnerRepo.add(partner);
        await this.uow.commit();
        return partner;
    }

    async update(id: string, input: {name?: string}) {
        const partner = await this.partnerRepo.findById(id);
        
        if (!partner) {
            throw new Error("Partner not found");
        }
        
        input.name && partner.changeName(input.name);
        this.partnerRepo.add(partner);
        await this.uow.commit();
        
        return partner;
    }
}