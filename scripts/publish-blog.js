import fs from 'fs';
import path from 'path';

// This script will be called by the Github Action on the 5th of every month
// It appends a new dynamically generated blog post to `src/data/blog.ts`

const blogFilePath = path.join(process.cwd(), 'src/data/blog.ts');

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = new Date();
const formattedDate = `${months[today.getMonth()]} 5, ${today.getFullYear()}`;
const monthName = months[today.getMonth()];

// Template for the generic automatic blog
const autoBlog = `
  {
    slug: "monthly-update-${monthName.toLowerCase()}-${today.getFullYear()}",
    title: "${monthName} ${today.getFullYear()} Update",
    date: "${formattedDate}",
    preview: "Automated monthly update checking in on progress, ongoing experiments, and recent learnings for ${monthName} ${today.getFullYear()}.",
    tags: ["Personal", "Update"],
    content: [
      {
        type: "paragraph",
        text: "This is an automated monthly check-in. Generating regular updates helps track long-term progress and forces reflection on the work completed over the past four weeks."
      },
      {
        type: "heading",
        text: "Current Focus"
      },
      {
        type: "paragraph",
        text: "Diving deeper into infrastructure and refining the systems that power these very updates. Stay tuned for more technical deep dives in the coming weeks and deeper explorations of agentic frameworks."
      }
    ]
  }
`;

function appendBlog() {
  try {
    let content = fs.readFileSync(blogFilePath, 'utf-8');
    
    // Find the end of the blogs array
    const closingBracketIndex = content.lastIndexOf('];');
    
    if (closingBracketIndex === -1) {
      console.error("Could not find the end of the blogs array in blog.ts");
      process.exit(1);
    }
    
    // Insert the new blog right before the closing bracket, with a preceding comma
    const newContent = 
      content.substring(0, closingBracketIndex) + 
      ",\n" + autoBlog + "\n" +
      content.substring(closingBracketIndex);
      
    fs.writeFileSync(blogFilePath, newContent, 'utf-8');
    console.log(`Successfully appended blog for ${formattedDate}`);
  } catch (error) {
    console.error("Failed to append blog:", error);
    process.exit(1);
  }
}

appendBlog();
