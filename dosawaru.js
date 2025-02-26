document.addEventListener("DOMContentLoaded", function () {
  // Store the count for each letter/punctutaion
  let letterCount = { consonants: {}, vowels: {}, punctuation: {} };

  const map = d3.select("#treemap_svg");

  function saveText() {
    // Get the text from the textarea
    let text = document.getElementById("wordbox").value;

    // Keep track of the numer of punctuation, consonants, and vowels
    let consonantsCount = 0;
    let vowelsCount = 0;
    let punctuationCount = 0;

    // Define the characters that are punctuation, consonants, and vowels
    const consonants = "bcdfghjklmnpqrstvwxz";
    const vowels = "aeiouy";
    const punctuation = ".,!?:;";

    // Loop through each character in the text
    for (let c of text) {
      // Only count the characters that are punctuation, consonants, vowels and ignore everything else
      // Add the character to the object and increment
      // Count the number of punctuation, consonants, and vowels
      if (consonants.includes(c)) {
        letterCount.consonants[c] = (letterCount.consonants[c] || 0) + 1;
        consonantsCount++;
      } else if (vowels.includes(c)) {
        letterCount.vowels[c] = (letterCount.vowels[c] || 0) + 1;
        vowelsCount++;
      } else if (punctuation.includes(c)) {
        letterCount.punctuation[c] = (letterCount.punctuation[c] || 0) + 1;
        punctuationCount++;
      }
    }
    console.log(letterCount);
    console.log(consonantsCount);
    console.log(vowelsCount);
    console.log(punctuationCount);

    // Draw the treemap
    drawTreemap();
  }

  function drawTreemap() {}

  // Add an event listener to the button
  document.getElementById("save").addEventListener("click", function () {
    console.log("saved text");
    saveText();
  });
});
