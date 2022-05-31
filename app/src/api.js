import { Program, web3 } from '@project-serum/anchor';
import { Provider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { workspace, network, opts } from '../src/config';
import { Doctor } from '../src/models/Doctor';
import { VaccinationCamp } from '../src/models/VaccinationCamp';
import { PassportHolder } from '../src/models/PassportHolder';
import { VaccinationRecord } from '../src/models/VaccinationRecord';
import { ValidationRecord } from '../src/models/ValidationRecord';
import * as bs58 from "bs58";
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';

const { SystemProgram, Keypair } = web3;


async function getProvider(wallet) {
    const connection = new Connection(network.local, opts.preflightCommitment);
    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
}


// DOCTOR ENDPOINTS
export async function createDoctor(wallet, doctor) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate()
    
    doctor.publicKey = keypair.publicKey;
  
    try {
        await program.rpc.createDoctor(
            doctor.firstname, 
            doctor.lastname, 
            doctor.dateOfBirth,
            doctor.licenseNumber, 
            doctor.licenseIssuedDate, 
            doctor.licenseExpiryDate, 
            doctor.businessAddress, 
            doctor.businessTelephone, 
            doctor.qualifications,
            {
                accounts: {
                    doctor: doctor.publicKey,
                    author: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,

                },
                signers: [keypair]
            });
        return await getDoctorByPubKey(provider, doctor.publicKey);
    } catch (err) {
        console.log("Error in creating new doctor. - " + err);
        return null;
    }
}

export async function getDoctorByPubKey(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const doctor = await program.account.doctor.fetch(pubKey);
        return doctor;
    } catch (err) {
        console.log("Error in getting doctor by public key. - " + err);
        return null;
    }
}

export async function getDoctorByLicenseNumber(wallet, licenseNumber) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const doctor = await program.account.doctor.all(
            [
                {
                  memcmp: {
                    offset: 8 +
                    32 +
                    4,
                    bytes: bs58.encode(Buffer.from(licenseNumber)),
                  }
                }
              ]
        )
        return doctor[0]
    } catch (err) {
        console.log("Error in getting doctor by license number. - " + err);
        return null;
    }
}

export async function getDoctorByWalletAddress(wallet) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const doctor = await program.account.doctor.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: program.provider.wallet.publicKey.toBase58(),
                  }
                }
              ]
        )
        return doctor[0]
    } catch (err) {
        console.log("Error in getting doctor by wallet address. - " + err);
        return null;
    }
}

export async function initiateVaccinationRecord(wallet, vaccinationRecord) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate()

    vaccinationRecord.publicKey = keypair.publicKey;
    console.log(vaccinationRecord)
    try {
        await program.rpc.createVaccinationRecord(
            vaccinationRecord.vaccine, 
            vaccinationRecord.notes, 
            vaccinationRecord.age, 
            vaccinationRecord.weight, 
            vaccinationRecord.dosage, 
            vaccinationRecord.batchNumber, 
            provider.wallet.publicKey, 
            vaccinationRecord.vaccinationCamp, 
            vaccinationRecord.passportHolder, 
            {
                accounts: {
                    vaccinationRecord: vaccinationRecord.publicKey,
                    author: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [keypair],
            });
            return await getVaccinationRecordByPubkey(wallet, vaccinationRecord.publicKey);
    } catch (err) {
        console.log("Error in initiating vaccination record. - " + err);
        return null;
    }
}

export async function getAssignedVaccinationsForDoctor(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try{
        const vaccinations = await program.account.vaccinationRecord.all(
            [
                {
                  memcmp: {
                    offset: 8 +
                    32,
                    bytes: pubKey.toBase58(),
                  }
                }
              ]
        )
        return vaccinations.map(vaccination => new VaccinationRecord(vaccination.publicKey, vaccination.account));
    } catch (err) {
        console.log("Error in getting vaccination records of a doctor. - " + err);
    }
    return null;
}



// VACCINATION CAMP ENDPOINTS

export async function createVaccinationCamp(wallet, vaccinationCamp) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate();

    vaccinationCamp.publicKey = keypair.publicKey;

    console.log(vaccinationCamp);
    
    try {
        await program.rpc.createVaccinationCamp(
            vaccinationCamp.registrationNumber, 
            vaccinationCamp.name, 
            vaccinationCamp.phone, 
            vaccinationCamp.email, 
            vaccinationCamp.website, 
            vaccinationCamp.openingTimes, 
            vaccinationCamp.address, 
            {
                accounts: {
                    vaccinationCamp: vaccinationCamp.publicKey,
                    author: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [keypair],
            }
        );
        getVaccinationCampByPubKey(wallet, vaccinationCamp.publicKey);
    } catch (err) {
        console.log("Error in creating vaccination camp. - " + err);
        return null;
    }
}

export async function getVaccinationCampByPubKey(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try {
        const vaccinationCamp = await program.account.vaccinationCamp.fetch(pubKey);
        console.log(vaccinationCamp);
        return vaccinationCamp;
    } catch (err) {
        console.log("Error in getting vaccination camp by public key. - " + err);
    }
    return null;
}

export async function getVaccinationCampByWalletAddress(wallet) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const vaccination_camp = await program.account.vaccinationCamp.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: program.provider.wallet.publicKey.toBase58(),
                  }
                }
              ]
        )
        return vaccination_camp[0]
    } catch (err) {
        console.log("Error in getting vaccination campe by wallet address. - " + err);
        return null;
    }
}


export async function getAssignedVaccinationsForCamp(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try{
        const vaccinations = await program.account.vaccinationRecord.all(
            [
                {
                  memcmp: {
                    offset: 8 +
                    32 +
                    32,
                    bytes: pubKey.toBase58(),
                  }
                }
              ]
        )
        return vaccinations.map(vaccination => new VaccinationRecord(vaccination.publicKey, vaccination.account));
    } catch (err) {
        console.log("Error in getting vaccination records of a vaccination camp. - " + err);
    }
    return null;
}

export async function getVaccinationCampByRegistrationNumber(wallet, regNo) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const vaccination_camp = await program.account.vaccinationCamp.all(
            [
                {
                  memcmp: {
                    offset: 8 + 32 + 4,
                    bytes: bs58.encode(Buffer.from(regNo)),
                  }
                }
              ]
        )
        return vaccination_camp[0]
    } catch (err) {
        console.log("Error in getting vaccination campe by registration number. - " + err);
        return null;
    }
}




// PASSPORT HOLDER ENDPOINTS

export async function createPassportHolder(wallet, passportHolder) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate();

    passportHolder.publicKey = keypair.publicKey;

    // passportHolder.dateOfBirth = "893643173"

    try {
        await program.rpc.createPassportHolder(
            passportHolder.firstname, 
            passportHolder.lastname, 
            passportHolder.dateOfBirth, 
            passportHolder.gender, 
            passportHolder.title, 
            passportHolder.address, 
            passportHolder.phone, 
            passportHolder.placeOfBirth, 
            passportHolder.nic, 
            {
                accounts: {
                    passportHolder: passportHolder.publicKey,
                    author: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [keypair],
          }); 

          return await getPassportHolderByPubKey(wallet, passportHolder.publicKey);
    } catch (err) {
        console.log("Error in creating passport holder. - " + err);
        return null;
    }

}

export async function getPassportHolderByPubKey(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    console.log(pubKey)
    try {
        const passportHolder = await program.account.passportHolder.fetch(pubKey);
        console.log(passportHolder);
        return passportHolder;
    } catch (err) {
        console.log("Error in getting passport holder by public key. - " + err);
    }
    return null;
}

export async function getPassportHolderByWalletAddress(wallet) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const passportHolder = await program.account.passportHolder.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: program.provider.wallet.publicKey.toBase58(),
                  }
                }
              ]
        )
        // console.log(passportHolder[0]);
        // console.log("public key - " + passportHolder[0].publicKey);
        return passportHolder[0];
    } catch (err) {
        console.log("Error in getting passport holder by wallet address. - " + err);
    }
    return null;
}

export async function getPassportHolderByOtherPublicKey(wallet, pubkey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        const passportHolder = await program.account.passportHolder.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: program.provider.pubkey.toBase58(),
                  }
                }
              ]
        )
        console.log(passportHolder[0]);
        // console.log("public key - " + passportHolder[0].publicKey);
        return passportHolder[0];
    } catch (err) {
        console.log("Error in getting other passport holder by wallet address. - " + err);
    }
    return null;
}


export async function getPassportHolderByNIC(wallet, nic) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try {
        const records = await program.account.passportHolder.all([
            {
              memcmp: {
                offset: 8 + 32 + 4,
                bytes:  bs58.encode(Buffer.from(nic)),
              }
            }
          ]);
        console.log(records[0]);
        return records[0];
    } catch (err) {
        console.log("Error in getting passport holder by NIC. - " + err);
    }
    return null;
}


// VALIDATION ENDPOINTS

export async function validatePassportHolder(wallet, validationRecord) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate();

    validationRecord.publicKey = keypair.publicKey;
    validationRecord.recordType = "passport_holder";

    if (validationRecord.validator === provider.wallet.publicKey) {

        try {
            await program.rpc.createValidationRecord(
                validationRecord.recordType, 
                validationRecord.record, 
                validationRecord.validatorType, 
                validationRecord.validator, 
                validationRecord.status, 
                validationRecord.notes, {
                accounts: {
                validationRecord: validationRecord.publicKey,
                author: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                },
                signers: [keypair],
            });

            return await getValidationRecordByPublicKey(wallet, validationRecord.publicKey);
        } catch (err) {
            console.log("Error in validating passport holder. - " + err);
            return null;
        }
    } else {
        console.log("invalid validator")
        return null;
    }
}

export async function validateVaccination(wallet, validationRecord) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    const keypair = Keypair.generate();

    validationRecord.publicKey = keypair.publicKey;
    validationRecord.recordType = "vaccination";

    if (validationRecord.validator === provider.wallet.publicKey) {

        try {
            await program.rpc.createValidationRecord(
                validationRecord.recordType, 
                validationRecord.record, 
                validationRecord.validatorType, 
                validationRecord.validator, 
                validationRecord.status, 
                validationRecord.notes, {
                    accounts: {
                        validationRecord: validationRecord.publicKey,
                        author: provider.wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    },
                    signers: [keypair],
            });

            return await getValidationRecordByPublicKey(wallet, validationRecord.publicKey);
        } catch (err) {
            console.log("Error in validating passport holder. - " + err);
            return null;
        }
    } else {
        console.log("invalid validator")
        return null;
    }
}

export async function getValidationRecordByPublicKey(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try {
        const validationRecord = await program.account.validationRecord.fetch(pubKey);
        return new ValidationRecord(validationRecord.publicKey, validationRecord.account);
    } catch (err) {
        console.log("Error in getting validation record by public key. - " + err);
    }
    return null;
}

export async function getValidationRecordsOfRecord(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try{
        const records = await program.account.validationRecord.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: pubKey.toBase58(),
                  }
                }
              ]
        )
        return records.map(record => new ValidationRecord(record.publicKey, record.account));
    } catch (err) {
        console.log("Error in getting validation records of a record. - " + err);
    }
    return null;
}


// VACCINATION RECORD ENDPOINTS

export async function getVaccinationRecordByPubkey(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try {
        const vaccination = await program.account.vaccinationRecord.fetch(pubKey);
        return vaccination;
    } catch (err) {
        console.log("Error in getting vaccination record by public key. - " + err);
    }
    return null;
}

export async function getVaccinationRecordsOfPassportHolder(wallet, pubKey) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);

    try{
        const records = await program.account.vaccinationRecord.all(
            [
                {
                  memcmp: {
                    offset: 8,
                    bytes: pubKey,
                  }
                }
              ]
        )
        return records.map(record => new VaccinationRecord(record.publicKey, record.account));
    } catch (err) {
        console.log("Error in getting vaccination records of passport holder. - " + err);
    }
    return null;
}

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
 }

