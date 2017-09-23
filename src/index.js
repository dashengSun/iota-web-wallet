const client = require("./sendTransfer");

$(document).ready(function(){
  $("#submit").click(function(){
    var addr1 = $("#addr1").val()
    var val1 = $("#val1").val()

    var addr2 = $("#addr2").val()
    var val2 = $("#val2").val()

    var addr3 = $("#addr3").val()
    var val3 = $("#val3").val()

    var addr4 = $("#addr4").val()
    var val4 = $("#val4").val()

    var addr5 = $("#addr5").val()
    var val5 = $("#val5").val()

    var addr6 = $("#addr6").val()
    var val6 = $("#val6").val()

    var addr7 = $("#addr7").val()
    var val7 = $("#val7").val()

    var addr8 = $("#addr8").val()
    var val8 = $("#val8").val()

    var addr9 = $("#addr9").val()
    var val9 = $("#val9").val()

    var addr10 = $("#addr10").val()
    var val10 = $("#val10").val()

    var transfers = [
      {
        address: addr1,
        value: val1
      },
      {
        address: addr2,
        value: val2
      },
      {
        address: addr3,
        value: val3
      },
      {
        address: addr4,
        value: val4
      },
      {
        address: addr5,
        value: val5
      },
      {
        address: addr6,
        value: val6
      },
      {
        address: addr7,
        value: val7
      },
      {
        address: addr8,
        value: val8
      },
      {
        address: addr9,
        value: val9
      },
      {
        address: addr10,
        value: val10
      }
    ]
    console.log(transfers)

    client.sendTransfers(transfers, function(error, success) {
      if (error != null) {
        alert("Error: " + error);
      } else {
        alert("Success: ")
      }

    })

  });
});