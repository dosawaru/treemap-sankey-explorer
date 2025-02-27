// Define  dimension for treemap
const width = 580;
const height = 400;

// Define the characters that are punctuation, consonants, and vowels
const consonants = "bcdfghjklmnpqrstvwxz";
const vowels = "aeiouy";
const punctuation = ".,!?:;";

let data = {};

document.addEventListener("DOMContentLoaded", function () {
  // Store the count for each letter/punctutaion
  let charCount = { consonants: {}, vowels: {}, punctuation: {} };

  // Create treemap
  let map = d3.select("#treemap_svg");

  // Categorize and save the inputted text
  function saveText() {
    // Clears char count
    charCount = { consonants: {}, vowels: {}, punctuation: {} };

    // Get the text from the textarea
    let text = document.getElementById("wordbox").value;

    // Keep track of the numer of punctuation, consonants, and vowels
    let consonantsCount = 0;
    let vowelsCount = 0;
    let punctuationCount = 0;

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
    //Check for valid input
    if (consonantsCount + vowelsCount + punctuationCount == 0) {
      alert(
        `Invalid input, please enter in as least one of the following: \nconsonants -> ${consonants} \nvowels -> ${vowels} \npunctuation -> ${punctuation} \n😊`
      );
      return;
    }
    console.log(charCount);
    console.log(consonantsCount);
    console.log(vowelsCount);
    console.log(punctuationCount);

    // Draw the treemap
    drawTreemap();
  }

  // Generate TreeMap for save text
  function drawTreemap() {
    // Clear draw
    map.selectAll("*").remove();
    map = d3.select("#treemap_svg");

    // Format Data
    formatData();
    console.log(data);

    // Give the data in cluster format
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value) // Sum the value of each child
      .sort((a, b) => b.value - a.value); // Sort by desending order

    // Treemap Color
    const treeColor = d3.scaleOrdinal(d3.schemeCategory10);

    // Layout for treemap
    const treemapLayout = d3
      .treemap()
      .size([width, height])
      .padding(2)
      .round(true);

    // Define and style Div for tooltips
    let tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("background", "white")
      .style("width", "auto")
      .style("height", "auto")
      .style("padding", "5px")
      .style("font-size", "12px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("pointer-events", "none");

    // Apply layout to each element in the data
    treemapLayout(hierarchy);

    // Create each leaf node
    const leaf = map
      .selectAll("g")
      .data(hierarchy.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    // Style leaves
    leaf
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => treeColor(d.parent.data.name))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("opacity", 0.9)
      // Use mouseover, mousemove, and mouseout to keep track of the mouse position on screen and display the information when hovering over the leaft
      .on("mouseover", function (e, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            "Character:<b>" +
              d.data.char +
              "</b><br/> Occurrence(s):  <b>" +
              d.data.value +
              "</b>"
          );
      })
      .on("mousemove", function (e, d) {
        tooltip
          .html(
            "Character: <b>" +
              d.data.char +
              "</b><br/> Occurrence(s):  <b>" +
              d.data.value +
              "</b>"
          )
          .style("left", `${e.pageX + 5}px`) // Move with cursor
          .style("top", `${e.pageY + 20}px`);
      })
      .on("mouseout", function (e, d) {
        tooltip.style("visibility", "hidden");
      });
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
    //Check for valid input
    if (document.getElementById("wordbox").value == "") {
      alert(`Text area is blank, please enter something 😊`);
    } else {
      saveText();
    }
  });
});
