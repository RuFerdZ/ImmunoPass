import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Immunopass } from '../target/types/immunopass';
import * as assert from "assert";
import * as bs58 from "bs58";
import doc = Mocha.reporters.doc;

describe('immunopass', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Immunopass as Program<Immunopass>;

  const holder = anchor.web3.Keypair.generate();
  const doctor = anchor.web3.Keypair.generate();
  const vaccinationCamp = anchor.web3.Keypair.generate();
  const vaccinationRecord = anchor.web3.Keypair.generate();
  const record = anchor.web3.Keypair.generate();


  it('shoud be able to create a doctor', async () => {

    // create new keypair for a doctor
    // const doctor = anchor.web3.Keypair.generate();

    let firstname = "Rusiru";
    let lastname = "Fernando";
    let dateOfBirth = "12";
    let licenseNumber = "DOC001"
    let licenceIssued_date = "12";
    let licenceExpiry_date = "12";
    let businessAddress = "No.1, Galle Road, Colombo";
    let businessTelephone = "0771234567";
    let qualifications = "MBBS, MD";

    // integers of type i64 cant be passed as arguments to the contract

    await program.rpc.createDoctor(firstname, lastname, dateOfBirth, licenseNumber, licenceIssued_date, licenceExpiry_date, businessAddress, businessTelephone, qualifications, {
      accounts: {
        doctor: doctor.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [doctor],
    });

    // check if the doctor is created
    const doctorCreated =await program.account.doctor.fetch(doctor.publicKey);

    assert.equal(doctorCreated.firstname, firstname);
    assert.equal(doctorCreated.lastname, lastname);
    assert.equal(doctorCreated.dateOfBirth, dateOfBirth);
    assert.equal(doctorCreated.licenseNumber, licenseNumber);
    assert.equal(String(doctorCreated.licenceIssuedDate), licenceIssued_date);
    assert.equal(String(doctorCreated.licenceExpiryDate), licenceExpiry_date);
    assert.equal(doctorCreated.businessAddress, businessAddress);
    assert.equal(doctorCreated.businessTelephone, businessTelephone);
    assert.equal(doctorCreated.qualifications, qualifications);
    assert.ok(doctorCreated.joinedDate);

    // console.log(doctorCreated);
  });

  it ('can fetch a doctor by license number', async () => {
    // doctor login
    const searchedDoc = await program.account.doctor.all([
      {
        memcmp: {
          offset: 8 +
              32 +
              4,
          bytes: bs58.encode(Buffer.from("DOC001")),
        }
      }
    ]);

    assert.equal(searchedDoc.length, 1);
  });

  it('cannot create a doctor without a firstname', async () => {
    try{
      // create new keypair for a doctor
      const doctor = anchor.web3.Keypair.generate();

      let firstname = "";
      let lastname = "Fernando";
      let dateOfBirth = "12";
      let licenseNumber = "DOC001"
      let licenceIssued_date = "12";
      let licenceExpiry_date = "12";
      let businessAddress = "No.1, Galle Road, Colombo";
      let businessTelephone = "0771234567";
      let qualifications = "MBBS, MD";

      // integers of type i64 cant be passed as arguments to the contract

      await program.rpc.createDoctor(firstname, lastname, dateOfBirth, licenseNumber, licenceIssued_date, licenceExpiry_date, businessAddress, businessTelephone, qualifications, {
        accounts: {
          doctor: doctor.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [doctor],
      });
    } catch(error) {
      assert.equal(error.msg, 'The first name should not be empty');
      return;
    }
    assert.fail('The instruction should have failed with an empty firstname.');
  });

  it('shoud be able to create a vaccination camp', async () => {

    // create new keypair for a doctor
    const camp = anchor.web3.Keypair.generate();

    let registrationNumber = "MED001";
    let name = "ABC Medical Center";
    let phone = "07123456789";
    let email = "abc.med@immunopass.io"
    let website = "abc.med.com";
    let openingTimes = [
      {
       "day" :"monday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"tuesday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"vednesday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"thursday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"friday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"saturday",
       "time" : "12.00pm - 1.30pm"
      },
      {
       "day" :"sunday",
       "time" : "Closed"
      }
    ];
    let address = "No.1, Galle Road, Colombo";

    // integers of type i64 cant be passed as arguments to the contract

    await program.rpc.createVaccinationCamp(registrationNumber, name, phone, email, website, JSON.stringify(openingTimes), address, {
      accounts: {
        vaccinationCamp: camp.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [camp],
    });

    // check if the doctor is created
    const campCreated =await program.account.vaccinationCamp.fetch(camp.publicKey);

    assert.equal(campCreated.registrationNumber, registrationNumber);
    assert.equal(campCreated.name, name);
    assert.equal(campCreated.phone, phone);
    assert.equal(campCreated.email, email);
    assert.equal(campCreated.website, website);
    assert.equal(campCreated.openingTimes, JSON.stringify(openingTimes));
    assert.equal(campCreated.address, address);
    assert.ok(campCreated.joinedDate);
  });

  it('shoud not be able to create a vaccination camp', async () => {

    // create new keypair for a doctor
    const camp = anchor.web3.Keypair.generate();

    let registrationNumber = "";
    let name = "ABC Medical Center";
    let phone = "07123456789";
    let email = "abc.med@immunopass.io"
    let website = "abc.med.com";
    let openingTimes = [
      {
       "day" :"monday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"tuesday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"vednesday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"thursday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"friday",
       "time" : "4.00pm - 5.30pm"
      },
      {
       "day" :"saturday",
       "time" : "12.00pm - 1.30pm"
      },
      {
       "day" :"sunday",
       "time" : "Closed"
      }
    ];
    let address = "No.1, Galle Road, Colombo";

// integers of type i64 cant be passed as arguments to the contract
    try {
      await program.rpc.createVaccinationCamp(registrationNumber, name, phone, email, website, JSON.stringify(openingTimes), address, {
        accounts: {
          vaccinationCamp: camp.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [camp],
      });
    } catch(error) {
      assert.equal(error.msg, 'The registration number should not be empty');
      return;
    }
    assert.fail('The instruction should have failed with an empty registration number.');
  });

  it('can fetch all doctors', async () => {
    const doctors = await program.account.doctor.all();
    assert.equal(doctors.length, 1);
  });

  it('can fetch all vaccination camps', async () => {
    const vaccinationCamps = await program.account.vaccinationCamp.all();
    assert.equal(vaccinationCamps.length, 1);
  });

  it('can create passport holder', async () => {
    let firstname = "Hasani";
    let lastname = "Dilhari";
    let dateOfBirth = "870976800";
    let gender = "FEMALE";
    let title = "Miss. ";
    let address =  "No. 123, Nittambuwa, Gampaha";
    let phone = "07123456789";
    let placeOfBirth = "Gampaha";
    let nic = "123456789V";

    await program.rpc.createPassportHolder(firstname, lastname, dateOfBirth, gender, title, address, phone, placeOfBirth, nic, {
      accounts: {
        passportHolder: holder.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [holder],
    });
    // check if the doctor is created
    const createdHolder = await program.account.passportHolder.fetch(holder.publicKey);
    assert.equal(createdHolder.firstname, firstname);
    assert.equal(createdHolder.lastname, lastname);
    assert.equal(createdHolder.dateOfBirth, dateOfBirth);
    assert.equal(createdHolder.address, address);
    assert.equal(createdHolder.phone, phone);
    assert.equal(createdHolder.placeOfBirth, placeOfBirth);
    assert.equal(createdHolder.nic, nic);
    assert.ok(createdHolder.joinedDate);
  });

  it('can verify the passport holder', async () => {

    let nic = "123456789V";
    // Update the Tweet.
    await program.rpc.checkPassportHolderValidity( {
      accounts: {
        passportHolder: holder.publicKey,
        author: program.provider.wallet.publicKey,
      },
    });

    // Ensure the updated tweet has the updated data.
    const verifiedHolder = await program.account.passportHolder.fetch(holder.publicKey);

    assert.equal(verifiedHolder.nic, nic);
    assert.ok(verifiedHolder.joinedDate);
    assert.equal(verifiedHolder.isActive, true);
  });

  it('can create passport holder without a NIC number', async () => {
    // create new keypair for a passport holder
    const holder02 = anchor.web3.Keypair.generate();

    let firstname = "Dilanka";
    let lastname = "Harshani";
    let dateOfBirth = "870976800";
    let gender = "FEMALE";
    let title = "Miss. ";
    let address =  "No. 123, Nittambuwa, Gampaha";
    let phone = "07123456789";
    let placeOfBirth = "Gampaha";
    let nic = "";

    await program.rpc.createPassportHolder(firstname, lastname, dateOfBirth, gender, title, address, phone, placeOfBirth, nic, {
      accounts: {
        passportHolder: holder02.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [holder02],
    });

    // check if the doctor is created
    const createdHolder = await program.account.passportHolder.fetch(holder02.publicKey);

    assert.equal(createdHolder.firstname, firstname);
    assert.equal(createdHolder.lastname, lastname);
    assert.equal(createdHolder.dateOfBirth, dateOfBirth);
    assert.equal(createdHolder.address, address);
    assert.equal(createdHolder.phone, phone);
    assert.equal(createdHolder.placeOfBirth, placeOfBirth);
    assert.equal(createdHolder.nic, nic);
    assert.ok(createdHolder.joinedDate);
  });

  it('can fetch all passport holders', async () => {
    const passportHolders = await program.account.passportHolder.all();
    assert.equal(passportHolders.length, 2);
  });

  it('can create vaccination records', async () => {
    // create new keypair for a passport holder
    const record = anchor.web3.Keypair.generate();

    let vaccine = "BCG";
    let notes = "Dose 1";
    let age = "5";
    let weight = "13";
    let dosage = "10mg";
    let batch_number = "BCG_123456789";

    await program.rpc.createVaccinationRecord(vaccine, notes, age, weight, dosage, batch_number, program.provider.wallet.publicKey, vaccinationCamp.publicKey, holder.publicKey, {
      accounts: {
        vaccinationRecord: record.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [record],
    });

    // check if the doctor is created
    const createdRecord = await program.account.vaccinationRecord.fetch(record.publicKey);

    assert.equal(createdRecord.vaccine, vaccine);
    assert.equal(createdRecord.notes, notes);
    assert.equal(createdRecord.age, age);
    assert.equal(createdRecord.weight, weight);
    assert.equal(createdRecord.dosage, dosage);
    assert.equal(createdRecord.batchNumber, batch_number);
    assert.equal(createdRecord.doctor.toString(), program.provider.wallet.publicKey.toString());
    assert.equal(createdRecord.vaccinationCamp.toString(), vaccinationCamp.publicKey.toString());
    assert.equal(createdRecord.passportHolder.toString(), holder.publicKey.toString());
    assert.ok(createdRecord.createdDate);
  });

  it ('can fetch vaccination records of passport holder', async () => {
    const records = await program.account.vaccinationRecord.all([
      {
        memcmp: {
          offset: 8,
          bytes: holder.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(records.length, 1);
  });

  it('can fetch all vaccination records', async () => {
    const vaccinationRecords = await program.account.vaccinationRecord.all();
    assert.equal(vaccinationRecords.length, 1);
  });

  it('can create verification records', async () => {
    // create new keypair for a passport holder
    const vRecord = anchor.web3.Keypair.generate();

    let recordType = "vaccination";
    let validatorType = "doctor";
    let status = "Valid";
    let notes = "No issues";

    await program.rpc.createValidationRecord(recordType, vaccinationRecord.publicKey, validatorType, program.provider.wallet.publicKey, status, notes, {
      accounts: {
        validationRecord: vRecord.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [vRecord],
    });

    // check if the doctor is created
    const createdVerificationRecord = await program.account.validationRecord.fetch(vRecord.publicKey);

    assert.equal(createdVerificationRecord.recordType, recordType.toUpperCase());
    assert.equal(createdVerificationRecord.record.toString(), vaccinationRecord.publicKey.toString());
    assert.equal(createdVerificationRecord.validatorType, validatorType.toUpperCase());
    assert.equal(createdVerificationRecord.validator.toString(), program.provider.wallet.publicKey.toString());
    assert.equal(createdVerificationRecord.status, status.toUpperCase());
    assert.equal(createdVerificationRecord.notes, notes);
    assert.ok(createdVerificationRecord.createdDate);
  });

  it('can fetch all verification records', async () => {
    const verificationRecords = await program.account.validationRecord.all();
    assert.equal(verificationRecords.length, 1);
  });

  it ('can fetch a doctor by wallet address', async () => {
    // doctor login
    const searchedDoc = await program.account.doctor.all([
      {
        memcmp: {
          offset: 8,
          bytes: program.provider.wallet.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(searchedDoc.length, 1);
    // console.log(searchedDoc[0]);
  });

  it ('can fetch a vaccination camp by wallet address', async () => {
    // vaccination camp login
    const searchedVC = await program.account.vaccinationCamp.all([
      {
        memcmp: {
          offset: 8,
          bytes: program.provider.wallet.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(searchedVC.length, 1);
  });

  it ('can fetch a passport holder by wallet address', async () => {
    const searchedPH = await program.account.passportHolder.all([
      {
        memcmp: {
          offset: 8,
          bytes: program.provider.wallet.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(searchedPH.length, 2);
  });

  it('can validate vaccination records', async () => {

    const doctor01 = anchor.web3.Keypair.generate();
    const vaccinationCamp01 = anchor.web3.Keypair.generate();
    const holder01 = anchor.web3.Keypair.generate();

    let signature = await program.provider.connection.requestAirdrop(doctor01.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    signature = await program.provider.connection.requestAirdrop(vaccinationCamp01.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    signature = await program.provider.connection.requestAirdrop(holder01.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    let vaccine = "BCG";
    let notes = "Dose 1";
    let age = "5";
    let weight = "13";
    let dosage = "10mg";
    let batch_number = "BCG_123456789";

    await program.rpc.createVaccinationRecord(vaccine, notes, age, weight, dosage, batch_number, doctor01.publicKey, vaccinationCamp01.publicKey, holder01.publicKey, {
      accounts: {
        vaccinationRecord: record.publicKey,
        author: doctor01.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [doctor01, record],
    });

    // create new keypair for a passport holder
    const docRecord = anchor.web3.Keypair.generate();

    let recordType = "vaccination";
    let validatorType = "doctor";
    let status = "Valid";
    notes = "No issues";


    await program.rpc.createValidationRecord(recordType, record.publicKey, validatorType, doctor01.publicKey, status, notes, {
      accounts: {
        validationRecord: docRecord.publicKey,
        author: doctor01.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [doctor01, docRecord],
    });


    const vcRecord = anchor.web3.Keypair.generate();
    validatorType = "vaccination_camp";

    await program.rpc.createValidationRecord(recordType, record.publicKey, validatorType, vaccinationCamp01.publicKey, status, notes, {
      accounts: {
        validationRecord: vcRecord.publicKey,
        author: vaccinationCamp01.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [vaccinationCamp01, vcRecord],
    });

    validatorType = "passport_holder";
    const phRecord = anchor.web3.Keypair.generate();

    await program.rpc.createValidationRecord(recordType, record.publicKey, validatorType, holder01.publicKey, status, notes, {
      accounts: {
        validationRecord: phRecord.publicKey,
        author: holder01.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [holder01, phRecord],
    });

    // validation
    // await program.rpc.checkVaccinationRecordValidity({
    //   accounts: {
    //     vaccinationRecord: record.publicKey,
    //     docVerificationRecord: docRecord.publicKey,
    //     phVerificationRecord: phRecord.publicKey,
    //     vcVerificationRecord: vcRecord.publicKey,
    //     author: doctor01.publicKey,
    //   },
    // });

  });


  it ('can fetch a validation records of a vaccination record', async () => {
    const records = await program.account.validationRecord.all([
      {
        memcmp: {
          offset: 8,
          bytes: record.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(records.length, 3);  // because we have created 3 validation records above
  });

  it ('can fetch a vaccinations records of a vaccination camp', async () => {
    const vaccinations = await program.account.vaccinationRecord.all([
      {
        memcmp: {
          offset: 8 + 32 + 32,
          bytes: vaccinationCamp.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(vaccinations.length, 1);  // because we have created 1 vaccination record above
  });

  it ('can fetch a vaccinations records of a doctor', async () => {
    const vaccinations = await program.account.vaccinationRecord.all([
      {
        memcmp: {
          offset: 8 + 32,
          bytes: doctor.publicKey.toBase58(),
        }
      }
    ]);

    assert.equal(vaccinations.length, 0);  // because we have created 0 vaccination record above
  });

  it ('can fetch a passport holder by nic', async () => {

    const records = await program.account.passportHolder.all([
      {
        memcmp: {
          offset: 8 + 32 + 4,
          bytes:  bs58.encode(Buffer.from('123456789V')),
        }
      }
    ]);

    console.log(records);
    assert.equal(records.length, 3);  // because we have created 3 validation records above
  });
});
