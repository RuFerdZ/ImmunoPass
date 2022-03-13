import dayjs from 'dayjs';

export class VaccinationRecord {

    constructor (key, account) {
        this.key = key
        this.owner = account.owner
        this.createdDate = account.createdDate
        this.vaccine = account.vaccine
        this.notes = account.notes
        this.age = account.age
        this.weight = account.weight
        this.dosage = account.dosage
        this.batchNumber = account.batchNumber
        this.doctor = account.doctor
        this.vaccinationCamp = account.vaccinationCamp
        this.passportHolder = account.passportHolder
        this.status = account.status
    }

    get publicKey() {
        return this.key.toBase58()
    }

    get doctorPublicKey() {
        return this.doctor.toBase58()
    }

    get passportHolderPublicKey() {
        return this.passportHolder.toBase58()
    }

    get vaccinationCampPublicKey() {
        return this.vaccinationCamp.toBase58()
    }

    get createdAt() {
        return dayjs.unix(this.createdDate).format('lll')
    }

    get createdAgo() {
        return dayjs.unix(this.createdDate).fromNow()
    }
}