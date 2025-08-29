/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var accounts_1 = require('viem/accounts');
var pk = (0, accounts_1.generatePrivateKey)(); // e.g., 0xabc...
var acct = (0, accounts_1.privateKeyToAccount)(pk); // has .address
console.log('HL_AGENT_PRIVATE_KEY=', pk);
console.log('AGENT_ADDRESS=', acct.address);
