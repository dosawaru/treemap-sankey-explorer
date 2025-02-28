// Define  dimension for treemap
const width = 580;
const height = 400;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };

// Define the characters that are punctuation, consonants, and vowels
const consonants = "bcdfghjklmnpqrstvwxz";
const vowels = "aeiouy";
const punctuation = ".,!?:;";

let data = {};
let text = "";
let singleStringData = "";
let sankeyData;

document.addEventListener("DOMContentLoaded", function () {
  // Store the count for each letter/punctutaion
  let charCount = { consonants: {}, vowels: {}, punctuation: {} };

  // Create treemap and sankey
  let map = d3.select("#treemap_svg");
  let diagram = d3.select("#sankey_svg");

  // Categorize and save the inputted text
  function saveText() {
    // Clears char count
    charCount = { consonants: {}, vowels: {}, punctuation: {} };

    // Get the text from the textarea
    text = document.getElementById("wordbox").value.toLowerCase();

    // Keep track of the numer of punctuation, consonants, and vowels
    let consonantsCount = 0;
    let vowelsCount = 0;
    let punctuationCount = 0;

    // Loop through each character in the text
    for (let c of text) {
      // Only count the characters that are punctuation, consonants, vowels and ignore everything else
      // Add the character to the object and increment
      // Count the number of punctuation, consonants, and vowels
      if (
        consonants.includes(c) ||
        vowels.includes(c) ||
        punctuation.includes(c)
      ) {
        singleStringData += c;
      }

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
    console.log(singleStringData);

    // Draw the treemap
    drawTreemap();
  }

  // Generate TreeMap for save text
  function drawTreemap() {
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
      // Use mouseover, mousemove, and mouseout to keep track of the mouse position on screen and display the information when hovering over the leaf
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
        // console.log(e.x, e.y);
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

  // Generate Sankey from save text
  function drawSankey(data) {
    let width_sankey = 600 - margin.left - margin.right;
    let height_2 = height - margin.top - margin.bottom;

    // Clear draw
    diagram.selectAll("*").remove();
    // Create svg object
    diagram = d3
      .select("#sankey_svg")
      .append("svg")
      .attr("width", width_sankey + margin.left + margin.right)
      .attr("height", height_2 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Generate tooltip
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

    // Set sankey properties
    let sankey = d3
      .sankey()
      .nodeWidth(30)
      .size([width_sankey - margin.left - margin.right, height_2]);

    // Sankey Color
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    path = sankey.links();

    // //Load in data
    // d3.json("sankey.json").then(function (sankeydata) {
    //   graph = sankey(sankeydata);

    const { nodes, links } = sankey({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });

    // Add links
    link = diagram
      .append("g")
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .style("stroke", "grey")
      .style("opacity", 0.7)
      .style("fill", "none")
      .style("stroke-width", (d) => Math.max(1, d.width));
    // .sort((a, b) => b.dy - a.dy);

    // Add nodes
    let node = diagram
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("mouseover", function (e, d) {
        tooltip.style("visibility", "visible").html("Character:<b>" + d.name);
      })
      .on("mousemove", function (e, d) {
        tooltip
          .html("Character: <b>" + d.name)
          .style("left", `${e.pageX + 5}px`) // Move with cursor
          .style("top", `${e.pageY + 20}px`);
        // console.log(e.x, e.y);
      })
      .on("mouseout", function (e, d) {
        tooltip.style("visibility", "hidden");
      });

    node
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", sankey.nodeWidth())
      .style("fill", (d) => (d.color = color(d.name.replace(/ .*/, ""))))
      .style("stroke", (d) => d3.rgb(d.color).darker(2))
      .append("title");
    // });
  }

  // Clears data
  function clear() {
    data = {};
    text = "";
    singleStringData = "";

    // redraw
    map.selectAll("*").remove();
    map = d3.select("#treemap_svg");
  }

  // Reformat Data to work with Sankey Graph
  function generateSankeyData(text, selectedChar) {
    const afterCounts = new Map();
    const characters = new Map();
    let charCount = 0;

    // Loop through string and find all characters that come immediately the selected char
    for (let i = 0; i < text.length; i++) {
      if (text[i] === selectedChar && i < text.length - 1) {
        const afterChar = text[i + 1];
        afterCounts.set(afterChar, (afterCounts.get(afterChar) || 0) + 1);
      }
    }

    // Loop through string and find all characters
    for (let i = 0; i < text.length; i++) {
      charCount++;
      const char = text[i];
      characters.set(char, (characters.get(char) || 0) + 1);
    }

    // Create Node and Link
    const nodes = [];
    const links = [];

    // Add the selected charcater node
    nodes.push({ node: 0, name: selectedChar });
    const selectedCharIndex = 0; // Index of the selected charcater

    let index = 1; // start index after selected charcater

    // Add each node and link for all the characters that come immediately the selected char
    afterCounts.forEach((count, char) => {
      nodes.push({ node: index, name: `${selectedChar}${char}` });
      links.push({ source: selectedCharIndex, target: index, value: count });
      index++;
    });

    // Add each node and link for all the characters
    characters.forEach((count, char) => {
      nodes.push({ node: index, name: `${char}` });
      links.push({ source: index, target: selectedCharIndex, value: count });
      index++;
    });

    return { nodes, links };
  }

  // Add an event listener to the button
  document.getElementById("save").addEventListener("click", function () {
    //Check for valid input
    if (document.getElementById("wordbox").value == "") {
      alert(`Text area is blank, please enter something 😊`);
    } else {
      clear();
      saveText();
      sankeyData = generateSankeyData(singleStringData, "a");
      console.log(sankeyData);
      drawSankey(sankeyData);
    }
  });
});
