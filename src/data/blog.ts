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
    slug: "beyond-vector-search",
    title: "Beyond Vector Search: When RAG Needs a Knowledge Graph",
    date: "Feb 5, 2026",
    readTime: "2 min read",
    preview:
      "RAG has become the standard for grounding LLMs, but simple vector similarity often fails on complex, multi-hop queries. In this post, I explore my recent experiments combining SpanBERT and Gemini to extract semantic relationships and structure them into a lightweight knowledge graph. By fusing classical IR with transformer-based extraction, we can bypass the context window limitations and significantly improve search relevance.",
    tags: ["LLM", "RAG", "Knowledge Graphs"],
    content: [
      {
        type: "paragraph",
        text: "Retrieval-Augmented Generation (RAG) is arguably the most common architectural pattern for getting LLMs to \"know\" about private data. The standard playbook is simple: chunk your documents, run them through an embedding model (like text-embedding-ada-002 or Vertex Gecko), and stuff the top-K cosine similarity matches into the context window. But when building systems for complex technical documentation or entangled legal contracts, this naïve approach breaks down fast."
      },
      {
        type: "heading",
        text: "The Problem with Pure Vector Similarity"
      },
      {
        type: "paragraph",
        text: "Vector databases are incredible, but they fundamentally measure semantic overlap, not factual relation. If you ask a standard RAG system 'What are the dependencies of the Data Processor service?', it might just surface chunks that happen to mention 'Data Processor' and 'dependencies' in similar syntactic structures, rather than actually tracing the dependency graph. Multi-hop reasoning—where answering a question requires piecing together Fact A from Document 1 and Fact B from Document 2—is notoriously difficult for vector searches to resolve cleanly."
      },
      {
        type: "heading",
        text: "Enter the Knowledge Graph (KG)"
      },
      {
        type: "paragraph",
        text: "To solve this, I started experimenting with extracting entities and their specific relationships to form a lightweight knowledge graph. Instead of just chunking text, the pipeline processes text to identify (Subject) -> [Predicate] -> (Object) triplets."
      },
      {
        type: "list",
        items: [
          "Step 1: Use an LLM like Gemini or a fine-tuned SpanBERT to perform Named Entity Recognition (NER) and Relation Extraction (RE).",
          "Step 2: Store these triplets into a graph database (like Neo4j or even an in-memory networkx graph for smaller scopes).",
          "Step 3: During query time, parse the user's intent to extract query entities.",
          "Step 4: Traverse the graph to find neighbors of the queried entities up to 2-3 hops away."
        ]
      },
      {
        type: "heading",
        text: "Hybridizing Graph and Vector"
      },
      {
        type: "paragraph",
        text: "The real magic happens when you fuse both approaches. We maintain our vector store for unstructured semantic queries ('How does the deployment process feel?'), but we overlay the Graph RAG for structured traversal ('Which services break if the auth database goes down?')."
      },
      {
        type: "paragraph",
        text: "By pulling subgraph contexts (text representations of the relationships) and appending them alongside top vector chunks into the prompt, the LLM finally has the structural context it needs. The context window is utilized far more efficiently because we are injecting high-density, factually connected information rather than isolated paragraphs."
      },
      {
        type: "heading",
        text: "Future Directions"
      },
      {
        type: "paragraph",
        text: "As context windows grow to millions of tokens, some argue that RAG—and specifically complex architectures like GraphRAG—will become obsolete. While massive context helps, I firmly believe that structuring data logically at ingestion time reduces hallucination risks and computational costs. Graph-augmented RAG isn't just a workaround for small context windows; it's a fundamental step toward aligning AI systems with the actual structure of human knowledge."
      }
    ]
  },
  {
    slug: "deploying-hospital-at-home-ai",
    title: "The Reality of Deploying Hospital-at-Home AI",
    date: "Jan 5, 2026",
    readTime: "3 min read",
    preview:
      "Building ML models in a notebook is one thing; deploying them to schedule real clinicians for real patients is entirely another. Here's what I learned building the real-time scheduling engine for scalable home healthcare. We dive into handling dynamic constraints, balancing clinician utilization with patient outcomes, and the unglamorous but critical role of robust MLOps in ensuring these models don't fail silently.",
    tags: ["AI in Healthcare", "MLOps", "Scheduling Algorithms"],
    content: [
      {
        type: "paragraph",
        text: "The premise of 'Hospital at Home' is compelling: why keep patients in expensive, infection-prone acute care facilities when we can deliver hospital-level care in their own living rooms? The clinical outcomes often show improved recovery times and lower readmission rates. But logistically, it's a nightmare. Effectively, you are breaking down a centralized hospital and dynamically distributing its nurses, doctors, and equipment across a city."
      },
      {
        type: "heading",
        text: "The Traveling Nurse Problem"
      },
      {
        type: "paragraph",
        text: "Our core challenge was the scheduling engine. It's essentially a massive, highly-constrained Vehicle Routing Problem with Time Windows (VRPTW). We had to map clinicians to patients while respecting:"
      },
      {
        type: "list",
        items: [
          "Clinical constraints: A patient needing a specific IV medication must be seen by an RN with that specific competency.",
          "Time constraints: Vitals must be checked within specific tightly bound time-windows.",
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
        text: "Initially, there's a temptation to solve this entirely with ML—perhaps using Reinforcement Learning to optimize the scheduling matrix. We quickly realized this was the wrong tool for the job. Strict clinical constraints are non-negotiable. If an RL agent 'hallucinates' or tries a sub-optimal exploration path that misses a strict medication window, the results could be catastrophic."
      },
      {
        type: "paragraph",
        text: "Instead, we leaned on operations research (OR) and mixed-integer linear programming (MILP). We used ML to predict the inputs to the optimizer: estimating task duration based on patient acuity, and forecasting traffic delays. The actual assignment was handled by a deterministic solver. This hybrid approach—ML for predicting stochastic variables, OR for constraint solving—proved to be the sweet spot."
      },
      {
        type: "heading",
        text: "MLOps in a High-Stakes Environment"
      },
      {
        type: "paragraph",
        text: "Deploying this system forced us to confront strict MLOps realities. In healthcare, a silent failure is the worst-case scenario. We implemented rigorous drift detection. For example, if our 'visit duration model' started under-predicting times because a new protocol was introduced, schedules would collapse in real-time, leaving clinicians stranded or patients waiting."
      },
      {
        type: "paragraph",
        text: "We built shadow deployments where models ran concurrently with human schedulers, measuring the diffs between the algorithm's choices and human intuition. Over time, the algorithm's utilization rates surpassed the human baselines by explicitly capitalizing on geographic clustering that humans found too complex to visualize on the fly."
      },
      {
        type: "heading",
        text: "Takeaways"
      },
      {
        type: "paragraph",
        text: "Building AI for healthcare logistics is less about cutting-edge neural networks and more about creating robust, failsafe systems that correctly integrate predictions into real-world constraints. The hardest part wasn't writing the code; it was modeling the messy, physical reality of the healthcare system into something the code could understand."
      }
    ]
  }
];
