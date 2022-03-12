import dayjs from 'dayjs';

export class ValidationRecord {

    constructor (key) {
        this.key = key
        this.recordType = null
        this.record = null
        this.validatorType = null
        this.validator = null
        this.status = null
        this.notes = null
        this.createdDate = null
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