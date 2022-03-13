import dayjs from 'dayjs';

export class ValidationRecord {

    constructor (key, account) {
        this.key = key
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
}