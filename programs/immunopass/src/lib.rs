use anchor_lang::prelude::*;

declare_id!("HoVPS3s5fbgFfbXAuGg6hfL8CKMYjLBhPHdtfqBgLNMG");

#[program]
pub mod immunopass {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

// program specific
const DISCRIMINATOR_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; 
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;

// other length constraints
// since according to UTF-8 encoding, a character can take upto 1 to 4 bytes
// we consider the max bite size as 4 therefore usize = characters * 4 bytes
const NAME_LENGTH: usize = 50 * 4;             
const LICENSE_NUMBER_LENGTH: usize = 50 * 4;   
const ADDRESS_LENGTH: usize = 500 * 4; 
const TELEPHONE_LENGTH: usize = 15 * 4; 
const QUALIFICATIONS_LENGTH: usize = 250 * 4; 

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
    pub joined_date: i64
}

// doctor attribute length rules
impl Doctor {
    const LEN: size = DISCRIMINATOR_LENGTH
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
}