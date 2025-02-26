document.addEventListener("DOMContentLoaded", function () {
  let textArray = [];
  let letterCount = {};

  function saveText() {
    let text = document.getElementById("wordbox").value;

    for (let c of text) {
      letterCount[c] = (letterCount[c] || 0) + 1;
    }
    console.log(letterCount);
    console.log(textArray.push(text));
  }

  document.getElementById("save").addEventListener("click", function () {
    console.log("saved text");
    saveText();
  });
});
