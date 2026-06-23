import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

let nodeIdCounter = 0;
function uid() { return `tech_node_${++nodeIdCounter}_${Math.random().toString(36).slice(2,8)}`; }

const SECTION_W = 320, SECTION_H = 56;
const NODE_W = 240, NODE_H = 46;

function titleNode(id, label, x, y) {
  return { id, type: 'title', position: { x, y }, data: { label, style: { fontSize: 34, fontWeight: 900 } }, width: 400, height: 64, style: { width: 400, height: 64 }, zIndex: 999, dragging: false, focusable: true, measured: { width: 400, height: 64 } };
}
function sectionNode(id, label, x, y) {
  return { id, type: 'topic', position: { x, y }, data: { label, isSection: true, style: { fontSize: 17, borderColor: '#1e293b', borderWidth: '3px' } }, width: SECTION_W, height: SECTION_H, style: { width: SECTION_W, height: SECTION_H }, zIndex: 999, dragging: false, focusable: true, measured: { width: SECTION_W, height: SECTION_H } };
}
function topicNode(id, label, x, y) {
  return { id, type: 'topic', position: { x, y }, data: { label, style: { fontSize: 14, borderColor: '#cbd5e1' } }, width: NODE_W, height: NODE_H, style: { width: NODE_W, height: NODE_H }, zIndex: 999, dragging: false, focusable: true, measured: { width: NODE_W, height: NODE_H } };
}
function edge(id, source, target) {
  return { id, source, target, type: 'default', animated: false, style: { stroke: '#3b82f6', strokeWidth: 2.5 }, markerEnd: { type: 'arrowclosed', color: '#3b82f6' } };
}

function buildRoadmap(titleLabel, sections) {
  const nodes = [], edges = [];
  let y = 0;
  const cx = 500;
  const COLS = 6;
  const GAP_X = NODE_W + 18;

  const titleId = uid();
  nodes.push(titleNode(titleId, titleLabel, cx - 200, y));
  y += 100;

  let prevSecId = null;
  for (const sec of sections) {
    const secId = uid();
    nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
    if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
    prevSecId = secId;
    y += SECTION_H + 24;

    const totalW = Math.min(sec.topics.length, COLS) * GAP_X;
    let tx = cx - totalW / 2;
    const topicStartY = y;

    for (let i = 0; i < sec.topics.length; i++) {
      if (i > 0 && i % COLS === 0) { tx = cx - totalW / 2; y += NODE_H + 14; }
      const tid = uid();
      nodes.push(topicNode(tid, sec.topics[i], tx, i < COLS ? topicStartY : y));
      edges.push(edge(uid(), secId, tid));
      tx += GAP_X;
    }
    y += NODE_H + 70;
  }

  return { nodes, edges };
}

// ─── TECH ROADMAPS ────────────────────────────────────────────────────────────

const techRoadmaps = {

  'frontend': buildRoadmap('Frontend Developer', [
    { label: 'Internet & Web Basics', topics: ['How the Internet Works', 'HTTP & HTTPS', 'DNS', 'Browsers & Rendering', 'Domain Names & Hosting', 'What is a Web Server?'] },
    { label: 'HTML', topics: ['Semantic HTML', 'Forms & Validation', 'Accessibility (ARIA)', 'SEO Basics', 'Meta Tags', 'HTML5 APIs'] },
    { label: 'CSS', topics: ['Box Model', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Media Queries', 'CSS Variables', 'Animations & Transitions', 'Pseudo-elements'] },
    { label: 'JavaScript', topics: ['ES6+ Syntax', 'DOM Manipulation', 'Fetch API & Promises', 'Async / Await', 'Event Loop', 'Closures & Scope', 'Modules (ESM)', 'Error Handling'] },
    { label: 'Version Control', topics: ['Git Basics', 'GitHub / GitLab', 'Branching & Merging', 'Pull Requests', 'Git Workflow', 'Resolving Conflicts'] },
    { label: 'React', topics: ['Components & JSX', 'Props & State', 'useState & useEffect', 'useContext', 'React Router', 'Custom Hooks', 'React Query', 'Performance Optimization'] },
    { label: 'Build Tools & Tooling', topics: ['npm / yarn / pnpm', 'Vite', 'Webpack Basics', 'Babel', 'ESLint & Prettier', 'Environment Variables'] },
    { label: 'CSS Frameworks & Styling', topics: ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Shadcn UI', 'Figma Handoff', 'Design Systems'] },
    { label: 'TypeScript', topics: ['Types & Interfaces', 'Generics', 'Union & Intersection', 'Type Assertions', 'Utility Types', 'tsconfig'] },
    { label: 'Testing', topics: ['Jest', 'React Testing Library', 'Vitest', 'End-to-End (Playwright)', 'Unit vs. Integration', 'Mocking & Spies'] },
    { label: 'Performance & Web Vitals', topics: ['Core Web Vitals (LCP/FID/CLS)', 'Lazy Loading', 'Code Splitting', 'Image Optimization', 'Caching Strategies', 'Bundle Analysis'] },
    { label: 'Deployment', topics: ['Vercel', 'Netlify', 'CI/CD Pipelines', 'Environment Management', 'Custom Domains', 'HTTPS & SSL'] },
  ]),

  'backend': buildRoadmap('Backend Developer', [
    { label: 'Internet Fundamentals', topics: ['HTTP Methods & Status Codes', 'REST vs. GraphQL', 'DNS & Networking', 'SSH Basics', 'Ports & Firewalls', 'OSI Model'] },
    { label: 'Programming Language', topics: ['Node.js / Python / Go', 'Async Programming', 'Error Handling Patterns', 'Type Safety', 'Standard Library', 'Package Management'] },
    { label: 'Databases (Relational)', topics: ['SQL Basics', 'PostgreSQL / MySQL', 'Schema Design', 'Normalization', 'Indexes & Performance', 'Transactions & ACID'] },
    { label: 'Databases (NoSQL)', topics: ['MongoDB', 'Redis (Caching)', 'Document vs. Key-Value', 'When to use NoSQL', 'Data Modeling in Mongo', 'Aggregation Pipelines'] },
    { label: 'APIs', topics: ['REST API Design', 'Authentication (JWT/OAuth)', 'Rate Limiting', 'API Versioning', 'Pagination & Filtering', 'OpenAPI / Swagger Docs'] },
    { label: 'ORMs & Query Builders', topics: ['Prisma / Drizzle', 'Sequelize', 'Migrations', 'Seeding Data', 'N+1 Problem', 'Raw Queries'] },
    { label: 'Authentication & Security', topics: ['JWT Tokens', 'OAuth 2.0 & OIDC', 'Session Management', 'Password Hashing (bcrypt)', 'CORS', 'OWASP Top 10'] },
    { label: 'Caching & Performance', topics: ['Redis Caching', 'CDN', 'Database Query Optimization', 'Indexing Strategies', 'Connection Pooling', 'Load Testing'] },
    { label: 'Message Queues', topics: ['RabbitMQ / Kafka', 'Job Queues (BullMQ)', 'Event-Driven Architecture', 'Pub/Sub Pattern', 'Dead Letter Queues', 'Idempotency'] },
    { label: 'Testing', topics: ['Unit Testing', 'Integration Testing', 'API Testing (Postman/Jest)', 'Test Doubles & Mocking', 'Coverage Reports', 'TDD Approach'] },
    { label: 'Architecture', topics: ['Monolith vs. Microservices', 'SOLID Principles', 'Domain-Driven Design', 'Hexagonal Architecture', 'CQRS', 'Event Sourcing'] },
    { label: 'Deployment', topics: ['Docker', 'Docker Compose', 'CI/CD', 'Environment Config', 'Health Checks', 'Logging & Monitoring'] },
  ]),

  'devops': buildRoadmap('DevOps Engineer', [
    { label: 'Linux & Shell', topics: ['Linux Basics', 'Bash Scripting', 'File Permissions', 'Process Management', 'Cron Jobs', 'SSH & Key Management'] },
    { label: 'Networking', topics: ['OSI Model', 'TCP/IP', 'DNS & Load Balancing', 'Firewalls & Security Groups', 'HTTP/HTTPS', 'VPN & VPC'] },
    { label: 'Containerization', topics: ['Docker Fundamentals', 'Dockerfile Best Practices', 'Docker Compose', 'Container Registries', 'Multi-stage Builds', 'Container Security'] },
    { label: 'Kubernetes', topics: ['K8s Architecture', 'Pods & Deployments', 'Services & Ingress', 'ConfigMaps & Secrets', 'Helm Charts', 'Resource Limits & Autoscaling'] },
    { label: 'CI/CD', topics: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Pipeline Design', 'Blue-Green Deployments', 'Canary Releases', 'Automated Testing'] },
    { label: 'Infrastructure as Code', topics: ['Terraform', 'Ansible', 'Pulumi', 'State Management', 'Modules & Reuse', 'Drift Detection'] },
    { label: 'Cloud Providers', topics: ['AWS (EC2, S3, RDS, Lambda)', 'GCP / Azure Overview', 'IAM & Permissions', 'VPC & Networking', 'Cost Optimization', 'Multi-Region Setup'] },
    { label: 'Monitoring & Observability', topics: ['Prometheus & Grafana', 'ELK Stack', 'Datadog', 'Structured Logging', 'Distributed Tracing', 'Alerting & On-call'] },
    { label: 'Security (DevSecOps)', topics: ['Secrets Management (Vault)', 'SAST / DAST', 'Vulnerability Scanning', 'Zero Trust Networking', 'Compliance Automation', 'Shift-Left Security'] },
    { label: 'Service Mesh & Advanced', topics: ['Istio / Linkerd', 'Service Discovery', 'Traffic Management', 'mTLS', 'API Gateway', 'GitOps (ArgoCD/Flux)'] },
  ]),

  'full-stack': buildRoadmap('Full Stack Developer', [
    { label: 'Web Fundamentals', topics: ['HTML Semantics', 'CSS Layouts (Flex/Grid)', 'Responsive Design', 'HTTP / REST', 'Browser DevTools', 'Web Accessibility'] },
    { label: 'JavaScript & TypeScript', topics: ['ES6+ Essentials', 'Async / Await', 'TypeScript Basics', 'DOM APIs', 'Error Handling', 'Module System'] },
    { label: 'Frontend Framework', topics: ['React / Next.js', 'Component Architecture', 'State Management', 'Data Fetching (React Query)', 'Routing', 'Server Components'] },
    { label: 'Backend (Node.js)', topics: ['Express.js / Fastify', 'REST API Design', 'Middleware', 'Input Validation', 'Authentication (JWT)', 'Error Handling'] },
    { label: 'Databases', topics: ['PostgreSQL / MySQL', 'MongoDB', 'Prisma ORM', 'Query Optimization', 'Schema Design', 'Redis for Caching'] },
    { label: 'Authentication', topics: ['JWT & Sessions', 'OAuth 2.0', 'NextAuth / Auth.js', 'Role-Based Access', 'Secure Cookie Handling', 'MFA Basics'] },
    { label: 'APIs & Integration', topics: ['REST Best Practices', 'GraphQL Basics', 'Webhooks', 'Third-Party APIs', 'API Keys & Secrets', 'Rate Limiting'] },
    { label: 'DevOps & Deployment', topics: ['Git & GitHub', 'Vercel / Railway', 'Docker Basics', 'CI/CD with GitHub Actions', 'Environment Variables', 'Domain & HTTPS'] },
    { label: 'Testing', topics: ['Unit Tests (Vitest/Jest)', 'API Integration Tests', 'E2E with Playwright', 'Test-Driven Development', 'Coverage Reports', 'Snapshot Testing'] },
    { label: 'System Design Basics', topics: ['Scalability Concepts', 'Caching Strategies', 'Load Balancing', 'Database Sharding', 'CDN Usage', 'Microservices vs. Monolith'] },
  ]),

  'ai-data-scientist': buildRoadmap('AI & Data Scientist', [
    { label: 'Mathematics Foundations', topics: ['Linear Algebra (Vectors, Matrices)', 'Calculus (Derivatives, Gradients)', 'Probability & Statistics', 'Bayes Theorem', 'Information Theory', 'Optimization Basics'] },
    { label: 'Python for Data Science', topics: ['Python Basics', 'NumPy', 'Pandas', 'Matplotlib & Seaborn', 'Jupyter Notebooks', 'Virtual Environments'] },
    { label: 'Data Wrangling & EDA', topics: ['Data Cleaning', 'Missing Value Handling', 'Outlier Detection', 'Feature Engineering', 'Exploratory Data Analysis', 'Data Pipelines'] },
    { label: 'Machine Learning', topics: ['Supervised Learning', 'Unsupervised Learning', 'Linear & Logistic Regression', 'Decision Trees & Random Forests', 'SVM', 'k-NN & Clustering'] },
    { label: 'Model Evaluation', topics: ['Train/Val/Test Split', 'Cross-Validation', 'Confusion Matrix', 'Precision, Recall, F1', 'ROC/AUC', 'Bias-Variance Tradeoff'] },
    { label: 'Deep Learning', topics: ['Neural Networks', 'Backpropagation', 'CNNs (Image)', 'RNNs & LSTMs (Sequence)', 'Transformers', 'PyTorch / TensorFlow'] },
    { label: 'NLP', topics: ['Text Preprocessing', 'Tokenization & Embeddings', 'Sentiment Analysis', 'BERT & GPT Fine-tuning', 'RAG Systems', 'Vector Databases'] },
    { label: 'MLOps & Deployment', topics: ['Model Versioning (MLflow)', 'Model Serving (FastAPI)', 'Docker for ML', 'Feature Stores', 'Monitoring Model Drift', 'A/B Testing Models'] },
    { label: 'Data Engineering', topics: ['SQL & Databases', 'ETL Pipelines', 'Apache Spark', 'Airflow / Prefect', 'Data Warehousing', 'dbt'] },
    { label: 'Gen AI & LLMs', topics: ['Prompt Engineering', 'LangChain / LlamaIndex', 'RAG Architecture', 'Fine-tuning LLMs', 'AI Agents', 'Evaluation (LLM Evals)'] },
  ]),

  'android': buildRoadmap('Android Developer', [
    { label: 'Kotlin Fundamentals', topics: ['Variables & Data Types', 'Functions & Lambdas', 'Null Safety', 'Coroutines', 'Extension Functions', 'Data Classes & Sealed Classes'] },
    { label: 'Android Basics', topics: ['Activity & Fragment Lifecycle', 'Intents & Navigation', 'Manifest & Permissions', 'Android Studio Setup', 'Gradle Build System', 'ADB & Debugging'] },
    { label: 'UI Development', topics: ['Jetpack Compose', 'Layouts & Modifiers', 'State in Compose', 'Material 3', 'Dark/Light Theme', 'Custom UI Components'] },
    { label: 'Data Storage', topics: ['SharedPreferences', 'Room Database', 'DataStore', 'SQLite Basics', 'File Storage', 'Content Providers'] },
    { label: 'Networking', topics: ['Retrofit', 'OkHttp', 'JSON Parsing (Gson/Moshi)', 'REST APIs', 'GraphQL Clients', 'WebSocket'] },
    { label: 'Architecture Patterns', topics: ['MVVM', 'Clean Architecture', 'Repository Pattern', 'ViewModel & LiveData', 'StateFlow & Flow', 'Dependency Injection (Hilt)'] },
    { label: 'Jetpack Libraries', topics: ['Navigation Component', 'WorkManager', 'Paging 3', 'CameraX', 'Biometric API', 'In-App Updates'] },
    { label: 'Testing', topics: ['Unit Tests (JUnit)', 'Compose UI Tests', 'Espresso', 'Mocking (Mockk)', 'Integration Tests', 'Test Coverage'] },
    { label: 'Publishing & Performance', topics: ['Google Play Console', 'App Signing', 'ProGuard & R8', 'App Performance Profiling', 'Crash Reporting (Firebase)', 'CI/CD for Android'] },
  ]),

  'ios': buildRoadmap('iOS Developer', [
    { label: 'Swift Fundamentals', topics: ['Variables & Type System', 'Optionals & Nil Safety', 'Closures', 'Structs vs. Classes', 'Protocols & Extensions', 'Error Handling'] },
    { label: 'SwiftUI Basics', topics: ['Views & Modifiers', 'State & Binding', 'NavigationStack', 'Lists & ForEach', 'Environment Values', 'Custom ViewModifiers'] },
    { label: 'Data & State Management', topics: ['@State & @ObservedObject', '@EnvironmentObject', 'Combine Framework', 'Swift Data / Core Data', 'UserDefaults', 'Keychain'] },
    { label: 'Networking', topics: ['URLSession', 'Async/Await Networking', 'Codable & JSON Parsing', 'REST APIs', 'WebSocket', 'GraphQL Clients'] },
    { label: 'Architecture', topics: ['MVVM Pattern', 'Clean Architecture', 'Repository Pattern', 'Dependency Injection', 'TCA (The Composable Architecture)', 'Modularization'] },
    { label: 'Apple Frameworks', topics: ['MapKit', 'AVFoundation', 'Core Location', 'HealthKit', 'StoreKit (In-App Purchases)', 'Push Notifications (APNs)'] },
    { label: 'Testing', topics: ['XCTest Unit Tests', 'UI Testing', 'SnapshotTesting', 'Mocking with Protocols', 'Test Plans', 'Code Coverage'] },
    { label: 'App Store & Deployment', topics: ['Xcode Signing & Provisioning', 'App Store Connect', 'TestFlight', 'App Review Guidelines', 'Analytics (Firebase/Mixpanel)', 'CI/CD (Fastlane)'] },
    { label: 'Advanced Topics', topics: ['Swift Concurrency (Actor)', 'Swift Package Manager', 'Accessibility (VoiceOver)', 'Widgets & App Intents', 'Vision & ML Integration', 'Security Best Practices'] },
  ]),

  'software-architect': buildRoadmap('Software Architect', [
    { label: 'Programming Foundations', topics: ['Data Structures & Algorithms', 'OOP Principles', 'Functional Programming', 'Clean Code', 'SOLID Principles', 'DRY / KISS / YAGNI'] },
    { label: 'Design Patterns', topics: ['Creational (Factory, Singleton, Builder)', 'Structural (Adapter, Decorator, Proxy)', 'Behavioral (Observer, Strategy, Command)', 'Anti-Patterns', 'Refactoring Techniques', 'Pattern Selection'] },
    { label: 'Architectural Styles', topics: ['Monolith', 'Layered Architecture', 'Microservices', 'Event-Driven', 'Serverless', 'Hexagonal / Ports & Adapters'] },
    { label: 'Domain-Driven Design', topics: ['Bounded Contexts', 'Ubiquitous Language', 'Aggregates & Entities', 'Domain Events', 'Value Objects', 'Anti-Corruption Layer'] },
    { label: 'Distributed Systems', topics: ['CAP Theorem', 'Consistency Models', 'Event Sourcing & CQRS', 'Saga Pattern', 'Two-Phase Commit', 'Distributed Transactions'] },
    { label: 'System Design', topics: ['Load Balancing', 'Horizontal vs. Vertical Scaling', 'Caching (Redis/CDN)', 'Database Sharding & Replication', 'Message Queues', 'Rate Limiting & Throttling'] },
    { label: 'APIs & Integration', topics: ['REST API Design', 'gRPC', 'GraphQL', 'API Gateway', 'Service Mesh (Istio)', 'Event Streaming (Kafka)'] },
    { label: 'Security Architecture', topics: ['OAuth 2.0 & OIDC', 'Zero Trust', 'Encryption (at rest & in transit)', 'Secret Management', 'OWASP Top 10', 'Security Audits'] },
    { label: 'Cloud & Infrastructure', topics: ['AWS / GCP / Azure', 'Kubernetes Architecture', 'Terraform', 'Multi-Region Design', 'Cost Optimization', 'SLAs & SLOs'] },
    { label: 'Technical Leadership', topics: ['Architecture Decision Records (ADRs)', 'Tech Debt Management', 'Code Reviews at Scale', 'Engineering Roadmapping', 'Team Topologies', 'Stakeholder Communication'] },
  ]),
};

// ─── GENERATE FILES ───────────────────────────────────────────────────────────
for (const [slug, data] of Object.entries(techRoadmaps)) {
  const dir = join(rootDir, 'public', 'roadmaps', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug}.json`), JSON.stringify(data, null, 2));
  console.log(`✅ Generated: ${slug} (${data.nodes.length} nodes, ${data.edges.length} edges)`);
}

console.log('\n🚀 All 8 tech roadmaps rebuilt!');
