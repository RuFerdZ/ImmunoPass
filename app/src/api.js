import { Program, web3 } from '@project-serum/anchor';
import { Provider } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { workspace, network, opts } from '../src/config';
import { Doctor } from '../src/models/Doctor';
import { VaccinationCamp } from '../src/models/VaccinationCamp';
import { PassportHolder } from '../src/models/PassportHolder';
import { VaccinationRecord } from '../src/models/VaccinationRecord';
import { ValidationRecord } from '../src/models/ValidationRecord';

const { SystemProgram, Keypair } = web3;

async function getProvider(wallet) {
    const connection = new Connection(network.local, opts.preflightCommitment);
    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
}

async function createDoctor(wallet, doctor) {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    
    doctor.publicKey = Keypair.generate();

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
                signers: [doctor]
            });
    } catch (err) {
        console.log("Error in creating new doctor. - " + err);
    }
    
}

async function createVaccinationCamp() {

}

async function createPassportHolder() {

}

async function validatePassportHolder() {

}


async function initiateVaccinationRecord() {

}

async function validateVaccination() {

}

async function getDoctor() {

}

async function getPassportHolder() {

}

async function getVaccinationCamp() {

}

async function getVaccinationRecord() {

}

async function getValidationRecord() {

}

async function getVaccinationRecordsOfPassportHolder() {

}

async function getValidationRecordsOfVaccination() {

}

async function getValidationRecordsOfPassportHolder() {

}