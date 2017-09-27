var IOTA = require("iota.lib.js");
window.curl = require("curl.lib.js")
const curlClient = require("./ccurl-interface")

try {
  curl.init();
} catch (e) {}

window.iota = new IOTA({
  'provider': "http://localhost:14265"
});

var localAttachToTangle = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
  console.log("Light Wallet: localAttachToTangle");

  curlClient.ccurlHashing(curl, trunkTransaction, branchTransaction, minWeightMagnitude, trytes, function(error, success) {
    console.log("Light Wallet: ccurl.ccurlHashing finished:");
    if (error) {
      console.log(error);
    } else {
      console.log(success);
    }
    if (callback) {
      return callback(error, success);
    } else {
      return success;
    }
  })
}

var sendTransfers = function (originTransfers, callback) {

  window.iota = new IOTA({
    'provider': $("#host-provider").val()
  });

  iota.api.attachToTangle = localAttachToTangle;

  var depth = 3;
  var minWeightMagnitude = 14;
  var seed = $("#seed").val();

  if (!seed) {
    return callback("Seed is empty");
  } else if (seed.match(/[^A-Z9]/) || seed.match(/^[9]+$/)) {
    return callback("Seed is not valid");
  }
  var transfers = [];
  for (i = 0; i < originTransfers.length; i++) {
    if (originTransfers[i].address != "" && originTransfers[i].value != "") {
      let transfer = {
        "address": originTransfers[i].address,
        "value": parseInt(originTransfers[i].value),
        "message": "",
        "tag": ""
      };
      transfers.push(transfer);
    }
  }

  console.log("You are sending to these addresses:");
  console.log(transfers);
  iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, function(error, success) {
    if (!!error) {
      console.log("we have error: " + error);
      return callback(error);
    } else {
      console.log(success);
      console.log("no error");
      return callback(null, success);
    }
  });
}


module.exports = {
  'sendTransfers': sendTransfers
}
