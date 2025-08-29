import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const pk = generatePrivateKey(); // e.g., 0xabc...
const acct = privateKeyToAccount(pk); // has .address
console.log('HL_AGENT_PRIVATE_KEY=', pk);
console.log('AGENT_ADDRESS=', acct.address);
