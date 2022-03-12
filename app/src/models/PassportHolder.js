import dayjs from 'dayjs';

export class PassportHolder {

    constructor (key) {
        this.key = key
        this.owner = null
        this.firstname = null
        this.lastname = null
        this.dateOfBirth = null
        this.gender = null
        this.title = null
        this.address = null
        this.phone = null
        this.placeOfBirth = null
        this.nic = null
        this.joinedDate = null
        this.isActive = null
    }

    get publicKey() {
        return this.key.toBase58()
    }

    get joinedAt() {
        return dayjs.unix(this.joinedDate).format('lll')
    }

    get JoinedAgo() {
        return dayjs.unix(this.joinedDate).fromNow()
    }

    get passportHolderDisplayName() {
        if (this.title == null || this.title === '') {
            return this.firstname + ' ' + this.lastname
        }
        return this.title + this.firstname + ' ' + this.lastname
    }
}