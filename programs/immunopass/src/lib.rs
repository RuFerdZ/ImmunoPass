use anchor_lang::prelude::*;

declare_id!("EuT9a951sqQCQQDAvkDtgHe3JtPxzU6QMB27Woxhfcvs");

#[program]
pub mod immunopass {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
