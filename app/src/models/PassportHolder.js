import dayjs from 'dayjs';
import { getVaccinationRecordsOfPassportHolder } from './api';

export class PassportHolder {

    constructor (publicKey, account) {
        this.publicKey = publicKey
        this.owner = account.owner
        this.firstname = account.firstname
        this.lastname = account.lastname
        this.dateOfBirth = account.dateOfBirth
        this.gender = account.gender
        this.title = account.title
        this.address = account.address
        this.phone = account.phone
        this.placeOfBirth = account.placeOfBirth
        this.nic = account.nic
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

    get passportHolderDisplayName() {
        if (this.title == null || this.title === '') {
            return this.firstname + ' ' + this.lastname
        }
        return this.title + this.firstname + ' ' + this.lastname
    }

    get dateOfBirth() {
        return dayjs.unix(this.dateOfBirth).format('lll')
    }

    getVaccinationRecords(wallet){
        return getVaccinationRecordsOfPassportHolder(wallet, this.publicKey)
    }
}