import dayjs from 'dayjs';

export class Doctor {

    constructor (key, account) {
        this.key = key
        this.owner = account.owner
        this.firstname = account.firstname
        this.lastname = account.lastname
        this.dateOfBirth = account.dateOfBirth
        this.licenseNumber = account.licenseNumber
        this.licenseIssuedDate = account.licenseIssuedDate
        this.licenseExpiryDate = account.licenseExpiryDate
        this.businessAddress = account.businessAddress
        this.businessTelephone = account.businessTelephone
        this.qualifications = account.qualifications
        this.joinedDate = account.joinedDate
        this.isActive =  account.isActive    
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

    get dateOfBirth() {
        return dayjs.unix(this.dateOfBirth).format('lll')
    }

    get licenseExpiryDate() {
        return dayjs.unix(this.licenseExpiryDate).format('lll')
    }

    get licenseIssuedDate() {
        return dayjs.unix(this.licenseIssuedDate).format('lll')
    }
}
