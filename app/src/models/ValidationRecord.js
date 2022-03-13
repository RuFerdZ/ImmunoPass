import dayjs from 'dayjs';
import { getDoctorByPubKey, getVaccinationCampByPubKey, getPassportHolderByPubKey } from '../api'


export class ValidationRecord {

    constructor (publicKey, account) {
        this.publicKey = publicKey
        this.recordType = account.recordType
        this.record = account.record
        this.validatorType = account.validatorType
        this.validator = account.validator
        this.status = account.status
        this.notes = account.notes
        this.createdDate = account.createdDate
    }

    get publicKey() {
        return this.key.toBase58()
    }

    get validatorPublicKey() {
        return this.validator.toBase58()
    }

    get recordPublicKey() {
        return this.record.toBase58()
    }

    get createdAt() {
        return dayjs.unix(this.createdDate).format('lll')
    }

    get createdAgo() {
        return dayjs.unix(this.createdDate).fromNow()
    }

    getValidatorDetails(wallet) {
        if (this.validatorType === 'DOCTOR') {
            return getDoctorByPubKey(wallet, this.validatorPublicKey)
        } else if (this.validatorType === 'PASSPORT_HOLDER') {
            return getPassportHolderByPubKey(wallet, this.validatorPublicKey)
        } else if (this.validatorType === 'VACCINATION_CAMP') {
            return getVaccinationCampByPubKey(wallet, this.validatorPublicKey)
        } 
        return "UNKNOWN";
    }
}