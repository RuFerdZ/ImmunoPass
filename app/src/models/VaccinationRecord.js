import dayjs from 'dayjs';

export class VaccinationRecord {

    constructor (key) {
        this.key = key
        this.owner = null
        this.createdDate = null
        this.vaccine = null
        this.notes = null
        this.age = null
        this.weight = null
        this.dosage = null
        this.batchNumber = null
        this.doctor = null
        this.vaccinationCamp = null
        this.passportHolder = null
        this.status = null
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