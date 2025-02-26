document.addEventListener("DOMContentLoaded", function () {
  // Store the count for each letter/punctutaion
  let letterCount = {};

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
      if (
        consonants.includes(c) ||
        vowels.includes(c) ||
        punctuation.includes(c)
      ) {
        // Add the character to the object and increment
        letterCount[c] = (letterCount[c] || 0) + 1;
      }

      // Count the number of punctuation, consonants, and vowels
      if (consonants.includes(c)) {
        consonantsCount++;
      } else if (vowels.includes(c)) {
        vowelsCount++;
      } else if (punctuation.includes(c)) {
        punctuationCount++;
      }
    }
    console.log(letterCount);
    console.log(consonantsCount);
    console.log(vowelsCount);
    console.log(punctuationCount);
  }

  // Add an event listener to the button
  document.getElementById("save").addEventListener("click", function () {
    console.log("saved text");
    saveText();
  });
});
