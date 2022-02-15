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


    // console.log(doctorCreated);
  });

});
