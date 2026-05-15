export const USER = { first: 'Romain', last: 'DEL FABRO', initials: 'RD' };

export const LANG_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'FR', label: 'French' },
  { value: 'NL', label: 'Dutch' },
  { value: 'DE', label: 'German' },
  { value: 'ES', label: 'Spanish' },
  { value: 'PT', label: 'Portuguese' },
];

export const PROJECT_SOURCES = [
  { key: 'salesforce', label: 'Salesforce', abbr: 'SF',  color: 'var(--nj-core-color-blue-700)',     bg: 'var(--nj-core-color-blue-100)',     border: 'var(--nj-core-color-blue-300)'     },
  { key: 'planisware', label: 'Planisware', abbr: 'PLW', color: 'var(--nj-core-color-purple-700)',   bg: 'var(--nj-core-color-purple-100)',   border: 'var(--nj-core-color-purple-300)'   },
  { key: 'temis',      label: 'Témis',      abbr: 'TMS', color: 'var(--nj-core-color-teal-700)',     bg: 'var(--nj-core-color-teal-100)',     border: 'var(--nj-core-color-teal-300)'     },
];

export const AGENTS = [
  { id: 'a1', badge: 'A1', title: 'Key Information and Activities Agent', desc: 'Extracts key tender facts, submission requirements, timelines, and pre-award activities.' },
  { id: 'a2', badge: 'A2', title: 'Technical Extraction Agent', desc: 'Extracts and structures technical requirements from the tender documents.' },
  { id: 'a3', badge: 'A3', title: 'Risk Analysis Agent', desc: 'Identifies technical, commercial, contractual, and delivery risks based on tender context and requirements.' },
];

export const NAV_SECS = [
  { id: '1.0', label: 'Executive Summary',                sub: false },
  { id: '2.0', label: 'Understanding of Requirements',    sub: false },
  { id: '2.1', label: 'Technical Scope',                  sub: true  },
  { id: '2.2', label: 'Regulatory & Safety',              sub: true  },
  { id: '3.0', label: 'Technical Approach & Methodology', sub: false },
  { id: '4.0', label: 'Relevant Experience',              sub: false },
  { id: '5.0', label: 'Project Organisation & Team',      sub: false },
  { id: '6.0', label: 'Schedule & Deliverables',          sub: false },
  { id: '7.0', label: 'Commercial Proposal',              sub: false },
];

export const STD_TOC = [
  { n: '1',   label: 'Executive Summary',                sub: false, pages: '2–3 p.' },
  { n: '2',   label: 'Understanding of Requirements',    sub: false, pages: '4–5 p.' },
  { n: '2.1', label: 'Technical Scope',                  sub: true,  pages: '2 p.' },
  { n: '2.2', label: 'Regulatory & Safety Requirements', sub: true,  pages: '2 p.' },
  { n: '3',   label: 'Technical Approach & Methodology', sub: false, pages: '6–8 p.' },
  { n: '4',   label: 'Relevant Experience & References', sub: false, pages: '3–4 p.', warn: true },
  { n: '5',   label: 'Project Organisation & Team',      sub: false, pages: '3 p.' },
  { n: '6',   label: 'Schedule & Deliverables',          sub: false, pages: '2–3 p.' },
  { n: '7',   label: 'Commercial Proposal',              sub: false, pages: '2 p.' },
];

export const TOC_DETAILS: Record<string, { desc: string; guide?: string; example?: string; note?: string }> = {
  '1':   { desc: 'Summarize company overview, key differentiators, key objectives of the proposal, and high-level solution overview.', guide: 'Summarize the company overview, the key differentiators, key objectives of the proposal, and high-level solution overview.', example: '[Company Name] is a leading provider of innovative engineering solutions. This proposal outlines our unique qualifications and approach to delivering…' },
  '2':   { desc: "Define scope of interpretation, outline technical challenges, and align with client's key objectives and expectations." },
  '2.1': { desc: 'Detail the project involve [drop details]. Key technical challenges include [challenge 1], [challenge 2]…', note: 'The project requires (page 15 of RFP…)' },
  '2.2': { desc: 'Summarize regulatory compliance requirements for safety standards and interpret safety measures…' },
  '3':   { desc: 'Describe proposed solution, methodology, key phases, and overall approach. Our approach will utilize a phased methodology including initial assessment, detailed design and testing…' },
  '4':   { desc: 'Highlight past projects, analogies, and lessons learned relevant to the current proposal. Completed [Project Name], similar in scope, overcoming [specific challenge]. Results: [measurable outcome]…' },
  '5':   { desc: 'Outline key personnel, roles, organizational chart, and team credentials. Our team includes [Name][Role], [Credential]. An org chart is provided on page 24…' },
  '6':   { desc: 'Detail the project milestone plan, key deliverables, and key assumptions where regarding to the RFP. Proposed pricing is outlined below, with terms and conditions, including…' },
  '7':   { desc: 'Detail pricing, any terms and conditions, and payment milestones according to the RFP. Proposed pricing is outlined below, with terms and conditions. Payments will be milestone based, including…' },
};

export const DRAFT_SECS: Record<string, { title: string }> = {
  '1.0': { title: 'Executive Summary' },
  '2.0': { title: 'Understanding of Requirements' },
  '2.1': { title: 'Technical Scope' },
  '2.2': { title: 'Regulatory & Safety' },
  '3.0': { title: 'Technical Approach & Methodology' },
  '4.0': { title: 'Relevant Experience' },
  '5.0': { title: 'Project Organisation & Team' },
  '6.0': { title: 'Schedule & Deliverables' },
  '7.0': { title: 'Commercial Proposal' },
};

export const DRAFTED_SECS = new Set(['1.0', '3.0']);

export const DEFAULT_DOCS = [
  { key: 'doc1', name: 'RFP_Section_A_Technical_Scope.pdf', size: '12.4 MB', ago: '2h ago' },
  { key: 'doc2', name: 'Draft_Contract_Agreement.docx',      size: '2.1 MB',  ago: '2h ago' },
];

export const DEFAULT_DOC_AGENTS: Record<string, { a1: boolean; a2: boolean; a3: boolean }> = {
  doc1: { a1: true, a2: true, a3: true },
  doc2: { a1: true, a2: true, a3: true },
};
