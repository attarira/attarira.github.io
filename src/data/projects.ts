export interface Project {
  id?: string;
  title: string;
  description: string;
  problem: string;
  outcome: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  websiteUrl?: string;
  date?: string;
}

export const projects: Project[] = [
  {
    id: "finsearchai",
    title: "FinSearchAI: Intelligent Financial Document Search & Analysis",
    date: "Jan 2026",
    description:
      "A production-ready, fully local open-source semantic search and question-answering system specifically designed for financial documents.",
    problem:
      "Enabling secure, offline semantic search and RAG capabilities for complex financial documents without relying on external APIs.",
    outcome:
      "Engineered a high-performance asynchronous pipeline using FinBERT for embeddings, FAISS for vector search, and Llama 3.1 via Ollama for context-aware answers.",
    techStack: ["Python", "FinBERT", "FAISS", "Llama 3.1", "Ollama", "Docker"],
    githubUrl: "https://github.com/attarira/fin-search",
    demoUrl: "/projects/finsearchai/demo",
  },
  {
    id: "plant-disease-detection",
    title: "Plant Disease Detection System",
    description:
      "A computer vision system for detecting and classifying plant diseases from leaf images, combining traditional CV approaches with deep learning techniques.",
    problem:
      "Accurately identifying plant diseases from varied leaf images to support early agricultural intervention.",
    outcome:
      "Evaluated traditional CV feature extraction and CNN models on the PlantVillage dataset, deploying the optimal model via a Flask web application.",
    techStack: ["Python", "Computer Vision", "CNN", "Flask", "Machine Learning"],
    githubUrl: "https://github.com/attarira/plant-disease-detection",
  },
  {
    id: "lifeos",
    title: "LifeOS: Personal Planning & Decision Agent",
    date: "Feb 2026",
    description:
      "A unified productivity platform spanning tasks, notes, and scheduling with an integrated AI planning agent.",
    problem:
      "Bridging the gap between high-level natural language goals and structured, actionable productivity tracking.",
    outcome:
      "Engineered an AI agent that converts natural language goals into executable workflows, dependencies, and automated notifications.",
    techStack: ["Python", "Claude", "React", "Vite"],
    githubUrl: "https://github.com/attarira/life-os",
    demoUrl: "/projects/lifeos/demo",
  },
  {
    id: "media-watcher",
    title: "Media Watcher: AI-powered News Intelligence",
    date: "Jan 2026",
    description:
      "AI-driven news intelligence system that produces structured, citation-backed risk intelligence for companies.",
    problem:
      "Extracting real-time, accurate risk sentiment and entities from continuously streaming, unstructured news data.",
    outcome:
      "Utilized search grounding and fine-tuned sentiment models to extract entities in real-time, reducing compliance review time by ~70%.",
    techStack: ["Python", "Gemini", "RAG", "Sentiment Analysis"],
    githubUrl: "https://github.com/attarira/media-watcher",
    demoUrl: "/projects/media-watcher/demo",
  },
  {
    id: "kepler-search",
    title: "Kepler Search",
    date: "2026",
    description:
      "An astronomy research search platform that unifies fragmented scientific content into one interface.",
    problem:
      "Astronomy data lives across disconnected sources like NASA image libraries, exoplanet archives, star catalogs, and research papers, making discovery slow and forcing users to manually cross-reference results across multiple tools.",
    outcome:
      "Built a single search experience that brings together heterogeneous astronomy sources so researchers can move from exploration to cross-referenced discovery in one place.",
    techStack: [
      "Search",
      "Information Retrieval",
      "Astronomy Data",
      "Research Platform",
    ],
    demoUrl: "/projects/kepler-search/demo",
  },
  {
    title: "Spike Sorting: Efficient Dimensionality Reduction",
    date: "Dec 2025",
    description:
      "An evaluation framework for large-scale neural embeddings to identify optimal dimensionality reduction and clustering methods.",
    problem:
      "Processing and compressing massive neural recordings efficiently without losing significant neural information.",
    outcome:
      "Benchmarked 20+ methods (UMAP, t-SNE, VAEs), achieving 10x compression with 85% information retention; published results under review.",
    techStack: ["Python", "PyTorch", "Scikit-Learn"],
    githubUrl: "https://github.com/attarira/neural-spike-sort",
    paperUrl: "https://drive.google.com/file/d/1xtgBFvkUbxYchkWEw-W04bWBkZOBzUJU/view?usp=sharing",
  },
  {
    title: "Query Expansion with SpanBERT & Gemini",
    date: "May 2025",
    description:
      "Designed a hybrid search system combining classical IR models (TF-IDF, Rocchio, N-Gram) with transformer-based query expansion (SpanBERT, Gemini).",
    problem:
      "Extracting semantic relations to improve search relevance over baseline statistical methods.",
    outcome:
      "Improved top-10 search relevance by 40% over baseline methods.",
    techStack: ["Python", "LLMs", "Google Cloud", "SpanBERT", "Gemini"],
    githubUrl: "https://github.com/attarira/semantic-search",
  },
  {
    title: "Neural Network Dependency Parser",
    date: "Feb 2025",
    description:
      "Implemented a feed-forward neural network to predict syntactic transition labels in an arc-standard dependency parser.",
    problem:
      "Parsing complex sentence structures and predicting syntactic transitions accurately.",
    outcome:
      "Engineered feature embeddings for POS tags, dependency arcs, and stack buffering, achieving a LAS score of 70 in testing.",
    techStack: ["Python", "TensorFlow"],
    githubUrl: "https://github.com/attarira/neural-dependency-parser",
  },
  {
    title: "Predicting Risk of Heart Disease",
    date: "Jan 2025",
    description:
      "Developed ML models on CDC health survey data to predict risk of heart disease and support early intervention.",
    problem:
      "Identifying high-risk patients efficiently using clinical and lifestyle features from survey data.",
    outcome:
      "Evaluated multiple classifiers and optimized XGBoost to achieve 0.74 recall on high-risk cases.",
    techStack: ["Python", "Scikit-learn", "PyTorch", "XGBoost"],
    githubUrl: "https://github.com/attarira/heart-disease-ml-2.0",
  },
  {
    title: "Optimizing Hypervisor-Guest Communication",
    date: "Sep 2024 - Present",
    description:
      "Enabled high-speed communication channels between a hypervisor host and guest VMs using QEMU-KVM.",
    problem:
      "Reducing latency and improving communication throughput in virtualized environments.",
    outcome:
      "Improved responsiveness by implementing hot unplugging and affinity adjustments for the UFO, CPS models.",
    techStack: ["C", "QEMU-KVM", "Virtualization"],
    githubUrl: "https://github.com/Nicyzk/ufo-cps",
  },
  {
    title: "An Analysis of Schedulers for the Cloud",
    date: "Sep 2024 - Dec 2024",
    description:
      "Researched VM scheduling inefficiencies in cloud environments by analyzing host and guest communication.",
    problem:
      "Identifying overhead and scheduling bottlenecks in cloud environments.",
    outcome:
      "Benchmarked the Rorke scheduler against UFO, CPS frameworks, demonstrating up to 21% lower p95 latency.",
    techStack: ["Cloud Computing", "Virtualization", "Benchmarking"],
    paperUrl:
      "https://drive.google.com/file/d/1zGxY8gGxIjUBosQNMoV16_oznMn8ANAY/view?usp=sharing",
  },
  {
    title: "Bakery Business E-Commerce Application",
    date: "Mar 2022 - Sep 2024",
    description:
      "Developed a web interface for a family-owned bakery business to improve customer engagement.",
    problem:
      "Modernizing a traditional bakery business with an online presence for order processing and inventory.",
    outcome:
      "Managed business logic with Node.js to streamline order processing, inventory management, and revenue tracking.",
    techStack: ["React", "Node.js", "E-Commerce"],
    websiteUrl: "https://goriawallas.lovable.app/",
  },
  {
    title: "Operating System Kernel",
    date: "Jan 2022 - May 2022",
    description:
      "Devised and created a functional OS kernel from scratch with C and assembly in a 64-bit CPU architecture.",
    problem:
      "Building a foundational operating system with memory protection and hardware interruption handling.",
    outcome:
      "Configured device drivers and interrupt handlers to allow the execution of programs within protected memory.",
    techStack: ["C", "Assembly", "OS Development"],
    githubUrl: "https://github.com/attarira/kernel",
  },
  {
    id: "movie-rec-sys",
    title: "Movie Recommendation System",
    date: "Mar 2020 - May 2020",
    description:
      "Built a Java-based recommendation system for movies employing content and collaborative filtering techniques.",
    problem:
      "Generating accurate and personalized movie recommendations using filtering techniques.",
    outcome:
      "Performed research on and implemented various classification ML models, including XGBoost and Random Forests.",
    techStack: ["Java", "Machine Learning", "XGBoost", "Random Forest"],
    githubUrl: "https://github.com/attarira/movie-rec-sys",
    demoUrl: "/projects/movie-rec-sys/demo",
  },
  {
    title: "Hospital-at-Home AI Scheduling Engine",
    description:
      "AI-driven scheduling and routing system for Hospital-at-Home care, optimizing real-time clinician dispatch to improve patient outcomes at scale.",
    problem:
      "Matching the right clinician to the right patient at the right time across dynamic, resource-constrained home healthcare operations.",
    outcome:
      "Accelerated Hospital-at-Home operations by 2x, reduced scheduling overhead by 20%, and boosted clinician utilization by 12% across 10,000+ daily optimization scenarios.",
    techStack: [
      "Python",
      "PyTorch",
      "LSTM",
      "ARIMA",
      "PostgreSQL",
      "MLflow",
      "Docker",
      "Kubernetes",
    ],
    demoUrl: "/coming-soon",
  },
  {
    title: "AI Credit Risk Early Warning System",
    description:
      "Ensemble-based early warning system that forecasts credit default and portfolio risk 3–6 months in advance for financial institutions.",
    problem:
      "Enabling proactive credit monitoring and compliance across 15+ banks with explainable, trustworthy AI risk scoring.",
    outcome:
      "Achieved 0.68+ AUC with ensemble models, cut ML prep time by 75% with automated PySpark ETL, and delivered real-time dashboards to mitigate millions in potential credit losses.",
    techStack: [
      "PyTorch",
      "PySpark",
      "Gradient Boosting",
      "Random Forest",
      "LangChain",
      "MCP",
    ],
    githubUrl: "/coming-soon",
    demoUrl: "/coming-soon",
  },
  {
    id: "real-time-sentiment-analysis",
    title: "Real-Time Sentiment Analysis Engine",
    description:
      "Probabilistic sentiment analysis system performing real-time text classification of customer support conversations to enhance feedback-driven decision-making.",
    problem:
      "Processing multi-source streaming and batch data at scale with minimal latency for actionable customer intelligence.",
    outcome:
      "Built high-throughput Spark ETL pipelines at 3x scale, reducing inference latency and driving a 50% increase in customer retention.",
    techStack: [
      "PyTorch",
      "TensorFlow",
      "Apache Spark",
      "Python",
      "NLP",
    ],
    demoUrl: "/projects/real-time-sentiment-analysis/demo",
  },

];
