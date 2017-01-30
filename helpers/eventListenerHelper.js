var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

function EventListenerHelper() {
}

EventListenerHelper.prototype.filterWatch = function(transactionHash, callback) {
    var filter = web3.eth.filter('latest');
    filter.watch(function(err, result) {
        if (!err) {
            //console.log("latest: ", result);
            var blockInfo = web3.eth.getBlock(result);
            //console.log("block: ", info);
            if (blockInfo.transactions > 0) {
                blockInfo.transactions.forEach(function (tx) {
                    if (tx == transactionHash) {
                        var transactionInfo = web3.eth.getTransaction(tx);
                        var transactionReceiptInfo = web3.eth.getTransactionReceipt(tx);
                        // save to database
                        callback(transactionInfo, transactionReceiptInfo, blockInfo);
                        filter.stopWatching();
                    }
                });
            }
        } else {
            filter.stopWatching();
            console.log(err);
        }
    });
};

EventListenerHelper.prototype.getByBlockHash = function(blockHash) {
    return web3.eth.getBlock(blockHash);
};

EventListenerHelper.prototype.getByBlockNumber = function(blockNumber) {
    return web3.eth.getBlock(blockNumber);
};

EventListenerHelper.prototype.getTransaction = function(transactionHash) {
    return web3.eth.getTransaction(transactionHash);
};

EventListenerHelper.prototype.getTransactionReceipt = function(transactionHash) {
    return web3.eth.getTransactionReceipt(transactionHash);
};

exports = module.exports = new EventListenerHelper();