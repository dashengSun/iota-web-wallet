const MAX_TIMESTAMP_VALUE = (Math.pow(3,27) - 1) / 2;

var ccurlHashing = function(libccurl, trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
  // if (!libccurl.hasOwnProperty("ccurl_pow")) {
  //   return callback(new Error("Hashing not available"));
  // }

  var iotaObj = iota;

  // inputValidator: Check if correct hash
  if (!iotaObj.valid.isHash(trunkTransaction)) {

    return callback(new Error("Invalid trunkTransaction"));
  }

  // inputValidator: Check if correct hash
  if (!iotaObj.valid.isHash(branchTransaction)) {

    return callback(new Error("Invalid branchTransaction"));
  }

  // inputValidator: Check if int
  if (!iotaObj.valid.isValue(minWeightMagnitude)) {

    return callback(new Error("Invalid minWeightMagnitude"));
  }

  // inputValidator: Check if array of trytes
  // if (!iotaObj.valid.isArrayOfTrytes(trytes)) {
  //
  //     return callback(new Error("Invalid trytes supplied"));
  // }

  var finalBundleTrytes = [];
  var previousTxHash;
  var i = 0;

  function loopTrytes() {

    getBundleTrytes(trytes[i], function(error) {

      if (error) {

        return callback(error);

      } else {

        i++;

        if (i < trytes.length) {

          loopTrytes();

        } else {

          // reverse the order so that it's ascending from currentIndex
          return callback(null, finalBundleTrytes.reverse());

        }
      }
    });
  }

  function getBundleTrytes(thisTrytes, callback) {
    // PROCESS LOGIC:
    // Start with last index transaction
    // Assign it the trunk / branch which the user has supplied
    // IF there is a bundle, chain  the bundle transactions via
    // trunkTransaction together

    var txObject = iotaObj.utils.transactionObject(thisTrytes);
    txObject.tag = txObject.obsoleteTag;
    txObject.attachmentTimestamp = Date.now();
    txObject.attachmentTimestampLowerBound = 0;
    txObject.attachmentTimestampUpperBound = MAX_TIMESTAMP_VALUE;
    // If this is the first transaction, to be processed
    // Make sure that it's the last in the bundle and then
    // assign it the supplied trunk and branch transactions
    if (!previousTxHash) {


      // Check if last transaction in the bundle
      if (txObject.lastIndex !== txObject.currentIndex) {
        return callback(new Error("Wrong bundle order. The bundle should be ordered in descending order from currentIndex"));
      }

      txObject.trunkTransaction = trunkTransaction;
      txObject.branchTransaction = branchTransaction;
    } else {
      // Chain the bundle together via the trunkTransaction (previous tx in the bundle)
      // Assign the supplied trunkTransaciton as branchTransaction
      txObject.trunkTransaction = previousTxHash;
      txObject.branchTransaction = trunkTransaction;
    }

    var newTrytes = iotaObj.utils.transactionTrytes(txObject);

    libccurl.pow({trytes: newTrytes, minWeight: minWeightMagnitude}).then(function(nonce) {
      var returnedTrytes = newTrytes.substr(0, 2673-81).concat(nonce);
      var newTxObject= iotaObj.utils.transactionObject(returnedTrytes);

      // Assign the previousTxHash to this tx
      var txHash = newTxObject.hash;
      previousTxHash = txHash;

      finalBundleTrytes.push(returnedTrytes);
      callback(null);
    }).catch(callback);
  }
  loopTrytes();
}

module.exports = {
  'ccurlHashing': ccurlHashing
}
