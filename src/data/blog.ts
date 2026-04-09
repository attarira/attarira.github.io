export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; text: string; language: string }
  | { type: "list"; items: string[] };

export interface Blog {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  preview: string;
  tags: string[];
  link?: string;
  content: ContentBlock[];
}

type BlogSource = Omit<Blog, "readTime">;

const WORDS_PER_MINUTE = 200;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function calculateReadTime(content: ContentBlock[]) {
  const wordCount = content.reduce((total, block) => {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "code":
        return total + countWords(block.text);
      case "list":
        return (
          total +
          block.items.reduce((itemTotal, item) => itemTotal + countWords(item), 0)
        );
      default:
        return total;
    }
  }, 0);

  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}

const blogSources: BlogSource[] = [
  {
    slug: "why-agent-evals-matter",
    title: "Why Agent Evals Are Becoming the Real Bottleneck",
    date: "Apr 5, 2026",
    preview:
      "The hard part of building AI agents is no longer getting them to do something impressive once. It is figuring out whether they will keep doing the right thing across messy real workflows. Lately I have been thinking a lot about why evaluation is becoming the real bottleneck.",
    tags: ["AI Agents", "Evals", "LLMs"],
    content: [
      {
        type: "paragraph",
        text: "I keep seeing the same pattern with agent systems. The first milestone comes quickly. You give the model tools, a loop, and a clear task, and suddenly it can search files, call APIs, and fix a bug that would have felt impossible a year ago. Then the real problem shows up. It works in the demo, but you do not actually know when it will fail in production."
      },
      {
        type: "heading",
        text: "The Demo Is Not the Product"
      },
      {
        type: "paragraph",
        text: "That gap has become the most interesting part of agent design for me. A surprisingly capable one-off run does not mean you have a reliable system. Agents fail in strange ways. Sometimes they take the wrong branch after a perfectly reasonable first step. Sometimes they use the right tool with the wrong assumptions. Sometimes they do almost everything correctly and then make a tiny decision that breaks the whole workflow."
      },
      {
        type: "paragraph",
        text: "Those failures are hard to catch because they do not look like normal software bugs. The code might be fine. The model might even look good on a benchmark. What breaks is the full interaction between prompt, tool use, retrieved context, and the sequence of decisions the agent makes along the way."
      },
      {
        type: "heading",
        text: "Why Traditional Testing Stops Helping"
      },
      {
        type: "paragraph",
        text: "Unit tests still matter, but they only cover part of the problem. If I am building a normal backend service, I can usually define inputs and expected outputs pretty tightly. Agent systems are messier. The same task can be solved through different action paths, and some paths are much riskier than others. A final answer might look acceptable while hiding a bad retrieval step, an unnecessary tool call, or a fragile chain of reasoning."
      },
      {
        type: "list",
        items: [
          "Did the agent choose the right tool for the job?",
          "Did it retrieve the right context before acting?",
          "Did it recover well after an intermediate error?",
          "Did it reach the answer efficiently, or just get lucky once?"
        ]
      },
      {
        type: "heading",
        text: "What I Actually Want to Measure"
      },
      {
        type: "paragraph",
        text: "When I think about evals now, I care less about whether the final response sounds polished and more about whether the workflow was trustworthy. I want to know if the agent behaves well under realistic pressure: ambiguous instructions, noisy context, partial failures, and tasks that require multiple steps instead of one clean completion."
      },
      {
        type: "paragraph",
        text: "That has pushed me toward more scenario-based evaluation. Instead of asking, 'Can the model answer this question?' I am asking, 'Can the system complete this job without drifting, hallucinating, overusing tools, or silently skipping an important constraint?' That is a much harder question, but it is much closer to the real product."
      },
      {
        type: "heading",
        text: "The Evals Flywheel"
      },
      {
        type: "paragraph",
        text: "The teams that will build the best agents are probably not just the ones with the best prompts. They will be the ones with the best eval loops. Every bad trace, every near miss, and every weird failure mode becomes useful if it gets turned into a repeatable test case. Over time, that gives you something much more valuable than a flashy demo. It gives you a way to improve the system without guessing."
      },
      {
        type: "paragraph",
        text: "I think that is where the field is heading. Model quality still matters, but evaluation infrastructure is starting to matter just as much. Once agents can do real work, the main question is no longer whether they can act. It is whether you can trust how they act when the environment gets messy."
      }
    ]
  },
  {
    slug: "designing-autonomous-agents",
    title: "Designing Autonomous AI Agents for Software Engineering",
    date: "Mar 5, 2026",
    preview: "I have been spending a lot of late nights building AI coding assistants, and I keep coming back to the jump from simple autocomplete to autonomous agents. Here is a quick look at what I have learned about helping them navigate codebases and debug without making a mess.",
    tags: ["AI Agents", "LLMs", "Software Engineering"],
    content: [
      {
        type: "paragraph",
        text: "Watching large language models go from boilerplate code generators to real autonomous agents has been exciting. I still remember the first time I saw one debug a recursion issue on its own. It felt almost unreal. Instead of only predicting the next word, these systems can take a loose goal, make a plan, and work through a whole codebase."
      },
      {
        type: "heading",
        text: "The Agent Loop: Plan, Act, Observe"
      },
      {
        type: "paragraph",
        text: "At the center of it is the reasoning loop. It is not just one prompt and one answer. The agent interacts with its environment much like I would when working on a bug. It makes a plan, uses tools like a terminal or file reader, checks the results, and adjusts. When it hits an error, it tries again. Watching it read an error message and fix its own mistake is still my favorite part."
      },
      {
        type: "heading",
        text: "Tool Use and Environment Interaction"
      },
      {
        type: "paragraph",
        text: "But an LLM sitting in a chat box cannot really fix a bug by itself. It needs tools. Giving it access to terminal commands, tests, and file operations is what makes the jump from assistant to agent. I recently dealt with a bug where the agent kept wiping out a config file because it misunderstood a grep command. Teaching a model when to use each tool, without letting it damage its own workspace, is a constant challenge."
      },
      {
        type: "heading",
        text: "Managing Working Memory"
      },
      {
        type: "paragraph",
        text: "Then there is the memory problem. You cannot drop a 500-file repository into a prompt and expect good results. I have spent weeks trying to help agents pull the right context in and out of working memory. Semantic search, along with a small scratchpad for notes, has made a huge difference."
      },
      {
        type: "paragraph",
        text: "Building these systems has changed how I think about coding. I am no longer writing every step by hand. I am setting a goal, giving the agent the right tools, and letting it work through the rest."
      }
    ]
  },
  {
    slug: "beyond-vector-search",
    title: "Beyond Vector Search: When RAG Needs a Knowledge Graph",
    date: "Feb 5, 2026",
    preview:
      "I have been experimenting with RAG a lot lately, but simple vector search kept breaking whenever my questions became even a little complex. This is a quick look at how I used SpanBERT and Gemini to build a lightweight knowledge graph and improve retrieval quality.",
    tags: ["LLM", "RAG", "Knowledge Graphs"],
    content: [
      {
        type: "paragraph",
        text: "Retrieval-Augmented Generation, or RAG, is everywhere right now. At first I followed the usual setup. I chunked the text, embedded it, and sent the top matches into the context window. It sounded fine in theory, but it broke down quickly when I used it on messy technical documents that were deeply connected to each other."
      },
      {
        type: "heading",
        text: "The Problem with Pure Vector Similarity"
      },
      {
        type: "paragraph",
        text: "I learned the hard way that vector databases measure semantic similarity, not actual facts. I remember asking my app, 'What does the Data Processor depend on?' and it returned paragraphs that used the same words without answering the question. I also struggled with multi-step reasoning where the system had to combine one fact from one document with another fact from somewhere else."
      },
      {
        type: "heading",
        text: "Enter the Knowledge Graph (KG)"
      },
      {
        type: "paragraph",
        text: "So I tried something else. I put together a script to extract entities and build a lightweight knowledge graph. Instead of only chunking text, the pipeline looked for real relationships in the form of subject, predicate, and object triplets."
      },
      {
        type: "list",
        items: [
          "Step 1: Use an LLM like Gemini or a fine-tuned SpanBERT to extract entities and relationships.",
          "Step 2: Store those triplets in a graph database like Neo4j, or even an in-memory graph for smaller projects.",
          "Step 3: During query time, parse the user's intent to extract query entities.",
          "Step 4: Traverse the graph to find related nodes up to 2 or 3 hops away."
        ]
      },
      {
        type: "heading",
        text: "Hybridizing Graph and Vector"
      },
      {
        type: "paragraph",
        text: "The best results came from combining both approaches. We kept vector search for broad semantic questions like 'How does the deployment process feel?' and used graph-based retrieval for structured questions like 'Which services break if the auth database goes down?'"
      },
      {
        type: "paragraph",
        text: "By pulling subgraph context and adding it next to the top vector results, the model finally had the structure it needed. The context window became much more useful because it contained connected facts instead of isolated paragraphs."
      },
      {
        type: "heading",
        text: "Future Directions"
      },
      {
        type: "paragraph",
        text: "As context windows grow larger, some people argue that RAG and systems like GraphRAG will matter less. Bigger context helps, but I still think structured data matters. Organizing information well during ingestion lowers hallucination risk and reduces cost. To me, graph-augmented RAG is not just a temporary fix for small context windows. It is a better way to match AI systems to how knowledge is actually connected."
      }
    ]
  },
  {
    slug: "deploying-hospital-at-home-ai",
    title: "The Reality of Deploying Hospital-at-Home AI",
    date: "Jan 5, 2026",
    preview:
      "Building an ML model in a notebook is much easier than deploying one to schedule real nurses and doctors. I spent months working on a real-time scheduling engine for home healthcare, and these are the practical lessons I learned about constraints, reliability, and why MLOps matters.",
    tags: ["AI in Healthcare", "MLOps", "Scheduling Algorithms"],
    content: [
      {
        type: "paragraph",
        text: "I love the idea of Hospital at Home. Instead of keeping patients in an expensive hospital, you let them recover at home. The clinical results are promising, but the logistics are incredibly hard. You are taking a centralized hospital system and spreading its nurses, equipment, and visits across an entire city."
      },
      {
        type: "heading",
        text: "The Traveling Nurse Problem"
      },
      {
        type: "paragraph",
        text: "The hardest part for my team was the scheduling engine. We were trying to match clinicians to patients all day while dealing with a huge number of constraints:"
      },
      {
        type: "list",
        items: [
          "Clinical constraints: A patient needing a specific IV medication must be seen by an RN with that specific competency.",
          "Time constraints: Vitals must be checked within strict time windows.",
          "Geographic constraints: Driving time through city traffic varies drastically by time of day.",
          "Continuity of care: Patients prefer seeing the same clinician, which builds trust and improves observational diagnosis."
        ]
      },
      {
        type: "heading",
        text: "Why Machine Learning Falls Short on its Own"
      },
      {
        type: "paragraph",
        text: "My first thought was, 'Let us use reinforcement learning.' That turned out to be a bad idea. In healthcare, rules are not optional. If a model explores a strange route and makes a nurse late for a critical medication window, the consequences are serious. That became clear very quickly."
      },
      {
        type: "paragraph",
        text: "We ended up moving to operations research and mixed-integer linear programming. We still used machine learning, but only for predictions like task duration and traffic delays. The actual scheduling was handled by a deterministic solver. That hybrid approach was the breakthrough. ML handled the uncertain parts, and optimization handled the strict rules."
      },
      {
        type: "heading",
        text: "MLOps in a High-Stakes Environment"
      },
      {
        type: "paragraph",
        text: "Deploying this system changed how I think about MLOps. Silent failures in a healthcare app can mean doctors do not show up when they should. We had to build strong drift detection and monitoring. At one point, a new clinical protocol made visits take longer than usual. Our model started underestimating visit times, and the schedule nearly broke over a weekend. It was stressful, but it showed how important monitoring really is."
      },
      {
        type: "paragraph",
        text: "We built shadow deployments where the models ran alongside human schedulers. We compared the algorithm's choices with human decisions before trusting it in production. Over time, the system started outperforming the human baseline by finding geographic patterns that were hard to see in real time."
      },
      {
        type: "heading",
        text: "Takeaways"
      },
      {
        type: "paragraph",
        text: "In the end, building AI for this kind of work is not about showing off big models. It is about building a safe system that keeps working when reality gets messy. Writing the code was the easier part. Translating the complexity of real hospital operations into logic was the part that stayed with me."
      }
    ]
  }
];

export const blogs: Blog[] = blogSources.map((blog) => ({
  ...blog,
  readTime: calculateReadTime(blog.content),
}));
