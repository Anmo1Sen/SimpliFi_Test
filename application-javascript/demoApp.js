/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName =  'mychannel';
const chaincodeName =  'demo';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'AppUser1';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    try {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        const wallet = await buildWallet(Wallets, walletPath);

        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);





            console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, size, owner, and appraisedValue arguments');
             let result = await contract.submitTransaction('CreateAsset', 'asset1', 'blue', '5', 'Tom', '1300');
            console.log('*** Result: committed');
            if (`${result}` !== '') {
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            }

            console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
            result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Evaluate Transaction: getByNonPrimaryKey, function returns assets based on a non-primary key');
            result = await contract.evaluateTransaction('getByNonPrimaryKey', 'Color', 'blue');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Submit Transaction: UpdateAsset, update the asset with new attributes');
            await contract.submitTransaction('UpdateAsset', 'asset1', 'red', '10', 'Jerry', '1500');
            console.log('*** Result: committed');

            console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Evaluate Transaction: getHistory, function returns the history of a given assetID');
            result = await contract.evaluateTransaction('getHistory', 'asset1');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Submit Transaction: UpdateAsset, update the asset with new attributes');
            await contract.submitTransaction('UpdateAsset', 'asset1', 'red', '10', 'Jerry', '2000');
            console.log('*** Result: committed');

            console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Evaluate Transaction: getHistory, function returns the history of a given assetID');
            result = await contract.evaluateTransaction('getHistory', 'asset1');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            console.log('\n--> Evaluate Transaction: getByNonPrimaryKey, function returns assets based on a non-primary key');
            result = await contract.evaluateTransaction('getByNonPrimaryKey', 'Color', 'red');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        process.exit(1);
    }
}

main();
