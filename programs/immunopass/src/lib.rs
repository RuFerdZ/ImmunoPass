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
