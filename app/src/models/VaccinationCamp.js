import dayjs from 'dayjs';

export class VaccinationCamp {

    constructor (key) {
        this.key = key
        this.owner = null
        this.registrationNumber = null
        this.name = null
        this.phone = null
        this.email = null
        this.website = null
        this.openingTimes = null
        this.address = null
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
}