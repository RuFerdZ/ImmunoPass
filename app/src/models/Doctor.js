import dayjs from 'dayjs';

export class Doctor {

    constructor (key) {
        this.key = key
        this.owner = null
        this.firstname = null
        this.lastname = null
        this.dateOfBirth = null
        this.licenseNumber = null
        this.licenseIssuedDate = null
        this.licenseExpiryDate = null
        this.businessAddress = null
        this.businessTelephone = null
        this.qualifications = null
        this.joinedDate = null
        this.isActive = null    
    }

    get publicKey() {
        return this.key.toBase58()
    }

    // get doctorDisplayName() {
    //     const author = this.author.toBase58()
    //     return author.slice(0,4) + '..' + author.slice(-4)
    // }

    get joinedAt() {
        return dayjs.unix(this.joinedDate).format('lll')
    }

    get JoinedAgo() {
        return dayjs.unix(this.joinedDate).fromNow()
    }

    get doctorDisplayName() {
        return 'Dr. ' + this.firstname + ' ' + this.lastname
    }
}
