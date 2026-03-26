export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Backend",
    skills: [
      "Python",
      "SQL",
      "TypeScript",
      "Java",
      "Spring Boot",
      "Ruby on Rails",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    category: "AI Orchestration",
    skills: [
      "LangGraph",
      "LlamaIndex",
      "CrewAI",
      "MLflow",
      "Model Context Protocol (MCP)",
      "Claude / Gemini API",
    ],
  },
  {
    category: "Machine Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "HuggingFace (PEFT / Transformers)",
      "Scikit-learn",
      "Statistical Modeling",
      "XGBoost",
    ],
  },
  {
    category: "Data Infrastructure",
    skills: [
      "GCP (Certified)",
      "Vertex AI",
      "AWS",
      "PySpark / Spark",
      "Pinecone",
      "PostgreSQL",
      "Cloud Firestore / Pub/Sub",
      "ETL Pipelines",
      "Vector Database Design",
    ],
  },
];
