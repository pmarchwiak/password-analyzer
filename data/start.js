var analyzeButton = document.getElementById("analyze-button");
console.log("Got analyze button " + analyzeButton);

analyzeButton.onclick = function() {
  console.log("Clicked analyzer passwords");
  self.port.emit("analyze", {option1: false});
};

