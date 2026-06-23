import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Helper to build a node
let nodeIdCounter = 0;
function uid() {
  return `biz_node_${++nodeIdCounter}_${Math.random().toString(36).slice(2,8)}`;
}

const NODE_W = 240;
const NODE_H = 48;
const SUBTOPIC_W = 210;
const SUBTOPIC_H = 42;
const SECTION_W = 300;
const SECTION_H = 56;

function titleNode(id, label, x, y) {
  return { id, type: 'title', position: { x, y }, data: { label, style: { fontSize: 32, fontWeight: 900 } }, width: 360, height: 60, style: { width: 360, height: 60 }, zIndex: 999, dragging: false, focusable: true, measured: { width: 360, height: 60 } };
}
function sectionNode(id, label, x, y) {
  return { id, type: 'topic', position: { x, y }, data: { label, isSection: true, style: { fontSize: 17, borderColor: '#1e1e2e', borderWidth: '3px' } }, width: SECTION_W, height: SECTION_H, style: { width: SECTION_W, height: SECTION_H }, zIndex: 999, dragging: false, focusable: true, measured: { width: SECTION_W, height: SECTION_H } };
}
function topicNode(id, label, x, y, color = '#2D2622') {
  return { id, type: 'topic', position: { x, y }, data: { label, style: { fontSize: 15, borderColor: color } }, width: NODE_W, height: NODE_H, style: { width: NODE_W, height: NODE_H }, zIndex: 999, dragging: false, focusable: true, measured: { width: NODE_W, height: NODE_H } };
}
function subtopicNode(id, label, x, y) {
  return { id, type: 'subtopic', position: { x, y }, data: { label, style: { fontSize: 13 } }, width: SUBTOPIC_W, height: SUBTOPIC_H, style: { width: SUBTOPIC_W, height: SUBTOPIC_H }, zIndex: 999, dragging: false, focusable: true, measured: { width: SUBTOPIC_W, height: SUBTOPIC_H } };
}
function vline(id, x, y, h) {
  return { id, type: 'vertical', position: { x, y }, data: { label: 'vertical node', style: { stroke: '#2b78e4', strokeWidth: 3.5 } }, width: 4, height: h, style: { width: 4, height: h }, zIndex: 999, dragging: false, focusable: true, measured: { width: 4, height: h } };
}
function hline(id, x, y, w) {
  return { id, type: 'horizontal', position: { x, y }, data: { label: 'horizontal node', style: { stroke: '#2b78e4', strokeWidth: 3.5 } }, width: w, height: 4, style: { width: w, height: 4 }, zIndex: 999, dragging: false, focusable: true, measured: { width: w, height: 4 } };
}
function edge(id, source, target, dashed = false) {
  return {
    id,
    source,
    target,
    type: 'default',
    animated: dashed,
    style: { stroke: '#2b78e4', strokeWidth: 2.5, ...(dashed ? { strokeDasharray: '5 5' } : {}) },
    markerEnd: { type: 'arrowclosed', color: '#2b78e4' }
  };
}

// ─── ROADMAP DEFINITIONS ──────────────────────────────────────────────────────

const roadmaps = {

  // 1 ── MANAGEMENT CONSULTANT
  'management-consultant': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Management Consultant', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Business Fundamentals', topics: ['Micro & Macroeconomics', 'Accounting Basics', 'Business Models', 'Industry Analysis', 'Porter\'s Five Forces', 'Value Chain Analysis'] },
      { label: 'Problem Structuring', topics: ['MECE Principle', 'Issue Trees', 'Hypothesis-Driven Thinking', 'Framework Building', 'Root Cause Analysis', 'Synthesis & Storytelling'] },
      { label: 'Market Research', topics: ['Primary Research', 'Secondary Research', 'Market Sizing (TAM/SAM/SOM)', 'Competitor Benchmarking', 'Customer Segmentation', 'Survey Design'] },
      { label: 'Excel Modeling', topics: ['Excel Shortcuts & Speed', 'Financial Models', 'Sensitivity Analysis', 'Scenario Planning', 'Pivot Tables & VLOOKUP', 'Data Visualization in Excel'] },
      { label: 'Case Interview Prep', topics: ['Case Frameworks (BCG/McKinsey)', 'Profitability Cases', 'Market Entry Cases', 'M&A Cases', 'Growth Cases', 'Estimation Cases'] },
      { label: 'PowerPoint Communication', topics: ['Executive Slide Design', 'Pyramid Principle', 'Data Storytelling', 'Presenting to C-Suite', 'Slide Annotating', 'Deck Flow & Narrative'] },
      { label: 'Client Communication', topics: ['Stakeholder Management', 'Active Listening', 'Structured Emails', 'Workshop Facilitation', 'Negotiation Basics', 'Managing Up'] },
      { label: 'Business Strategy', topics: ['Corporate Strategy', 'Competitive Advantage', 'Blue Ocean Strategy', 'Disruptive Innovation', 'Growth Strategies', 'Digital Transformation'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 2 ── PRODUCT MANAGER
  'product-manager-biz': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Product Manager', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Customer Discovery', topics: ['User Interviews', 'Jobs-to-be-Done', 'Empathy Mapping', 'Pain Point Analysis', 'Persona Creation', 'Voice of Customer'] },
      { label: 'Product Thinking', topics: ['First Principles Thinking', 'Product Vision', 'Opportunity Sizing', 'Prioritization Frameworks', 'RICE Scoring', 'Feature vs. Outcome'] },
      { label: 'Wireframing & UX', topics: ['Figma Basics', 'Low-fidelity Wireframes', 'User Flows', 'Prototyping', 'Usability Testing', 'Design Handoff'] },
      { label: 'Product Metrics', topics: ['North Star Metric', 'DAU/MAU', 'Retention Curves', 'Conversion Rates', 'Funnel Metrics', 'Cohort Analysis'] },
      { label: 'Roadmapping', topics: ['Quarterly Planning', 'OKRs & KPIs', 'Now/Next/Later', 'Stakeholder Alignment', 'Release Planning', 'Backlog Grooming'] },
      { label: 'GTM Strategy', topics: ['Launch Planning', 'Positioning & Messaging', 'Beta Programs', 'Press & Content', 'Sales Enablement', 'Post-Launch Analysis'] },
      { label: 'Product Analytics', topics: ['Mixpanel / Amplitude', 'SQL for PMs', 'A/B Testing', 'Segmentation Analysis', 'Drop-off Analysis', 'Feature Adoption'] },
      { label: 'Working with Engineers', topics: ['Writing PRDs', 'Sprint Planning', 'Agile / Scrum', 'Technical Debt Trade-offs', 'API Basics for PMs', 'Data Infra Basics'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 3 ── MARKETING MANAGER
  'marketing-manager': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Marketing Manager', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Consumer Psychology', topics: ['Cognitive Biases', 'Emotional Triggers', 'Behavioral Economics', 'Decision Making', 'Trust & Credibility', 'Loss Aversion'] },
      { label: 'Brand Strategy', topics: ['Brand Identity', 'Positioning Statement', 'Target Audience', 'Brand Voice & Tone', 'Visual Identity', 'Brand Equity'] },
      { label: 'Content Marketing', topics: ['Content Strategy', 'Blogging & SEO Writing', 'Video Marketing', 'Podcast Marketing', 'Email Newsletters', 'Content Calendar'] },
      { label: 'SEO', topics: ['On-Page SEO', 'Keyword Research', 'Technical SEO', 'Link Building', 'SEO Audit', 'Google Analytics / GSC'] },
      { label: 'Paid Advertising', topics: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Campaign Structure', 'Creative Testing', 'Budget Allocation'] },
      { label: 'Performance Marketing', topics: ['CPA & ROAS', 'Attribution Modeling', 'Retargeting', 'Landing Page Optimization', 'Conversion Rate Optimization', 'Marketing Mix Modeling'] },
      { label: 'Marketing Analytics', topics: ['Marketing Funnels', 'UTM Parameters', 'GA4 & Dashboards', 'Cohort Analysis', 'Customer LTV', 'CAC Payback Period'] },
      { label: 'Growth & Campaigns', topics: ['Campaign Planning', 'Multi-Channel Strategy', 'Influencer Marketing', 'PR & Communications', 'Event Marketing', 'Co-Marketing Partnerships'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 4 ── GROWTH MANAGER
  'growth-manager': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Growth Manager', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Growth Fundamentals', topics: ['Growth Mindset', 'The Growth Loop', 'Pirate Metrics (AARRR)', 'Product-Market Fit', 'Experimentation Culture', 'North Star Framework'] },
      { label: 'User Acquisition', topics: ['Paid Channels', 'Organic Channels', 'Referral Programs', 'Partnership Channels', 'App Store Optimization', 'Influencer & Affiliate'] },
      { label: 'Growth Loops', topics: ['Viral Loops', 'Content Loops', 'Marketplace Loops', 'Network Effects', 'Social Sharing', 'Embedding Loops'] },
      { label: 'Retention', topics: ['Onboarding Optimization', 'Habit Formation', 'Push Notifications', 'Email Sequences', 'Churn Analysis', 'Win-Back Campaigns'] },
      { label: 'A/B Testing & Experiments', topics: ['Hypothesis Formation', 'Statistical Significance', 'Test Design', 'Multivariate Testing', 'Interpreting Results', 'Experiment Velocity'] },
      { label: 'Funnel Analysis', topics: ['Funnel Visualization', 'Drop-off Points', 'Segment-Level Funnels', 'Micro-Conversion Optimization', 'Friction Reduction', 'Checkout Optimization'] },
      { label: 'Product-Led Growth', topics: ['Freemium Models', 'Self-Serve Onboarding', 'In-App Upsell', 'Usage-Based Pricing', 'Time-to-Value (TTV)', 'Expansion Revenue'] },
      { label: 'Data & Analytics', topics: ['SQL for Growth', 'Mixpanel / Amplitude', 'Cohort Analysis', 'LTV Modeling', 'Attribution', 'Growth Dashboards'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 5 ── BUSINESS ANALYST
  'business-analyst': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Business Analyst', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Excel Mastery', topics: ['Formulas & Functions', 'Pivot Tables', 'VLOOKUP & INDEX-MATCH', 'Power Query', 'Conditional Formatting', 'Excel Dashboards'] },
      { label: 'SQL for Analysis', topics: ['SELECT & Filtering', 'JOINs', 'Aggregations & GROUP BY', 'Subqueries & CTEs', 'Window Functions', 'SQL for Business Metrics'] },
      { label: 'Data Visualization', topics: ['Chart Selection', 'Tableau Basics', 'Power BI', 'Google Looker Studio', 'Storytelling with Data', 'Dashboard Best Practices'] },
      { label: 'Business Metrics', topics: ['Revenue & Cost Analysis', 'Profitability Metrics', 'Unit Economics', 'Customer Metrics (LTV, CAC)', 'Operational KPIs', 'Financial Ratios'] },
      { label: 'Reporting & Dashboards', topics: ['Executive Reporting', 'Weekly/Monthly Reports', 'Automated Reporting', 'Alert Systems', 'Self-Serve Analytics', 'Report Design'] },
      { label: 'Problem Solving', topics: ['Defining the Problem', 'Hypothesis Testing', 'Root Cause Analysis', 'Decision Frameworks', 'Presenting Insights', 'Recommendation Writing'] },
      { label: 'Process & Requirements', topics: ['Business Requirements Docs', 'Process Mapping', 'BPMN Basics', 'Gap Analysis', 'Stakeholder Interviews', 'Use Cases & User Stories'] },
      { label: 'Python for Analysis', topics: ['Python Basics', 'Pandas', 'Data Cleaning', 'Exploratory Data Analysis', 'Matplotlib / Seaborn', 'Jupyter Notebooks'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 6 ── INVESTMENT BANKER
  'investment-banker': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Investment Banker', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Financial Statements', topics: ['Income Statement', 'Balance Sheet', 'Cash Flow Statement', '3-Statement Linkage', 'Common-Size Analysis', 'Financial Ratios'] },
      { label: 'Corporate Finance', topics: ['Time Value of Money', 'Cost of Capital (WACC)', 'Capital Structure', 'Dividend Policy', 'Working Capital', 'Capital Budgeting'] },
      { label: 'Valuation Methods', topics: ['Comparable Company Analysis', 'Precedent Transactions', 'DCF Analysis', 'LBO Analysis', 'Sum-of-the-Parts', 'Asset-Based Valuation'] },
      { label: 'DCF Modeling', topics: ['Revenue Projections', 'EBITDA Margins', 'Free Cash Flow', 'Terminal Value', 'Discount Rate', 'Sensitivity Tables'] },
      { label: 'M&A Fundamentals', topics: ['Deal Structures', 'Buy-Side vs. Sell-Side', 'Synergies Analysis', 'Accretion / Dilution', 'Due Diligence', 'Transaction Process'] },
      { label: 'Financial Modeling', topics: ['Excel for Finance', 'Integrated 3-Statement Model', 'M&A Model', 'LBO Model', 'Model Best Practices', 'Error Checking'] },
      { label: 'Capital Markets', topics: ['IPO Process', 'Equity Offerings', 'Debt Offerings', 'Bond Valuation', 'Credit Analysis', 'Capital Raise Process'] },
      { label: 'IB Career Skills', topics: ['Pitch Books', 'Teaser & CIM', 'Confidentiality Agreement (NDA)', 'Client Communication', 'Due Diligence Management', 'Deal Closing'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 7 ── EQUITY RESEARCH ANALYST
  'equity-research-analyst': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Equity Research Analyst', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Stock Markets Basics', topics: ['How Stock Markets Work', 'Market Participants', 'Exchanges & Brokers', 'Bull vs. Bear Markets', 'Market Indices', 'Stock Screeners'] },
      { label: 'Financial Statements', topics: ['Reading Annual Reports', 'Income Statement Deep Dive', 'Balance Sheet Analysis', 'Cash Flow Statement', 'Footnotes & MD&A', 'GAAP vs. non-GAAP'] },
      { label: 'Valuation', topics: ['P/E, P/B, P/S Ratios', 'EV/EBITDA', 'DCF Analysis', 'Residual Income Model', 'Dividend Discount Model', 'Sum-of-the-Parts'] },
      { label: 'Industry Research', topics: ['Industry Structure Analysis', 'Competitive Landscape', 'Regulatory Environment', 'Market Size & Growth', 'Key Industry Drivers', 'Sector Rotation'] },
      { label: 'Investment Thesis', topics: ['Bull vs. Bear Case', 'Catalysts & Risks', 'Variant Perception', 'Moat Analysis', 'Management Assessment', 'ESG Considerations'] },
      { label: 'Research Reports', topics: ['Initiating Coverage Report', 'Earnings Updates', 'Target Price Models', 'Recommendation (Buy/Hold/Sell)', 'Note Writing', 'Executive Summary'] },
      { label: 'Financial Modeling', topics: ['Excel for Equity Research', 'Three-Statement Model', 'Sensitivity Analysis', 'Scenario Analysis', 'Comparable Company Tables', 'Football Field Chart'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 8 ── VENTURE CAPITAL ANALYST
  'venture-capital-analyst': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Venture Capital Analyst', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Startup Ecosystem', topics: ['VC Fund Structure', 'Stages (Pre-seed to Series C)', 'Startup Lifecycle', 'Key VC Terms', 'VC vs. Angel vs. PE', 'Startup Hubs'] },
      { label: 'Deal Sourcing', topics: ['Network Building', 'Cold Outreach', 'Inbound Pipelines', 'Demo Days', 'Accelerator Partnerships', 'Proprietary Dealflow'] },
      { label: 'Due Diligence', topics: ['Market Assessment', 'Team Evaluation', 'Product/Tech Assessment', 'Financial Due Diligence', 'Reference Checks', 'Legal DD'] },
      { label: 'Startup Evaluation', topics: ['Team-Market Fit', 'Product-Market Fit', 'Competitive Moat', 'Business Model Analysis', 'Revenue Quality', 'Burn Rate & Runway'] },
      { label: 'Cap Tables & Term Sheets', topics: ['Cap Table Basics', 'Pre-Money vs. Post-Money', 'Dilution', 'Preferred vs. Common Stock', 'Pro-Rata Rights', 'Term Sheet Negotiation'] },
      { label: 'Fund Economics', topics: ['Fund Structure (GP/LP)', '2 and 20 Model', 'Carried Interest', 'Portfolio Construction', 'DPI & TVPI', 'Mark-to-Market'] },
      { label: 'Portfolio Support', topics: ['Board Membership', 'Hiring Help', 'Intro Networks', 'Follow-on Decisions', 'Strategic Guidance', 'Runway Extension'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 9 ── PRIVATE EQUITY ANALYST
  'private-equity-analyst': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Private Equity Analyst', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Private Equity Fundamentals', topics: ['PE Fund Structure', 'Investment Lifecycle', 'Buy-out vs. Growth Equity', 'PE vs. VC vs. Hedge Fund', 'Key PE Terms', 'Fund Return Metrics'] },
      { label: 'Financial Modeling', topics: ['Integrated 3-Statement Model', 'Debt Schedule', 'Free Cash Flow Build', 'Returns Analysis', 'Sensitivity Tables', 'Model Audit Skills'] },
      { label: 'LBO Modeling', topics: ['LBO Structure', 'Sources & Uses', 'Debt Tranches', 'Interest Expense & PIK', 'Exit Assumptions', 'IRR & Cash-on-Cash Returns'] },
      { label: 'Due Diligence', topics: ['Management Interviews', 'Commercial DD', 'Financial Quality of Earnings', 'Legal & Tax DD', 'IT & Cyber Diligence', 'ESG DD'] },
      { label: 'Deal Structuring', topics: ['Equity vs. Debt Mix', 'Covenants', 'Management Incentive Plans', 'Ratchets', 'Warranty & Indemnity Insurance', 'SPA Negotiation'] },
      { label: 'Portfolio Operations', topics: ['100-Day Plan', 'Value Creation Plan', 'Cost Optimization', 'Revenue Enhancement', 'Add-on Acquisitions', 'Exit Preparation'] },
      { label: 'Exit Strategies', topics: ['Strategic Sale', 'Secondary Buyout', 'IPO Process', 'Dividend Recap', 'Partial Exit', 'Timing the Exit'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 10 ── CORPORATE STRATEGY MANAGER
  'corporate-strategy-manager': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Corporate Strategy Manager', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Strategy Fundamentals', topics: ['What is Strategy?', 'Vision, Mission & Values', 'Strategic Planning Process', 'SWOT Analysis', 'Ansoff Matrix', 'Strategy Execution'] },
      { label: 'Competitive Analysis', topics: ['Porter\'s Five Forces', 'Competitive Benchmarking', 'Competitive Intelligence', 'PEST Analysis', 'Disruption Mapping', 'Strategic Groups'] },
      { label: 'Market Sizing', topics: ['TAM/SAM/SOM', 'Top-Down Sizing', 'Bottom-Up Sizing', 'Addressable Market Validation', 'Growth Rate Estimation', 'Prioritization of Markets'] },
      { label: 'Strategic Planning', topics: ['Long-Range Planning (3-5yr)', 'Annual Operating Plan', 'OKR Setting', 'Resource Allocation', 'Strategy Cascading', 'Scenario Planning'] },
      { label: 'Mergers & Acquisitions', topics: ['M&A Rationale', 'Target Identification', 'Synergy Assessment', 'Integration Planning', 'PMI (Post-Merger Integration)', 'Cultural Integration'] },
      { label: 'Business Expansion', topics: ['New Market Entry', 'Geographic Expansion', 'New Product Lines', 'Joint Ventures', 'Franchising & Licensing', 'Build vs. Buy vs. Partner'] },
      { label: 'Stakeholder Management', topics: ['Board Reporting', 'C-Suite Communication', 'Cross-Functional Alignment', 'Managing Up', 'Influencing Without Authority', 'Executive Storytelling'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 11 ── STARTUP FOUNDER
  'startup-founder': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Startup Founder', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Idea Validation', topics: ['Problem Discovery', 'Customer Interviews', 'Competitive Landscape', 'Unique Value Proposition', 'Willingness to Pay', 'Early Validation Techniques'] },
      { label: 'MVP Building', topics: ['Concierge MVP', 'Landing Page MVP', 'Defining MVP Scope', 'Build-Measure-Learn', 'Dogfooding', 'User Onboarding'] },
      { label: 'Business Model', topics: ['Revenue Model Design', 'Unit Economics', 'Pricing Strategy', 'Monetization Models', 'Path to Profitability', 'B2B vs. B2C Models'] },
      { label: 'Fundraising', topics: ['Bootstrapping vs. VC', 'Pitch Deck Creation', 'Valuation Basics', 'Investor Targeting', 'Due Diligence Readiness', 'Term Sheet Basics'] },
      { label: 'Sales & Customer Growth', topics: ['Founder-Led Sales', 'B2B Sales Process', 'Demo Mastery', 'Sales Pipeline', 'Customer Success', 'Referrals & Word of Mouth'] },
      { label: 'Team Building', topics: ['First Hires', 'Culture Setting', 'Co-Founder Agreement', 'Equity Splits', 'Firing Mistakes Early', 'Remote Team Management'] },
      { label: 'Scaling', topics: ['Hiring for Scale', 'Process Documentation', 'OKRs & Company Goals', 'Delegation Frameworks', 'Leadership Transition', 'Board Management'] },
      { label: 'Legal & Finance', topics: ['Company Incorporation', 'Cap Table Management', 'IP Protection', 'Contracts & NDAs', 'Finance & Accounting Basics', 'Regulatory Compliance'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 12 ── CHIEF OF STAFF
  'chief-of-staff': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Chief of Staff', cx - 180, y)); y += 100;

    const sections = [
      { label: 'Strategic Planning', topics: ['Annual Operating Plan', 'Priority Setting', 'OKR Design & Tracking', 'Strategic Projects', 'Board Deck Preparation', 'Long-Range Planning'] },
      { label: 'Project Management', topics: ['Project Planning', 'Timeline & Milestones', 'Cross-Team Coordination', 'Risk Management', 'Status Reporting', 'Retrospectives'] },
      { label: 'Founder Office Operations', topics: ['CEO Schedule Optimization', 'Meeting Cadence Design', 'Internal Communications', 'Email & Inbox Management', 'Decision Logs', 'Special Projects'] },
      { label: 'Communication', topics: ['Executive Communication', 'Town Halls & All-Hands', 'Writing for Leadership', 'Structured Thinking', 'Conflict Resolution', 'Influencing Stakeholders'] },
      { label: 'Data & Reporting', topics: ['Company Metrics Dashboard', 'Investor Reporting', 'Board Reporting', 'Weekly Business Reviews', 'Variance Analysis', 'Narrative Reporting'] },
      { label: 'Hiring & People Ops', topics: ['Org Design', 'Hiring Process Management', 'Onboarding Frameworks', 'Performance Reviews', 'Compensation Benchmarking', 'Culture Initiatives'] },
      { label: 'Finance Basics', topics: ['Budget Management', 'Headcount Planning', 'Vendor Negotiations', 'Cost Center Management', 'Financial Forecasting', 'Spend Optimization'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },

  // 13 ── BUSINESS DEVELOPMENT MANAGER
  'business-development-manager': () => {
    const nodes = [], edges = [];
    let y = 0;
    const cx = 400;

    const title = uid(); nodes.push(titleNode(title, 'Business Development Manager', cx - 180, y)); y += 100;

    const sections = [
      { label: 'BD Fundamentals', topics: ['Sales vs. BD Difference', 'BD Strategy', 'Identifying Opportunities', 'Market Mapping', 'Win/Loss Analysis', 'Commercial Acumen'] },
      { label: 'Lead Generation', topics: ['ICP Definition', 'Outbound Prospecting', 'Inbound Lead Capture', 'LinkedIn Outreach', 'Cold Email Craft', 'Lead Scoring & Qualification'] },
      { label: 'B2B Sales', topics: ['Discovery Call Mastery', 'SPIN Selling', 'Solution Selling', 'Demo & Proposal', 'Objection Handling', 'Closing Techniques'] },
      { label: 'Partnerships', topics: ['Partnership Strategy', 'Partner Identification', 'Outreach & Pitching', 'Deal Structuring', 'Partner Enablement', 'Co-Marketing Execution'] },
      { label: 'Negotiation', topics: ['BATNA & Leverage', 'Anchoring', 'Trade-off Management', 'Win-Win Frameworks', 'Contract Negotiation', 'Price Negotiation Tactics'] },
      { label: 'Revenue Growth', topics: ['Pipeline Management', 'CRM (Salesforce/HubSpot)', 'Sales Forecasting', 'Account Expansion (Upsell)', 'Cross-Sell Strategy', 'Revenue Operations'] },
      { label: 'Relationship Building', topics: ['Stakeholder Mapping', 'Executive Relationship Management', 'Networking Strategy', 'Building Trust', 'Follow-up Systems', 'Long-Term Account Management'] },
    ];

    let prevSecId = null;
    for (const sec of sections) {
      const secId = uid();
      nodes.push(sectionNode(secId, sec.label, cx - SECTION_W / 2, y));
      if (prevSecId) edges.push(edge(uid(), prevSecId, secId));
      prevSecId = secId;
      y += SECTION_H + 20;

      let tx = cx - ((sec.topics.length * (NODE_W + 20)) / 2) + 10;
      const topicY = y;
      for (const t of sec.topics) {
        const tid = uid();
        nodes.push(topicNode(tid, t, tx, topicY));
        edges.push(edge(uid(), secId, tid, true));
        tx += NODE_W + 20;
      }
      y += NODE_H + 80;
    }
    return { nodes, edges };
  },
};

// ─── GENERATE FILES ───────────────────────────────────────────────────────────
for (const [slug, builder] of Object.entries(roadmaps)) {
  const dir = join(rootDir, 'public', 'roadmaps', slug);
  mkdirSync(dir, { recursive: true });
  const data = builder();
  writeFileSync(join(dir, `${slug}.json`), JSON.stringify(data, null, 2));
  console.log(`✅ Generated: ${slug} (${data.nodes.length} nodes, ${data.edges.length} edges)`);
}

console.log('\n🎉 All 13 business roadmaps generated!');
