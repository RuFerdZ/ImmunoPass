use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("HoVPS3s5fbgFfbXAuGg6hfL8CKMYjLBhPHdtfqBgLNMG");

#[program]
pub mod immunopass {
    use super::*;

    pub fn create_doctor(ctx: Context<CreateDoctor>, firstname: String, lastname: String, date_of_birth: String, license_number: String, licence_issued_date: String, licence_expiry_date: String, business_address: String, business_telephone: String, qualifications: String) -> ProgramResult {

        let doctor: &mut Account<Doctor> = &mut ctx.accounts.doctor;
        let author: &Signer = &ctx.accounts.author;
        let joined_date: Clock = Clock::get().unwrap();

        // validate first name
        if firstname.is_empty() {
            return Err(ErrorCode::FirstNameEmpty.into());
        } else if firstname.chars().count() > 50 {
            return Err(ErrorCode::FirstNameTooLong.into());
        }

        doctor.owner = *author.key;
        doctor.firstname = firstname;
        doctor.lastname = lastname;
        doctor.date_of_birth = date_of_birth.parse().unwrap();
        doctor.license_number = license_number;
        doctor.licence_issued_date = licence_issued_date.parse().unwrap();
        doctor.licence_expiry_date = licence_expiry_date.parse().unwrap();
        doctor.business_address = business_address;
        doctor.business_telephone = business_telephone;
        doctor.qualifications = qualifications;
        doctor.joined_date = joined_date.unix_timestamp;
        doctor.is_active = true;

        Ok(())
    }

    pub fn create_vaccination_camp(ctx: Context<CreateVaccinationCamp>, registration_number: String, name: String, phone: String, email: String, website: String, opening_times: String, address: String) -> ProgramResult {
    
        let vaccination_camp: &mut Account<VaccinationCamp> = &mut ctx.accounts.vaccination_camp;
        let author: &Signer = &ctx.accounts.author;
        let joined_date: Clock = Clock::get().unwrap();

    
        // check if registration number is empry
        if registration_number.is_empty() {
            return Err(ErrorCode::RegistrationNumberEmpty.into());
        }

        vaccination_camp.owner = *author.key;
        vaccination_camp.registration_number = registration_number;
        vaccination_camp.name = name;
        vaccination_camp.phone = phone;
        vaccination_camp.email = email;
        vaccination_camp.website = website;
        vaccination_camp.opening_times = opening_times;
        vaccination_camp.address = address;
       
        vaccination_camp.joined_date = joined_date.unix_timestamp;
        vaccination_camp.is_active = true;
        
        Ok(())
    }
}

// Create doctor
#[derive(Accounts)]
pub struct CreateDoctor<'info> {
    #[account(init, payer = author, space = Doctor::LEN)]
    pub doctor: Account<'info, Doctor>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

// // update doctor
// #[derive(Accounts)]
// pub struct UpdateDoctor<'info> {
//     #[account(mut, has_one = author)]
//     pub doctor: Account<'info, Doctor>,
//     pub author: Signer<'info>,
// }

// // delete doctor
// #[derive(Accounts)]
// pub struct DeleteDoctor<'info> {
//     #[account(mut, has_one = author, close = author)]
//     pub doctor: Account<'info, Doctor>,
//     pub author: Signer<'info>,
// }

// Create vaccination camp
#[derive(Accounts)]
pub struct CreateVaccinationCamp<'info> {
    #[account(init, payer = author, space = VaccinationCamp::LEN)]
    pub vaccination_camp: Account<'info, VaccinationCamp>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

// // update vaccination camp
// #[derive(Accounts)]
// pub struct UpdateVaccinationCamp<'info> {
//     #[account(mut, has_one = author)]
//     pub vaccination_camp: Account<'info, VaccinationCamp>,
//     pub author: Signer<'info>,
// }

// // delete vaccination camp
// #[derive(Accounts)]
// pub struct DeleteVaccinationCamp<'info> {
//     #[account(mut, has_one = author, close = author)]
//     pub vaccination_camp: Account<'info, VaccinationCamp>,
//     pub author: Signer<'info>,
// }

// doctor account
#[account]
pub struct Doctor {
    pub owner: Pubkey,
    pub firstname: String,
    pub lastname: String,
    pub date_of_birth: i64,
    pub license_number: String,
    pub licence_issued_date: i64,
    pub licence_expiry_date: i64,
    pub business_address: String,
    pub business_telephone: String,
    pub qualifications: String,
    pub joined_date: i64,
    pub is_active: bool
}

// vaccination camp account
#[account]
pub struct VaccinationCamp {
    pub owner: Pubkey,
    pub registration_number: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub website: String,
    pub opening_times: String,
    pub address: String,
    pub joined_date: i64,
    pub is_active: bool
}

// // passport holder account
// #[account]
// pub struct PassportHolder {
//     pub owner: Pubkey,
//     pub firstname: String,
//     pub lastname: String,
//     pub date_of_birth: i64,
//     pub address: String,
//     pub phone: String,
//     pub place_of_birth: String,
//     pub nic: String,
//     pub is_active: bool
// }



// program specific
const DISCRIMINATOR_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; 
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const BOOLEAN_LENGTH: usize = 1;


// other length constraints
// since according to UTF-8 encoding, a character can take upto 1 to 4 bytes
// we consider the max bite size as 4 therefore usize = characters * 4 bytes
const NAME_LENGTH: usize = 50 * 4;             
const LICENSE_NUMBER_LENGTH: usize = 50 * 4;  
const REGISTRATION_NUMBER_LENGTH: usize = 50 * 4; 
const ADDRESS_LENGTH: usize = 500 * 4; 
const TELEPHONE_LENGTH: usize = 15 * 4; 
const EMAIL_LENGTH: usize = 100 * 4; 
const WEBSITE_LENGTH: usize = 100 * 4; 
const QUALIFICATIONS_LENGTH: usize = 250 * 4; 
const TIMESLOTS_LENGTH: usize = 500 * 4;

// doctor attribute length rules
impl Doctor {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH                               // owner
        + STRING_LENGTH_PREFIX + NAME_LENGTH              // firstname
        + STRING_LENGTH_PREFIX + NAME_LENGTH              // lastname
        + TIMESTAMP_LENGTH                                // date_of_birth
        + STRING_LENGTH_PREFIX + LICENSE_NUMBER_LENGTH    // license_number
        + TIMESTAMP_LENGTH                                // licence_issued_date
        + TIMESTAMP_LENGTH                                // licence_expiry_date
        + STRING_LENGTH_PREFIX + ADDRESS_LENGTH           // business_address
        + STRING_LENGTH_PREFIX + TELEPHONE_LENGTH         // business_telephone
        + STRING_LENGTH_PREFIX + QUALIFICATIONS_LENGTH    // qualifications 
        + TIMESTAMP_LENGTH                                // joined_date
        + BOOLEAN_LENGTH;                                 // is_active
}

// vaccination camp attribute length rules
impl VaccinationCamp {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH                                   // owner
        + STRING_LENGTH_PREFIX + REGISTRATION_NUMBER_LENGTH   // registration_number
        + STRING_LENGTH_PREFIX + NAME_LENGTH                  // name
        + STRING_LENGTH_PREFIX + TELEPHONE_LENGTH             // phone
        + STRING_LENGTH_PREFIX + EMAIL_LENGTH                 // email
        + STRING_LENGTH_PREFIX + WEBSITE_LENGTH               // web
        + STRING_LENGTH_PREFIX + TIMESLOTS_LENGTH             // opening_times
        + STRING_LENGTH_PREFIX + ADDRESS_LENGTH               // address
        + TIMESTAMP_LENGTH                                    // joined_date
        + BOOLEAN_LENGTH;                                     // is_active
}

#[error]
pub enum ErrorCode {
    // first name errors
    #[msg("The first name should be less than 50 characters")]
    FirstNameTooLong,
    #[msg("The first name should not be empty")]
    FirstNameEmpty,

    // last name errors
    #[msg("The last name should be less than 50 characters")]
    LastNameTooLong,
    #[msg("The last name should not be empty")]
    LastNameEmpty,

    // license number errors
    #[msg("The license number should be less than 50 characters")]
    LicenseNumberTooLong,
    #[msg("The license number should not be empty")]
    LicenseNumberEmpty,

    // registration number errors
    #[msg("The registration number should be less than 50 characters")]
    RegistrationNumberTooLong,
    #[msg("The registration number should not be empty")]
    RegistrationNumberEmpty,

    // address errors
    #[msg("The address should be less than 500 characters")]
    AddressTooLong,
    #[msg("The address should not be empty")]
    AddressEmpty,
    
    // telephone errors
    #[msg("The telephone number should be less than 15 characters")]
    TelephoneTooLong,
    #[msg("The telephone number should not be empty")]
    TelephoneEmpty,
    #[msg("The telephone number is invalid")]
    TelephoneInvalid,

    // email errors
    #[msg("The email should be less than 100 characters")]
    EmailTooLong,
    #[msg("The email should not be empty")]
    EmailEmpty,
    #[msg("The email is invalid")]
    EmailInvalid,

    // website errors
    #[msg("The website should be less than 100 characters")]
    WebsiteTooLong,
    #[msg("The website should not be empty")]
    WebsiteEmpty,

    // qualifications errors
    #[msg("The qualifications should be less than 250 characters")]
    QualificationsTooLong,
    #[msg("The qualifications should not be empty")]
    QualificationsEmpty,

    // opening times errors
    #[msg("The opening times should be less than 500 characters")]
    OpeningTimesTooLong,
    #[msg("The opening times should not be empty")]
    OpeningTimesEmpty,

    // doctor errors
    #[msg("The doctor is not registered")]
    DoctorNotFound,
    #[msg("The doctor is already registered")]
    DoctorAlreadyExists,

    // vaccination camp errors
    #[msg("The vaccination camp is not registered")]
    VaccinationCampNotFound,
    #[msg("The vaccination camp is already registered")]
    VaccinationCampAlreadyExists,

    // doctor-vaccination camp errors
    #[msg("The doctor is not registered to the vaccination camp")]
    DoctorNotRegisteredToVaccinationCamp,
    #[msg("The doctor is already registered to the vaccination camp")]
    DoctorAlreadyRegisteredToVaccinationCamp,
}
