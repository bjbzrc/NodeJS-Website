var currentPlayer = 1; // Tracks current player. 1 = X, 2 = O

// Writes an updating string of text that shows the current player
$(document).ready(function () {
  $("#playerDisplay").text("Current player: X");
});

// Defines behavior for all buttons in the tic tac toe game. Pressing a button
// toggles the currentPlayer value and indicates which spot has been taken
$(document).ready(function () {
  $(".tac").click(function () {
    if (currentPlayer == 1) {
      $(this).text("X");
      $(this).css({ "background-color": "lightcoral" });
      $("#playerDisplay").text("Current player: O");
      currentPlayer = 2;
    } else {
      $(this).text("O");
      $(this).css({ "background-color": "lightskyblue" });
      $("#playerDisplay").text("Current player: X");
      currentPlayer = 1;
    }
  });
});

// Button that resets game to default state
$(document).ready(function () {
  $("#resetBtn").click(function () {
    $(".tac").text("").css({ "background-color": "lightgray" });
    $("#playerDisplay").text("Current player: X");
    currentPlayer = 1;
  });
});
