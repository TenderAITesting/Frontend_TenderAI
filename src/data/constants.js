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
  doc1: { a1: true,  a2: true,  a3: false },
  doc2: { a1: false, a2: false, a3: true  },
};

export const INITIAL_TENDERS = [
  { name: 'CEA UP1 - simplification MA', client: 'CEA',        projectId: 'TRB-2026-041', modified: '23/03/2026', maxStepIdx: 1, lastStep: 'agents', status: 'analysis_validated'   },
  { name: 'Navigator',                   client: 'Navigator',  projectId: 'TRB-2026-038', modified: '23/03/2026', maxStepIdx: 1, lastStep: 'agents', status: 'analysis_in_progress' },
  { name: 'test',                        client: 'Sellafield', projectId: 'TRB-2026-031', modified: '11/03/2026', maxStepIdx: 1, lastStep: 'agents', status: 'uploaded'             },
  { name: 'CISF waste building',         client: 'NRWDI',      projectId: 'TRB-2026-022', modified: '11/02/2026', maxStepIdx: 2, lastStep: 'planning', status: 'planning_in_progress'},
  { name: 'ANDRA MS4',                   client: 'ANDRA',      projectId: 'TRB-2026-019', modified: '06/02/2026', maxStepIdx: 3, lastStep: 'drafting', status: 'proposal_ready'      },
  { name: 'test',                        client: 'Iter',       projectId: 'TRB-2026-017', modified: '04/02/2026', maxStepIdx: 1, lastStep: 'agents', status: 'analysis_validated'   },
  { name: 'sdfsdf',                      client: 'Sener',      projectId: 'TRB-2026-014', modified: '28/01/2026', maxStepIdx: 3, lastStep: 'drafting', status: 'drafting_in_progress'},
  { name: 'TAQA Test 2',                 client: 'TAQA',       projectId: 'TRB-2025-098', modified: '15/12/2025', maxStepIdx: 1, lastStep: 'agents', status: 'analysis_validated'   },
  { name: 'FluxysZ4',                    client: 'Fluxys',     projectId: 'TRB-2025-091', modified: '04/12/2025', maxStepIdx: 0, lastStep: 'upload',  status: 'uploaded'             },
  { name: 'Test',                        client: 'EDF',        projectId: 'TRB-2025-089', modified: '04/12/2025', maxStepIdx: 1, lastStep: 'agents', status: 'analysis_in_progress' },
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
