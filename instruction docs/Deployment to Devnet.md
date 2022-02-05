## Deploying to Devnet

1. Update the Solana CLI to use ```devnet```:
```
solana config set --url devnet
```
2. Update Phantom wallet to use ```devnet```

3. Open <b>Anchor.toml</b> and update the cluster from ```localnet``` to ```devnet```.

4. Rebuild the program. Be sure the program ID in <b>Anchor.toml</b> matches the current program ID.

5. Deploy the program again, this time it will be deployed to ```devnet```

6. In <b>app/src/App.js</b>, we need to also update the network, this time using the ```clusterApiUrl``` from `````@solana/web3`````, like this:

```
/* before */
<ConnectionProvider endpoint="http://127.0.0.1:8899">

/* after */
import {
...,
clusterApiUrl
} from '@solana/web3.js';

const network = clusterApiUrl('devnet');

<ConnectionProvider endpoint={network}>
```