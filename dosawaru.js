// Define margin and dimension for treemap

const margin = 10;

const width = 580 - margin;
const height = 400 - margin;

let data = {};

document.addEventListener("DOMContentLoaded", function () {
  // Store the count for each letter/punctutaion
  let charCount = { consonants: {}, vowels: {}, punctuation: {} };

  // Create treemap
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
        charCount.consonants[c] = (charCount.consonants[c] || 0) + 1;
        consonantsCount++;
      } else if (vowels.includes(c)) {
        charCount.vowels[c] = (charCount.vowels[c] || 0) + 1;
        vowelsCount++;
      } else if (punctuation.includes(c)) {
        charCount.punctuation[c] = (charCount.punctuation[c] || 0) + 1;
        punctuationCount++;
      }
    }
    console.log(charCount);
    console.log(consonantsCount);
    console.log(vowelsCount);
    console.log(punctuationCount);

    // Draw the treemap
    drawTreemap();
  }

  function drawTreemap() {
    formatData();
    console.log(data);

    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value) // Sum the value of each child
      .sort((a, b) => b.value - a.value); // Sort by descening order

    const treeColor = d3.scaleOrdinal(d3.schemeCategory10);

    const treemapLayout = d3.treemap().size([width, height]);

    treemapLayout(hierarchy);

    const leaf = map
      .selectAll("g")
      .data(hierarchy.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    leaf
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => treeColor(d.data.name));
  }

  // Format the data for the treemap in a hierarchal structure
  // For each punctuation, consonants, and vowels, it is categorized in a childern node and a list of objects to created for each character(key) and value
  // This helps with styling and access data for d3 treemap
  function formatData() {
    data = {
      name: "characters",
      children: [
        {
          name: "consonants",
          children: Object.keys(charCount.consonants).map((key) => ({
            char: key,
            value: charCount.consonants[key],
          })),
        },
        {
          name: "vowels",
          children: Object.keys(charCount.vowels).map((key) => ({
            char: key,
            value: charCount.vowels[key],
          })),
        },
        {
          name: "punctuation",
          children: Object.keys(charCount.punctuation).map((key) => ({
            char: key,
            value: charCount.punctuation[key],
          })),
        },
      ],
    };
  }

  // Add an event listener to the button
  document.getElementById("save").addEventListener("click", function () {
    console.log("Saved text");
    saveText();
  });
});
