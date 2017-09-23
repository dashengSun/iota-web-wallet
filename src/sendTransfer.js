var IOTA = require("iota.lib.js");
var curl = require("curl.lib.js")

window.iota = new IOTA({
  'provider': "http://localhost:14265"
});

var sendTransfers = function (originTransfers, callback) {

  window.iota = new IOTA({
    'provider': $("#host-provider").val()
  });

  window.curl.overrideAttachToTangle(iota.api)
  var depth = 3;
  var minWeightMagnitude = 15;
  var seed = $("#seed").val();

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
    if (error != null) {
      console.log("we have error: " + error);
      callback(error);
    } else {
      console.log(success);
      console.log("no error");
      callback(null, success);
    }
  });
}


module.exports = {
  'sendTransfers': sendTransfers
}
