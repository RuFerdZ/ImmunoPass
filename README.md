# ImmunoPass

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ImmunoPass is a Decentralized Application (DApp) built upon the Solana Blockchain for its higher transaction speed and lower gas fees.

ImmunoPass is a digital vaccination/Immunisation record-keeping and maintenance platform that focuses more on the ease of access, accuracy and integrity of vaccination data where the Vaccination Profile/Passport is owned by the user itself for privacy and is overlooked by the healthcare sector for validation and verification.

## Project Tools for this project
**Note: most of the libraries and frameworks used in this project doesn't run/is not available/not compatible in the windows environment*

[Node](https://nodejs.org/en/) - the node package manager was used to maintain packages of the Solana Application + the Client Application. 

[Rust Programming Language](https://www.rust-lang.org/tools/install) - the programming language which has been used to develop the DApp.

[Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools) - provides the environment for building Solana based DApps.

[Anchor Framework](https://project-serum.github.io/anchor/getting-started/introduction.html) - Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools. 

[React JS](https://reactjs.org/) - the frontend/client-side was developed using React JS library.

## Setup Project

1. clone the repository and go into the project directory

```bash
git clone https://github.com/RuFerdZ/ImmunoPass.git
cd immunopass
```
2. download the dependencies for the anchor-based Solana DApp
```bash
yarn install
```
3. Change cluster pointer to localhost and run solana-test-validator from the root directory
```bash
solana config set --url http://localhost:8899 
cd ~
solana-test-validator 
```
4. Build and Deploy DApp
```bash
anchor build
anchor deploy
```
5. Get the program id generated from the ```anchor deploy``` and replace it on the
  - ```Anchor.toml``` immunopass key's value
```
[programs.localnet]
immunopass = "HoVPS3s5fbgFfbXAuGg6hfL8CKMYjLBhPHdtfqBgLNMG"
``` 
   - ```programs/immunopass/lib.rs``` program id
```
declare_id!("HoVPS3s5fbgFfbXAuGg6hfL8CKMYjLBhPHdtfqBgLNMG");
```
6. Go into the ```\app``` directory and install dependencies
```bash
cd app
npm install
```
6. Run the client application
```bash
npm start
```
7. Now you can access the DApp via ```http:\\localhost:3000\``` from your browser!

## Usages

You can run the test cases in the root directory of the project (not in ```/app```)

**Note: stop solana-test-validator if it's already running in the background to avoid data duplication/addition to the blockchain while running tests which may cause the tests to fail*

```bash
anchor test
```

If doing changes to the business logic (the solana program), make sure to synchronize the IDL file generated in the solana program with the IDL file in the ```/app``` after a successful deployment.

```bash
anchor run sync-idl
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
