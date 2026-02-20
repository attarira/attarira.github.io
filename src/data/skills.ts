export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Core Programming",
    skills: [
      "Python",
      "Java",
      "TypeScript",
      "Ruby",
      "C++",
      "SQL",
      "PySpark",
      "Bash",
    ],
  },
  {
    category: "Machine Learning & AI",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "NumPy",
      "MLflow",
      "Vertex AI",
      "LSTM",
      "ARIMA",
      "Gradient Boosting",
      "Ensemble Methods",
    ],
  },
  {
    category: "LLM & NLP Systems",
    skills: [
      "LangChain",
      "RAG Pipelines",
      "Model Context Protocol (MCP)",
      "Prompt Engineering",
      "Sentiment Analysis",
      "Text Classification",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    skills: [
      "Google Cloud (GCP)",
      "AWS",
      "Docker",
      "Kubernetes",
      "PostgreSQL",
      "Cloud SQL",
      "Cloud Firestore",
      "Pub/Sub",
      "Heroku",
    ],
  },
  {
    category: "Data Engineering & MLOps",
    skills: [
      "Apache Spark",
      "ETL Pipelines",
      "MLflow",
      "CI/CD",
      "A/B Testing",
      "Bayesian Optimization",
      "Microservices",
      "RESTful APIs",
    ],
  },
  {
    category: "Frameworks & Tools",
    skills: [
      "Spring Boot",
      "Ruby on Rails",
      "Next.js",
      "React",
      "FastAPI",
      "Git",
    ],
  },
];
