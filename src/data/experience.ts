export interface Experience {
  role: string;
  company: string;
  dates: string;
  achievements: string[];
}

export const experiences: Experience[] = [
  {
    role: "Founding Machine Learning Engineer @ Routerr Health",
    company: "Columbia Build Lab",
    dates: "Aug 2025 — Jan 2026",
    achievements: [
      "Architected AI-driven scheduling and routing algorithms leveraging machine learning, deep learning, and optimization techniques to accelerate Hospital-at-Home operations by 2x, improving real-time clinician dispatch.",
      "Developed hybrid predictive models (LSTM + ARIMA) in PyTorch for time-series forecasting of patient demand and clinician availability, reducing scheduling overhead by 20%.",
      "Built end-to-end MLOps pipelines using PostgreSQL, MLflow, Docker, and Kubernetes, enabling scalable model training and deployment across 10,000+ optimization scenarios daily.",
      "Collaborated cross-functionally with engineering and product teams to design, A/B test, and deploy data-driven features, boosting clinician utilization by 12%.",
    ],
  },
  {
    role: "Machine Learning Engineer Intern",
    company: "Avati Consulting Solutions",
    dates: "Jun 2025 — Aug 2025",
    achievements: [
      "Built an AI-powered Early Warning System to forecast credit default and portfolio risk 3–6 months in advance across 15+ banks, driving proactive credit monitoring.",
      "Designed and deployed ensemble-based risk scoring models (Logistic Regression, Random Forest, Gradient Boosting) in PyTorch, achieving 0.68+ AUC for early detection of at-risk accounts.",
      "Engineered PySpark ETL pipelines to automate data ingestion from financial, behavioral, and macroeconomic sources, cutting ML prep time by 75%.",
      "Integrated LLMs with risk models via Model Context Protocol (MCP) to generate explainable insights for risk officers, strengthening AI interpretability and compliance alignment.",
      "Delivered real-time dashboards for credit risk insights — helping financial institutions mitigate millions in potential credit losses.",
    ],
  },
  {
    role: "Graduate Teaching Assistant",
    company: "Columbia University — Department of Computer Science",
    dates: "Sep 2024 — May 2025",
    achievements: [
      "Assisted in teaching Machine Learning and Data Mining, leading lab sessions on model evaluation, feature engineering, and optimization using Python, NumPy, and scikit-learn.",
      "Mentored 60+ graduate students through end-to-end ML projects, improving model performance and interpretability through hands-on code reviews and algorithmic troubleshooting.",
    ],
  },
  {
    role: "Software Engineer I",
    company: "Perficient",
    dates: "Jun 2022 — Mar 2024",
    achievements: [
      "Modernized a legacy monolithic automobile sales rewards platform into a scalable, event-driven microservices architecture on Google Cloud, reducing deployment time by 40%.",
      "Designed and deployed high-throughput RESTful APIs with Java, Spring Boot, and Kubernetes, leveraging GCP services (Cloud Firestore, Pub/Sub) for real-time data processing.",
      "Migrated on-premise databases to Cloud SQL, building ETL pipelines that streamlined queries by 1.5x and improved SLA compliance for customer-facing applications.",
      "Implemented automated Bayesian hyperparameter optimization for ensemble ML models predicting sales rewards, deploying pipelines on Vertex AI and reducing retraining time by 30%.",
    ],
  },
  {
    role: "Machine Learning Engineer Intern",
    company: "Tata Consultancy Services",
    dates: "May 2021 — Aug 2021",
    achievements: [
      "Engineered a probabilistic sentiment analysis system using PyTorch and TensorFlow, performing real-time text classification of customer support conversations.",
      "Built high-throughput Spark ETL pipelines to process multi-source streaming and batch data at 3x scale, reducing data prep and inference latency.",
      "Integrated ML predictions into operational workflows, driving a 50% increase in customer retention.",
    ],
  },
  {
    role: "Computer Science Teaching Assistant & Lead Web Developer",
    company: "Grinnell College",
    dates: "Aug 2020 — May 2022",
    achievements: [
      "Mentored students in programming, algorithms, and software development, providing one-on-one guidance to improve coding proficiency and problem-solving skills.",
      "Architected a Ruby on Rails application with full-stack development, integrating backend APIs, authentication systems, and cloud deployment (AWS, Heroku), driving a 35% increase in successful funding applications.",
    ],
  },
];
