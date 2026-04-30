export const USER = { first: 'Romain', last: 'DEL FABRO', initials: 'RD' };

export const AGENTS = [
  { id: 'a1', badge: 'A1', title: 'Key Information and Activities Agent', desc: 'Extracts key dates, mandatory criteria, submission requirements, and pre-award activities.' },
  { id: 'a2', badge: 'A2', title: 'Technical Extraction Agent', desc: 'Maps technical architecture requirements to company capabilities.' },
  { id: 'a3', badge: 'A3', title: 'Risk Analysis Agent', desc: 'Identifies legal liabilities, operational constraints, and compliance risks. Requires Agent 2 to be selected first.' },
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

export const TOC_DETAILS = {
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

export const DRAFT_SECS = {
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

export const DEFAULT_DOC_AGENTS = {
  doc1: { a1: true, a2: true, a3: true },
  doc2: { a1: true, a2: true, a3: true },
};

export const INITIAL_TENDERS = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'CEA UP1 - simplification MA', client: 'CEA',        projectId: 'TRB-2026-041', modified: '23/03/2026', maxStepIdx: 1, lastStep: 'agents',   status: 'analysis_validated'    },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Navigator',                   client: 'Navigator',  projectId: 'TRB-2026-038', modified: '23/03/2026', maxStepIdx: 1, lastStep: 'agents',   status: 'analysis_in_progress'  },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'test',                        client: 'Sellafield', projectId: 'TRB-2026-031', modified: '11/03/2026', maxStepIdx: 1, lastStep: 'agents',   status: 'uploaded'              },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'CISF waste building',         client: 'NRWDI',      projectId: 'TRB-2026-022', modified: '11/02/2026', maxStepIdx: 3, lastStep: 'planning', status: 'planning_in_progress'  },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'ANDRA MS4',                   client: 'ANDRA',      projectId: 'TRB-2026-019', modified: '06/02/2026', maxStepIdx: 4, lastStep: 'drafting', status: 'proposal_ready'        },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'test',                        client: 'Iter',       projectId: 'TRB-2026-017', modified: '04/02/2026', maxStepIdx: 1, lastStep: 'agents',   status: 'analysis_validated'    },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'sdfsdf',                      client: 'Sener',      projectId: 'TRB-2026-014', modified: '28/01/2026', maxStepIdx: 4, lastStep: 'drafting', status: 'drafting_in_progress'  },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'TAQA Test 2',                 client: 'TAQA',       projectId: 'TRB-2025-098', modified: '15/12/2025', maxStepIdx: 1, lastStep: 'agents',   status: 'analysis_validated'    },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'FluxysZ4',                    client: 'Fluxys',     projectId: 'TRB-2025-091', modified: '04/12/2025', maxStepIdx: 0, lastStep: 'documents', status: 'uploaded'              },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Test',                        client: 'EDF',        projectId: 'TRB-2025-089', modified: '04/12/2025', maxStepIdx: 1, lastStep: 'agents',   status: 'analysis_in_progress'  },
];

export const DOC_PAGES = [
  { n: 1,  content: `<div style="font-size:11px;font-weight:700;color:#7E95A8;letter-spacing:.08em;margin-bottom:14px;text-align:center">APPEL D'OFFRES RESTREINT N° 2025-C-00150</div><h2 style="font-size:16px;font-weight:700;text-align:center;margin-bottom:8px">MARCHÉ DE PRESTATIONS INTELLECTUELLES</h2><h3 style="font-size:13px;font-weight:600;text-align:center;margin-bottom:16px;color:#4A6070">ÉTUDES ET DOSSIER SURETE – SIMPLIFICATION DE LA VENTILATION MA – UP1</h3><p>Lieu d'exécution : France (FR), site nucléaire de Marcoule. Direction des Opérations Nucléaires — CEA Marcoule.</p>` },
  { n: 2,  content: `<p>Le présent marché est conclu entre le <strong>COMMISSARIAT À L'ÉNERGIE ATOMIQUE ET AUX ÉNERGIES ALTERNATIVES (CEA)</strong>, établissement public à caractère industriel et commercial, représenté par son Administrateur Général, dont le siège social est situé au 25 rue Leblanc, 75015 Paris, ci-après dénommé « le Pouvoir Adjudicateur ».</p><br><p>Le titulaire du présent marché est une société spécialisée dans les études de sûreté nucléaire, sélectionnée à l'issue de la procédure d'appel d'offres restreint.</p>` },
  { n: 3,  content: `<p style="font-weight:600;margin-bottom:10px">Article 1 — Objet du marché</p><p>Le présent marché a pour objet la réalisation d'études et de dossiers de sûreté dans le cadre de la simplification de la ventilation des locaux MA sur le site UP1 de Marcoule.</p>` },
  { n: 4,  content: `<p style="font-weight:600;margin-bottom:10px">Article 2 — Calendrier</p><p>La date limite de remise des offres est fixée au <strong>15 avril 2024 à 17h00 (heure de Paris)</strong>.</p><br><ul style="margin-left:18px;line-height:2"><li>Lancement AO : 01/03/2024</li><li>Date limite Q&A : 22/03/2024</li><li>Remise des offres : 15/04/2024</li><li>Notification du marché : 10/05/2024</li></ul>` },
  { n: 5,  content: `<p style="font-weight:600;margin-bottom:10px">Article 3 — Contenu de l'offre</p><p>Les candidats devront fournir un dossier complet comprenant : une note méthodologique, un planning de réalisation avec jalons, les CV des intervenants clés, et une proposition financière détaillée.</p>` },
  { n: 6,  content: `<p style="font-weight:600;margin-bottom:10px">Article 4 — Durée du marché</p><p>La durée du marché est fixée à <strong>18 mois à compter de la notification</strong>, avec possibilité de prolongation de 6 mois sur décision du Pouvoir Adjudicateur.</p>` },
  { n: 7,  content: `<p style="font-weight:600;margin-bottom:10px">Article 5 — Confidentialité</p><p>Un accord de confidentialité (NDA) est requis avant toute communication d'informations sensibles relatives au projet. Ce document doit être signé et renvoyé au Pouvoir Adjudicateur <strong>avant la soumission de l'offre</strong>.</p>` },
  { n: 8,  content: `<p style="font-weight:600;margin-bottom:10px">Article 6 — Garanties</p><p>Le titulaire devra fournir une <strong>garantie de bonne exécution</strong> d'un montant équivalent à 10% du prix du marché dans un délai de 15 jours suivant la notification.</p>` },
  { n: 9,  content: `<p style="font-weight:600;margin-bottom:10px">Article 7 — Propriété intellectuelle</p><p>L'ensemble des livrables produits dans le cadre du présent marché sera la propriété exclusive du Pouvoir Adjudicateur.</p>` },
  { n: 10, content: `<p style="font-weight:600;margin-bottom:10px">Article 8 — Sous-traitance</p><p>La sous-traitance est autorisée dans la limite de 40% du montant total du marché.</p>` },
  { n: 11, content: `<p style="font-weight:600;margin-bottom:10px">Article 9 — Pénalités de retard</p><p>En cas de retard, des pénalités seront appliquées au taux de 0,5% du montant du marché par semaine de retard, plafonnées à 5%.</p>` },
  { n: 12, content: `<p style="font-weight:600;margin-bottom:10px">Article 10 — Modalités de paiement</p><p>Une avance de démarrage de <strong>10% du montant du marché</strong> pourra être accordée sur demande, sous réserve d'une garantie bancaire.</p>` },
  { n: 13, content: `<p style="font-weight:600;margin-bottom:10px">Article 11 — Facturation</p><p>Les factures seront établies conformément au planning de facturation joint en annexe. Le délai de paiement est de 30 jours à compter de la réception.</p>` },
  { n: 14, content: `<p style="font-weight:600;margin-bottom:10px">Article 12 — Retenue de garantie</p><p>Une retenue de garantie de <strong>5% du montant des prestations</strong> sera prélevée sur chaque acompte. Cette retenue sera libérée à la réception définitive.</p>` },
  { n: 15, content: `<p style="font-weight:600;margin-bottom:10px">Article 13 — Contacts</p><p>• <strong>Jérôme DUCOS</strong> — jerome.ducos@cea.fr — 04 66 39 78 73<br><em>Chargé de projet technique</em></p><br><p>• <strong>Yannis OUAKLI</strong> — yannis.ouakli@cea.fr — 04 66 39 71 77<br><em>Responsable administratif du marché</em></p>` },
  { n: 16, content: `<p style="font-weight:600;margin-bottom:10px">Article 14 — Résiliation pour convenance</p><p>Le Pouvoir Adjudicateur se réserve le droit de résilier le marché pour convenance, moyennant un préavis de <strong>30 jours calendaires</strong>.</p>` },
  { n: 17, content: `<p style="font-weight:600;margin-bottom:10px">Article 15 — Droit applicable</p><p>Le présent marché est soumis au droit français. Tout litige sera soumis aux tribunaux compétents du ressort de Paris.</p>` },
  { n: 18, content: `<p style="font-weight:600;margin-bottom:10px">Annexes</p><p>• Annexe A — Cahier des Charges Techniques</p><p>• Annexe B — Planning prévisionnel d'exécution</p><p>• Annexe C — Bordereau des prix unitaires</p><p>• Annexe D — Modèle de garantie bancaire</p><p>• Annexe E — Accord de confidentialité (NDA)</p>` },
];

export const A3_STATIC_DATA: Record<string, any[][]> = {
  'Project Risks': [
    ['risk_id', 'risk_description', 'category', 'requirements', 'risk_score'],
    ['R-001', 'Ambiguous or incomplete technical specifications may lead to scope disputes and costly rework during execution', 'Technical', '[{"req_id":"REQ-003","description":"Technical specification clarity and completeness","action":"Request written clarification from client before bid submission"},{"req_id":"REQ-017","description":"Scope of work definition and boundary conditions","action":"Define detailed scope boundary document as contract annex"}]', 'HIGH'],
    ['R-002', 'Currency exchange rate fluctuations may erode project margins, especially for multi-currency contracts', 'Financial', '[{"req_id":"REQ-028","description":"Currency risk coverage and hedging obligations","action":"Include currency adjustment clause or negotiate fixed-rate FX hedging"}]', 'MEDIUM'],
    ['R-003', 'Non-compliance with local environmental regulations may trigger fines, stop-work orders or reputational damage', 'Compliance', '[{"req_id":"REQ-042","description":"Environmental permits and impact assessment requirements","action":"Engage local environmental consultant before project start"},{"req_id":"REQ-043","description":"EIA compliance and mitigation plan","action":"Develop and submit Environmental Management Plan prior to mobilisation"}]', 'HIGH'],
    ['R-004', 'Critical subcontractors may be unavailable or fail to meet quality and schedule requirements', 'Operational', '[{"req_id":"REQ-055","description":"Subcontractor qualification and pre-approval process","action":"Pre-qualify at least two alternative subcontractors per critical scope"},{"req_id":"REQ-056","description":"Supply chain continuity and management plan","action":"Establish supply chain contingency plan with alternate suppliers"}]', 'MEDIUM'],
    ['R-005', 'Force majeure clauses may not cover all relevant events (pandemics, geopolitical events, strikes)', 'Legal', '[{"req_id":"REQ-071","description":"Force majeure definition and exclusion list","action":"Negotiate exhaustive list of qualifying events and relief entitlements"}]', 'MEDIUM'],
    ['R-006', 'Safety standards specified may not align with local legal codes, creating compliance gaps', 'HSE', '[{"req_id":"REQ-082","description":"HSE plan requirements and mandatory certifications","action":"Perform gap analysis between contract HSE requirements and local regulations"},{"req_id":"REQ-083","description":"Local safety code compliance and incident reporting","action":"Update site-specific HSE plan and train all personnel accordingly"}]', 'HIGH'],
    ['R-007', 'Intellectual property ownership over deliverables and developed tools may be disputed', 'Legal', '[{"req_id":"REQ-091","description":"IP rights transfer and background IP retention","action":"Negotiate foreground/background IP split and licensing terms in contract"}]', 'MEDIUM'],
    ['R-008', 'Permitting and regulatory approval delays by authorities may push back construction milestones', 'Regulatory', '[{"req_id":"REQ-104","description":"Permit timeline requirements and responsibility matrix","action":"Clarify permit responsibility; include float in schedule for regulatory delays"},{"req_id":"REQ-105","description":"Regulatory approval pathway and liaison plan","action":"Appoint regulatory affairs coordinator for liaison with authorities"}]', 'HIGH'],
    ['R-009', 'Cybersecurity vulnerabilities in SCADA, DCS or IT/OT systems may expose critical infrastructure', 'Technical', '[{"req_id":"REQ-112","description":"Cybersecurity standards and certification requirements","action":"Conduct cybersecurity assessment and align with IEC 62443 or equivalent"},{"req_id":"REQ-113","description":"SCADA and control system security requirements","action":"Implement network segmentation, access control and penetration testing"}]', 'HIGH'],
    ['R-010', 'High staff turnover during critical project phases may impact continuity and knowledge transfer', 'Operational', '[{"req_id":"REQ-124","description":"Key personnel retention and substitution approval","action":"Include key personnel lock-in clauses and require client approval for substitutions"}]', 'MEDIUM'],
    ['R-011', 'Significant escalation in raw material prices (steel, copper, concrete) may exceed project budget', 'Financial', '[{"req_id":"REQ-133","description":"Price escalation clause and index references","action":"Negotiate material price adjustment clause tied to published commodity indices"},{"req_id":"REQ-134","description":"Material procurement plan and sourcing strategy","action":"Secure fixed-price framework agreements with key suppliers"}]', 'MEDIUM'],
    ['R-012', 'Warranty duration and coverage terms may be insufficient to cover latent defects', 'Legal', '[{"req_id":"REQ-145","description":"Defects liability period and warranty scope","action":"Ensure warranty terms are limited and back-to-back with subcontractor warranties"}]', 'LOW'],
    ['R-013', 'Dispute resolution mechanism may be unfavourable (sole jurisdiction, short notice periods)', 'Legal', '[{"req_id":"REQ-156","description":"Dispute resolution process and arbitration clause","action":"Negotiate neutral arbitration venue (ICC/LCIA) with agreed governing law"}]', 'MEDIUM'],
    ['R-014', 'Grid connection or tie-in delays from TSO/DSO may block commissioning and handover', 'Operational', '[{"req_id":"REQ-167","description":"Grid connection timeline and client coordination obligations","action":"Include time-for-time delay relief if grid connection is client responsibility"},{"req_id":"REQ-168","description":"TSO/DSO coordination and interface management plan","action":"Establish joint interface management protocol with grid operator"}]', 'HIGH'],
    ['R-015', 'Performance guarantee shortfalls may trigger disproportionate liquidated damages with no cap', 'Financial', '[{"req_id":"REQ-178","description":"Performance guarantee thresholds and testing protocol","action":"Negotiate reasonable performance tolerance bands and test procedure acceptance"},{"req_id":"REQ-179","description":"Liquidated damages cap and aggregate liability limit","action":"Negotiate LD cap at 10–15% of contract value with overall liability limit"}]', 'HIGH'],
    ['R-016', 'Processing personal data without proper GDPR compliance may result in regulatory penalties', 'Compliance', '[{"req_id":"REQ-189","description":"Data protection and privacy obligations","action":"Conduct DPIA and ensure data processing agreements are in place with all parties"}]', 'MEDIUM'],
    ['R-017', 'Compressed testing and commissioning schedule may lead to incomplete validation and quality issues', 'Operational', '[{"req_id":"REQ-197","description":"Testing and commissioning schedule and resource requirements","action":"Flag schedule risk in bid clarifications and propose adequate T&C duration"},{"req_id":"REQ-198","description":"Acceptance criteria and punch list management","action":"Agree clear, objective acceptance criteria with provisional acceptance provisions"}]', 'MEDIUM'],
    ['R-018', 'Liquidated damages for delay may be uncapped, creating unlimited financial exposure', 'Legal', '[{"req_id":"REQ-205","description":"LD for delay — rate, cap, and sole remedy status","action":"Negotiate daily LD rate cap (max 10% of contract price) and sole-remedy clause"}]', 'MEDIUM'],
    ['R-019', 'Poorly defined change order process may lead to disputes over scope variations and associated costs', 'Operational', '[{"req_id":"REQ-214","description":"Variation and change management process","action":"Ensure change order process includes written approval, pricing, and schedule impact assessment"}]', 'LOW'],
    ['R-020', 'Third-party interference (neighbouring works, public access) may disrupt site operations', 'Operational', '[{"req_id":"REQ-223","description":"Site access control and security requirements","action":"Define exclusion zone and site access protocol in project execution plan"},{"req_id":"REQ-224","description":"Third-party coordination and stakeholder management","action":"Establish stakeholder communication plan and appoint dedicated community liaison"}]', 'LOW'],
  ],
};

// Legacy exports kept for backward compatibility
export const TOC_ROWS = STD_TOC.map(r => ({
  n: r.n,
  title: r.label,
  desc: TOC_DETAILS[r.n]?.desc || '',
  pages: r.pages || '',
  warn: !!r.warn,
}));

export const SRCS = [
  { id: '01', page: 14, q: '"...requires a minimum of 24 specialized personnel for Hub connectivity..."' },
  { id: '02', page: 82, q: '"...Phase 2 scheduling depends on seasonal thaw cycles..."' },
  { id: '03', page: 37, q: '"...equipment deployment subject to CE certification and EN 13000 compliance..."' },
];
