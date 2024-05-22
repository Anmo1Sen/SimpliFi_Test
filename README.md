# Asset transfer basic sample

The asset transfer basic sample demonstrates:

- Connecting a client application to a Fabric blockchain network.
- Submitting smart contract transactions to update ledger state.
- Evaluating smart contract transactions to query ledger state.
- Handling errors in transaction invocation.

## About the sample

This sample includes smart contract and application code in javascript languages. This sample shows create, read, update, getHistory and getByNonPrimaryKey of an asset.

For a more detailed walk-through of the application code and client API usage, refer to the [Running a Fabric Application tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) in the main Hyperledger Fabric documentation.



### Smart Contract

The smart contract (in folder `chaincode-xyz`) implements the following functions to support the application:

- CreateAsset
- ReadAsset
- UpdateAsset
- GetHistory
- GetByNonPrimaryKey



## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Create the test network, a channel and Deploy one of the smart contract implementations (from the `test-network` folder).
   ```
   ./demo-network.sh
   ```


2. Run the application.
   ```
   # To run the javacript sample application
   cd application-javacript
   npm install
   node demoApp.js


## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```
./network.sh down
```