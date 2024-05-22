'use strict';

const { Contract } = require('fabric-contract-api');
const sortKeysRecursive = require('sort-keys-recursive');
const stringify = require('json-stringify-deterministic');

class AssetTransfer extends Contract {

    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            docType:"asset",
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const updatedAsset = {
            docType:"asset",
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }


    async AssetExists(ctx, assetName) {
        let assetState = await ctx.stub.getState(assetName);
        return assetState && assetState.length > 0;
    }

    async getHistory(ctx, key) {
        const resultsIterator =  ctx.stub.getHistoryForKey(key);
        const results = [];
        
        for await (const res of resultsIterator) {
            if (res.value) {
                const jsonfromString = JSON.parse(res.value.toString('utf8'));
                results.push({
                    TxId: res.tx_id,
                    Timestamp: res.timestamp,
                    Value: jsonfromString
                });
            }
        }
        
        return JSON.stringify(results);
    }

    async getByNonPrimaryKey(ctx, nonPrimaryKey, value) {
        const queryString = {
            selector: {
                [nonPrimaryKey]: value,
                docType:"asset",
            }
        };
        const resultsIterator =  ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = [];
        for await  (const res of resultsIterator) {
            const jsonfromString = JSON.parse(res.value.toString('utf8'));
            results.push({
                ID: jsonfromString.ID,
                Color: jsonfromString.Color,
                Size: jsonfromString.Size,
                Owner: jsonfromString.Owner,
                AppraisedValue: jsonfromString.AppraisedValue,
            });
        }
        return JSON.stringify(results);
    }
}

module.exports = AssetTransfer;
