import dayjs from 'dayjs';

export class VaccinationCamp {

    constructor (publicKey, account) {
        this.publicKey = publicKey
        this.owner = account.owner
        this.registrationNumber = account.registrationNumber
        this.name = account.name
        this.phone = account.phone
        this.email = account.email
        this.website = account.website
        this.openingTimes = account.openingTimes
        this.address = account.address
        this.joinedDate = account.joinedDate
        this.isActive = account.isActive
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
}