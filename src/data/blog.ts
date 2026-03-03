export interface Blog {
  title: string;
  date: string;
  readTime: string;
  preview: string;
  tags: string[];
  link?: string;
}

export const blogs: Blog[] = [
  {
    title: "Beyond Vector Search: When RAG Needs a Knowledge Graph",
    date: "Feb 18, 2026",
    readTime: "7 min read",
    preview:
      "RAG has become the standard for grounding LLMs, but simple vector similarity often fails on complex, multi-hop queries. In this post, I explore my recent experiments combining SpanBERT and Gemini to extract semantic relationships and structure them into a lightweight knowledge graph. By fusing classical IR with transformer-based extraction, we can bypass the context window limitations and significantly improve search relevance.",
    tags: ["LLM", "RAG", "Knowledge Graphs"],
  },
  {
    title: "The Reality of Deploying Hospital-at-Home AI",
    date: "Jan 12, 2026",
    readTime: "5 min read",
    preview:
      "Building ML models in a notebook is one thing; deploying them to schedule real clinicians for real patients is entirely another. Here's what I learned building the real-time scheduling engine for scalable home healthcare. We dive into handling dynamic constraints, balancing clinician utilization with patient outcomes, and the unglamorous but critical role of robust MLOps in ensuring these models don't fail silently.",
    tags: ["AI in Healthcare", "MLOps", "Scheduling Algorithms"],
  },
];
