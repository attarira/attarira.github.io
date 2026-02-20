export interface Project {
  title: string;
  description: string;
  problem: string;
  outcome: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
}

export const projects: Project[] = [
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
    githubUrl: "https://github.com/attarira",
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
    githubUrl: "https://github.com/attarira",
  },
  {
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
    githubUrl: "https://github.com/attarira",
  },
  {
    title: "Cloud-Native Microservices Platform",
    description:
      "Modernized a legacy monolithic automobile sales rewards platform into a scalable, event-driven microservices architecture on Google Cloud.",
    problem:
      "Replacing a legacy monolith with a cloud-native architecture to improve modularity, deployment speed, and real-time data processing for 100K+ users.",
    outcome:
      "Reduced deployment time by 40%, streamlined database queries by 1.5x, and automated ML model retraining with Bayesian hyperparameter optimization on Vertex AI.",
    techStack: [
      "Java",
      "Spring Boot",
      "GCP",
      "Kubernetes",
      "Cloud SQL",
      "Pub/Sub",
      "Vertex AI",
    ],
    githubUrl: "https://github.com/attarira",
  },
];
