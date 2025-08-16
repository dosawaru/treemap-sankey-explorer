# Linking Charts and Adding Interactivity  

This project is an interactive data visualization built with **D3.js**. It allows users to enter text, analyze its characters, and explore relationships between them through two coordinated charts:  

- **Treemap** – Shows the frequency distribution of characters in the text, grouped by category (vowels, consonants, punctuation). Rectangle sizes are proportional to character counts, and tooltips display details on hover.  
- **Sankey Diagram** – Generated when a character is clicked in the treemap. It visualizes the flow of characters immediately before and after the selected character, helping users see contextual patterns in the text.  

The interface links the two charts together, supports dynamic updates when new text is submitted, and includes smooth interactive tooltips.  

## Features  
- Input any text dynamically through a textarea  
- **Treemap Visualization**: hierarchical grouping (vowels, consonants, punctuation) with proportional sizing  
- **Sankey Diagram**: shows character flow relationships before/after a selected character  
- Interactive tooltips that follow the cursor  
- Responsive updates when input text changes  

## Demo & Screenshots  
<img width="1260" height="865" alt="image" src="https://github.com/user-attachments/assets/816e5a15-49fb-4c95-aea2-66c0970452ab" />

https://github.com/user-attachments/assets/f7f76d26-d0b4-413d-a9f7-bed1c787c34e

## Tech Stack  
- **D3.js (v7)** – for data visualization  
- **d3-sankey** – for Sankey diagram layouts  
- HTML, CSS, JavaScript  

## Test it out yourself 
https://dosawaru.github.io/treemap-sankey-explorer/

