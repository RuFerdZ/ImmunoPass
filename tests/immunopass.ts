import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Immunopass } from '../target/types/immunopass';

describe('immunopass', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Immunopass as Program<Immunopass>;

});
