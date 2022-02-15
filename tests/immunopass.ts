import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Immunopass } from '../target/types/immunopass';
import * as assert from "assert";
import * as bs58 from "bs58";

describe('immunopass', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Immunopass as Program<Immunopass>;

  it('shoud be able to create a doctor', async () => {
    
    // create new keypair for a doctor
    const doctor = anchor.web3.Keypair.generate();

    var firstname = "Rusiru";
    var lastname = "Fernando";
    var dateOfBirth = "12";
    var licenseNumber = "DOC001"
    var licenceIssued_date = "12";
    var licenceExpiry_date = "12";
    var businessAddress = "No.1, Galle Road, Colombo";
    var businessTelephone = "0771234567";
    var qualifications = "MBBS, MD";

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
  });


  it('cannot create a doctor without a firstname', async () => {
    try{
      // create new keypair for a doctor
      const doctor = anchor.web3.Keypair.generate();

      var firstname = "";
      var lastname = "Fernando";
      var dateOfBirth = "12";
      var licenseNumber = "DOC001"
      var licenceIssued_date = "12";
      var licenceExpiry_date = "12";
      var businessAddress = "No.1, Galle Road, Colombo";
      var businessTelephone = "0771234567";
      var qualifications = "MBBS, MD";

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

    var registrationNumber = "MED001";
    var name = "ABC Medical Center";
    var phone = "07123456789";
    var email = "abc.med@immunopass.io"
    var web = "abc.med.com";
    var openingTimes = "12";
    var address = "No.1, Galle Road, Colombo";

// integers of type i64 cant be passed as arguments to the contract

    await program.rpc.createVaccinationCamp(registrationNumber, name, phone, email, web, openingTimes, address, {
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
    assert.equal(campCreated.web, web);
    assert.equal(campCreated.openingTimes, openingTimes);
    assert.equal(campCreated.address, address);
    assert.ok(campCreated.joinedDate);

    // timstamp to date
    let unix_timestamp = campCreated.joinedDate;
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  });

});
