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

export const blogs: Blog[] = [
  {
    slug: "designing-autonomous-agents",
    title: "Designing Autonomous AI Agents for Software Engineering",
    date: "Mar 5, 2026",
    readTime: "3 min read",
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
    readTime: "2 min read",
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
    readTime: "3 min read",
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
