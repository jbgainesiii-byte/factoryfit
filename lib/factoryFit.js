export const storageKey = "factory-fit:next-mvp:v2";

export const formSteps = [
  "Brand Basics",
  "Product Details",
  "Production Clarity",
  "Budget",
  "Timeline",
  "Readiness",
  "Biggest Concern",
  "Context",
];

export const options = {
  launchedBefore: ["Yes", "No", "I have sold merch before", "I am still in concept stage"],
  productType: ["T-shirt", "Hoodie", "Sweatsuit", "Hat", "Full capsule drop", "Custom cut-and-sew garment", "Blanks with decoration", "Other"],
  styleCount: ["1", "2-3", "4-6", "7+"],
  units: ["Under 25", "25-50", "51-100", "101-300", "300+", "Not sure"],
  mockups: ["Yes", "No", "In progress"],
  techPack: ["Yes", "No", "I do not know what that is"],
  references: ["Yes", "No"],
  measurements: ["Yes", "No", "Partially"],
  needType: [
    "I want blank garments printed or embroidered",
    "I want private-label blanks with my branding",
    "I want a custom cut-and-sew garment",
    "I need a sample first",
    "I need someone to handle everything",
    "I do not know",
  ],
  budget: ["Under $500", "$500-$1,500", "$1,500-$3,000", "$3,000-$7,500", "$7,500+", "Not sure"],
  sampleBudget: ["Under $100", "$100-$300", "$300-$750", "$750+", "Not sure"],
  deposit: ["Yes", "No", "Not sure"],
  sampleTimeline: ["ASAP", "Within 30 days", "1-3 months", "3+ months", "Not sure"],
  productTimeline: ["Within 30 days", "1-3 months", "3-6 months", "No hard deadline"],
  launchDate: ["Yes", "No"],
  concern: [
    "Getting scammed",
    "Wasting money on samples",
    "Manufacturers not replying",
    "Ordering too much inventory",
    "Poor quality",
    "Not knowing what to ask",
    "Choosing the wrong supplier",
    "Not knowing if I am ready",
    "Not knowing what this should cost",
  ],
};

export const assets = [
  "Logo",
  "Product mockups",
  "Product sketches",
  "Reference garments",
  "Size chart",
  "Tech pack",
  "Fabric direction",
  "Decoration method",
  "Packaging idea",
  "Label/neck tag direction",
  "Budget range",
  "Quantity target",
  "Launch plan",
];

export const initialIntake = {
  founderName: "",
  email: "",
  brandName: "",
  brandUrl: "",
  location: "",
  launchedBefore: "",
  productType: "",
  styleCount: "",
  units: "",
  mockups: "",
  techPack: "",
  references: "",
  measurements: "",
  needType: "",
  budget: "",
  sampleBudget: "",
  deposit: "",
  sampleTimeline: "",
  productTimeline: "",
  launchDate: "",
  assets: [],
  concern: "",
  consultantHelp: "",
  valuable: "",
  useless: "",
};

export const demoIntake = {
  founderName: "Javon",
  email: "founder@example.com",
  brandName: "First Drop Studio",
  brandUrl: "@firstdrop",
  location: "Detroit, MI",
  launchedBefore: "No",
  productType: "Hoodie",
  styleCount: "1",
  units: "25-50",
  mockups: "Yes",
  techPack: "No",
  references: "Yes",
  measurements: "Partially",
  needType: "I want private-label blanks with my branding",
  budget: "$1,500-$3,000",
  sampleBudget: "$100-$300",
  deposit: "Not sure",
  sampleTimeline: "Within 30 days",
  productTimeline: "1-3 months",
  launchDate: "No",
  assets: ["Logo", "Product mockups", "Reference garments", "Packaging idea", "Label/neck tag direction", "Budget range", "Quantity target"],
  concern: "Choosing the wrong supplier",
  consultantHelp: "I wanted to understand what kind of supplier to contact and what this should cost.",
  valuable: "A clear next step, outreach script, and red flags.",
  useless: "A generic list without explaining what kind of supplier I need.",
};

export const supplierTypes = {
  blank: ["Blank supplier", "Sells ready-made garments that you can decorate or relabel. Useful when you need speed, lower risk, and small validation runs."],
  decorator: ["Decorator", "Adds screen printing, embroidery, heat transfer, patches, or other decoration to blanks. Often the best first stop for merch-style drops."],
  privateLabel: ["Private-label supplier", "Offers existing garments with brand-facing changes such as labels, neck tags, hang tags, packaging, and sometimes limited material choices."],
  cutSew: ["Cut-and-sew factory", "Builds garments from patterns, fabric, trims, and construction specs. Best when fit, fabric, and silhouette need to be custom."],
  sampleRoom: ["Sample room", "Helps develop a custom sample before production. Useful when the idea is real but the tech pack, pattern, or fit still needs work."],
  fullPackage: ["Full-package manufacturer", "Can support development, sourcing, samples, and production. Usually needs stronger budget, specs, and timeline discipline."],
  sourcingAgent: ["Sourcing agent", "Helps identify, vet, and coordinate supplier options. Helpful when the path is complex, but not a substitute for clear product direction."],
};

export const pathVisuals = {
  "Blanks + Decoration": {
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=80",
    alt: "Folded blank apparel and garment textures",
  },
  "Premium Blanks + Relabeling": {
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=80",
    alt: "Premium apparel details and brand finishing",
  },
  "Private Label": {
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=80",
    alt: "Apparel rack with neutral garments",
  },
  "Cut-and-Sew": {
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    alt: "Fabric and garment development workspace",
  },
  "Sample Room First": {
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1400&q=80",
    alt: "Apparel design and sample development table",
  },
  "Not Production-Ready Yet": {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
    alt: "Early apparel concept and planning workspace",
  },
};

export function diagnose(intake) {
  const customIntent = includesAny([intake.productType, intake.needType], ["cut-and-sew", "custom"]);
  const blanksIntent = includesAny([intake.productType, intake.needType], ["blank", "printed", "embroidered"]);
  const privateIntent = includesAny([intake.needType], ["private-label", "branding"]);
  const lowBudget = intake.budget === "Under $500" || intake.budget === "Not sure";
  const moderateBudget = ["$1,500-$3,000", "$3,000-$7,500"].includes(intake.budget);
  const lowQuantity = ["Under 25", "25-50"].includes(intake.units);
  const hasSpecs = intake.techPack === "Yes" || intake.measurements === "Yes";
  const weakClarity = intake.productType === "Other" || intake.units === "Not sure" || intake.needType === "I do not know";
  const unrealisticCustom = customIntent && (lowBudget || lowQuantity || intake.sampleTimeline === "ASAP");

  let path = "Blanks + Decoration";
  if (weakClarity && lowBudget) path = "Not Production-Ready Yet";
  else if (unrealisticCustom && !hasSpecs) path = "Not Production-Ready Yet";
  else if (customIntent && !hasSpecs) path = "Sample Room First";
  else if (customIntent && hasSpecs && !lowBudget) path = "Cut-and-Sew";
  else if (privateIntent && ["51-100", "101-300", "300+"].includes(intake.units) && moderateBudget) path = "Private Label";
  else if (privateIntent) path = "Premium Blanks + Relabeling";
  else if (intake.needType === "I need a sample first" && !hasSpecs) path = "Sample Room First";
  else if (blanksIntent || lowQuantity || lowBudget) path = "Blanks + Decoration";

  const scores = scoreIntake(intake, path);
  const score = Object.values(scores).reduce((sum, item) => sum + item.points, 0);
  return {
    path,
    score,
    scoreLabel: scoreLabel(score),
    scores,
    avoid: avoidPath(path),
    confidence: confidence(score, intake),
    costReality: costReality(path),
    interpretation: interpretation(path, intake),
    likelyMistake: likelyMistake(path, intake),
    missing: missingChecklist(intake, path),
    nextMove: nextMove(path),
    supplierKeys: supplierKeys(path),
    criteria: searchCriteria(path, intake),
    outreach: outreachScript(intake, path),
    questions: supplierQuestions(path),
    redFlags: redFlags(path),
    plan: actionPlan(path, intake),
  };
}

function confidence(score, intake) {
  const answerCount = Object.entries(intake).filter(([key, value]) => key !== "assets" && Boolean(value)).length;
  if (score >= 75 && answerCount >= 18) return "High";
  if (score >= 55 && answerCount >= 14) return "Medium";
  return "Directional";
}

function costReality(path) {
  return {
    "Blanks + Decoration": {
      range: "$300-$2,500",
      note: "Most realistic when you are testing decorated blanks, small quantities, or print-on-demand before holding inventory.",
    },
    "Premium Blanks + Relabeling": {
      range: "$1,000-$5,000",
      note: "Expect extra costs for better blank bodies, labels, neck tags, packaging, decoration samples, and minimums from decorators.",
    },
    "Private Label": {
      range: "$3,000-$10,000+",
      note: "Budget depends on minimums, garment category, branding changes, sample fees, and whether one supplier handles finishing.",
    },
    "Cut-and-Sew": {
      range: "$7,500-$25,000+",
      note: "Custom development usually includes tech packs, patterns, grading, fabric, trims, samples, revisions, and higher production minimums.",
    },
    "Sample Room First": {
      range: "$500-$3,500+ before production",
      note: "This budget is for development work: pattern, sample, revisions, fit notes, and technical files before bulk production.",
    },
    "Not Production-Ready Yet": {
      range: "$0-$750 prep phase",
      note: "Spend lightly on mockups, references, blank tests, and technical clarity before paying for samples or production.",
    },
  }[path];
}

function likelyMistake(path, intake) {
  if (path === "Cut-and-Sew") return "The mistake to avoid is contacting factories with vague inspiration and no production-ready packet. Your advantage is specificity.";
  if (path === "Sample Room First") return "The mistake to avoid is asking for bulk production pricing before the sample and technical direction are developed.";
  if (path === "Not Production-Ready Yet") return "The mistake to avoid is buying access to supplier names before your product, budget, quantity, and references are clear.";
  if (path === "Private Label") return "The mistake to avoid is treating private label like fully custom manufacturing. You are customizing an existing garment system.";
  if (path === "Premium Blanks + Relabeling") return "The mistake to avoid is overpaying for custom cut-and-sew when your first proof point can come from better blanks, finishing, and packaging.";
  return `The mistake to avoid is asking for a manufacturer when your ${intake.productType || "first product"} probably needs a blank supplier plus a decorator.`;
}

function nextMove(path) {
  return {
    "Blanks + Decoration": "Pick two blank bodies, choose one decoration method, and request decorated sample pricing from three decorators.",
    "Premium Blanks + Relabeling": "Choose a premium blank direction, define label/packaging requirements, and ask suppliers which finishing services they can handle.",
    "Private Label": "Shortlist private-label suppliers by category and minimums, then ask what brand customization is included versus extra.",
    "Cut-and-Sew": "Prepare a tech pack, reference garments, target size range, and sample budget before contacting cut-and-sew factories.",
    "Sample Room First": "Find a sample room or technical designer and turn your concept into a sample, spec, and quoteable production packet.",
    "Not Production-Ready Yet": "Do a seven-day prep sprint: product mockup, quantity target, budget ceiling, references, and a simple launch test.",
  }[path];
}

function scoreIntake(intake, path) {
  const assetSet = new Set(intake.assets || []);
  const clarity = [intake.productType, intake.styleCount, intake.units].filter((value) => value && value !== "Not sure" && value !== "Other").length;
  const specs = [
    intake.techPack === "Yes",
    intake.measurements === "Yes",
    intake.mockups === "Yes" || intake.mockups === "In progress",
    intake.references === "Yes",
    assetSet.has("Size chart"),
  ].filter(Boolean).length;
  const outreach = ["Logo", "Product mockups", "Budget range", "Quantity target", "Decoration method", "Launch plan"].filter((asset) => assetSet.has(asset)).length;
  return {
    "Product clarity": { points: Math.round((clarity / 3) * 20), max: 20 },
    "Spec readiness": { points: Math.min(20, specs * 4), max: 20 },
    "Budget readiness": { points: budgetScore(intake), max: 20 },
    "MOQ realism": { points: moqScore(intake, path), max: 15 },
    "Timeline realism": { points: timelineScore(intake, path), max: 10 },
    "Outreach readiness": { points: Math.round((outreach / 6) * 15), max: 15 },
  };
}

function budgetScore(intake) {
  const base = {
    "Under $500": 4,
    "$500-$1,500": 10,
    "$1,500-$3,000": 15,
    "$3,000-$7,500": 18,
    "$7,500+": 20,
    "Not sure": 6,
  }[intake.budget] || 0;
  const sample = intake.sampleBudget === "Under $100" ? -3 : intake.sampleBudget === "Not sure" ? -2 : 1;
  const deposit = intake.deposit === "Yes" ? 2 : intake.deposit === "No" ? -3 : -1;
  return clamp(base + sample + deposit, 0, 20);
}

function moqScore(intake, path) {
  if (intake.units === "Not sure") return 5;
  if (path === "Cut-and-Sew" && ["Under 25", "25-50"].includes(intake.units)) return 3;
  if (path === "Sample Room First" && ["Under 25", "25-50"].includes(intake.units)) return 10;
  if (path.includes("Blanks") && ["25-50", "51-100", "101-300"].includes(intake.units)) return 15;
  if (path === "Private Label" && ["51-100", "101-300", "300+"].includes(intake.units)) return 14;
  if (path === "Cut-and-Sew" && ["101-300", "300+"].includes(intake.units)) return 15;
  return 10;
}

function timelineScore(intake, path) {
  if (path === "Cut-and-Sew" && ["ASAP", "Within 30 days"].includes(intake.sampleTimeline)) return 2;
  if (intake.productTimeline === "Within 30 days" && !path.includes("Blanks")) return 3;
  if (["1-3 months", "3+ months"].includes(intake.sampleTimeline) || intake.productTimeline === "3-6 months") return 10;
  if (intake.sampleTimeline === "Not sure") return 5;
  return 7;
}

function scoreLabel(score) {
  if (score >= 80) return "Ready to Contact Suppliers";
  if (score >= 60) return "Almost Ready";
  if (score >= 40) return "Needs Prep Before Outreach";
  return "Not Production-Ready Yet";
}

function avoidPath(path) {
  if (path === "Cut-and-Sew") return "Avoid low-detail outreach to generic manufacturers. Lead with your tech pack, quantities, sample expectations, and target production window.";
  if (path === "Sample Room First") return "Avoid asking production factories for bulk quotes before the sample, specs, and pattern direction are clear.";
  if (path === "Not Production-Ready Yet") return "Avoid paying a factory, broker, or program before you clarify product, budget, quantity, and references.";
  return "Avoid full custom cut-and-sew for now unless you can support higher sample costs, longer timelines, and technical development.";
}

function interpretation(path, intake) {
  const product = intake.productType || "product";
  return {
    "Blanks + Decoration": `Your lower-risk path is to start with quality blanks and decoration for your ${product}. This lets you validate demand before committing to custom development.`,
    "Premium Blanks + Relabeling": "You likely need a premium blank path with labels, neck tags, packaging, and decoration. This gives the brand a more finished feel without full cut-and-sew risk.",
    "Private Label": "A private-label supplier may fit if you want existing garments customized with branding while avoiding custom patterns and fabric development.",
    "Cut-and-Sew": "You have enough signals to explore custom production, but factories will expect clear specs, sample expectations, budget, and realistic timing.",
    "Sample Room First": "You have a custom idea, but the next step is development before factory production. A sample room or technical designer can turn the concept into something quoteable.",
    "Not Production-Ready Yet": "Your desired path does not match the current budget, quantity, timeline, or asset readiness. Start by clarifying the product and testing with a simpler path.",
  }[path];
}

function missingChecklist(intake, path) {
  const missing = [];
  const assetSet = new Set(intake.assets || []);
  if (intake.units === "Not sure") missing.push("Finalize a quantity target per style");
  if (intake.mockups !== "Yes" && !assetSet.has("Product mockups")) missing.push("Create front/back product mockups");
  if (intake.references !== "Yes" && !assetSet.has("Reference garments")) missing.push("Gather reference garments or links");
  if (intake.measurements !== "Yes" && (path === "Cut-and-Sew" || path === "Sample Room First")) missing.push("Prepare measurements, size range, and fit notes");
  if (intake.techPack !== "Yes" && path === "Cut-and-Sew") missing.push("Create or request a tech pack before factory outreach");
  if (!assetSet.has("Decoration method") && path.includes("Blanks")) missing.push("Decide decoration method: screen print, embroidery, DTG, patch, or transfer");
  if (!assetSet.has("Budget range")) missing.push("Define a working budget range, including sample and deposit comfort");
  if (!assetSet.has("Launch plan")) missing.push("Write a simple launch plan and demand test");
  if (missing.length < 5) missing.push("Prepare a short product description suppliers can quote from");
  return missing;
}

function supplierKeys(path) {
  return {
    "Blanks + Decoration": ["blank", "decorator"],
    "Premium Blanks + Relabeling": ["blank", "decorator", "privateLabel"],
    "Private Label": ["privateLabel", "decorator", "sourcingAgent"],
    "Cut-and-Sew": ["cutSew", "fullPackage", "sourcingAgent"],
    "Sample Room First": ["sampleRoom", "cutSew", "sourcingAgent"],
    "Not Production-Ready Yet": ["blank", "decorator", "sampleRoom"],
  }[path];
}

function searchCriteria(path, intake) {
  const criteria = {
    "Blanks + Decoration": "Search for domestic decorators or premium blank suppliers that offer screen printing, embroidery, low minimums, and clear sample pricing.",
    "Premium Blanks + Relabeling": "Search for premium blank suppliers, decorators, and relabeling partners that support neck tags, hang tags, packaging, embroidery, and low-to-moderate minimums.",
    "Private Label": "Search for private-label apparel suppliers that support existing garment customization, label changes, packaging, and startup-friendly minimum order quantities.",
    "Cut-and-Sew": "Search for cut-and-sew factories or full-package manufacturers with experience in fleece, streetwear, and small-batch development, then lead with tech pack and quantity.",
    "Sample Room First": "Search for sample rooms, technical designers, or pattern makers who can develop a first sample before you request production pricing.",
    "Not Production-Ready Yet": "Search for mockup tools, premium blank options, decorators, and technical designers before contacting production factories.",
  };
  return `${criteria[path]} Prioritize candidates that fit ${intake.units || "your target quantity"} units per style and your ${intake.budget || "current"} budget.`;
}

function outreachScript(intake, path) {
  return `Subject: ${intake.brandName || "New brand"} ${intake.productType || "apparel"} sourcing inquiry

Hi,

My name is ${intake.founderName || "[Founder Name]"} and I am building ${intake.brandName || "[Brand Name]"}. I am looking for a potential fit for a first ${intake.productType || "apparel"} run.

Current details:
- Product: ${intake.productType || "Not finalized"}
- Styles: ${intake.styleCount || "Not finalized"}
- Quantity per style: ${intake.units || "Not finalized"}
- Budget range: ${intake.budget || "Not finalized"}
- Sample timing: ${intake.sampleTimeline || "Not finalized"}
- Production path I am exploring: ${path}

I currently have: ${(intake.assets || []).join(", ") || "early concept notes"}.

Can you let me know whether this is a fit for your services, what information you would need to quote accurately, your minimums, sample process, and typical timeline?

Thank you,
${intake.founderName || "[Founder Name]"}`;
}

function supplierQuestions(path) {
  const common = [
    "What products and services are you strongest at?",
    "What are your minimums by style, color, and size?",
    "What do you need from me to quote accurately?",
    "What is your sample process and sample cost range?",
    "What is your typical sample and production timeline?",
    "What deposit is required before production starts?",
    "Can you share examples of similar work or product categories?",
    "How do you handle quality issues or production mistakes?",
  ];
  const custom = path === "Cut-and-Sew" || path === "Sample Room First"
    ? ["Do you require a tech pack, pattern, or graded size spec?", "Can you help source fabric, trims, labels, and packaging?", "Who owns the pattern and technical files after development?"]
    : ["Which blank brands or garment bodies do you recommend?", "Do you offer relabeling, neck tags, hang tags, or packaging support?", "Can I review a decorated sample before bulk production?"];
  return [...common, ...custom].slice(0, 11);
}

function redFlags(path) {
  const flags = [
    "Supplier asks for full payment before clear scope, sample terms, or invoice.",
    "Supplier avoids giving minimums, timelines, or what files they need.",
    "Supplier promises certain outcomes or unusually fast custom production.",
    "Supplier cannot explain sample review, revisions, or quality control.",
    "Supplier pushes you into a larger order than your demand can support.",
  ];
  flags.push(path === "Cut-and-Sew" || path === "Sample Room First"
    ? "They quote custom production without reviewing specs, references, fit goals, or construction details."
    : "They push full custom manufacturing when decorated or relabeled blanks would fit your stage better.");
  return flags;
}

function actionPlan(path, intake) {
  return [
    ["Week 1", `Tighten the product brief for ${intake.productType || "your first product"}, collect missing assets, and set quantity and budget limits.`],
    ["Week 2", `Build a shortlist using the search criteria for ${path.toLowerCase()} and send outreach to 5-8 supplier candidates.`],
    ["Week 3", "Compare replies by minimums, sample cost, timeline, communication quality, and whether they asked smart questions."],
    ["Week 4", "Choose one sample path, confirm scope in writing, and avoid bulk production until you sign off on the sample."],
  ];
}

export function reportText(submission) {
  const { intake, diagnosis } = submission;
  return `Factory Fit Report: ${intake.brandName}

Recommended path: ${diagnosis.path}
Readiness score: ${diagnosis.score}/100 - ${diagnosis.scoreLabel}

What this means:
${diagnosis.interpretation}

Likely mistake:
${diagnosis.likelyMistake}

Cost reality:
${diagnosis.costReality.range} - ${diagnosis.costReality.note}

Next move:
${diagnosis.nextMove}

Prep checklist:
${diagnosis.missing.map((item) => `- ${item}`).join("\n")}

Supplier search criteria:
${diagnosis.criteria}

Outreach script:
${diagnosis.outreach}

Questions:
${diagnosis.questions.map((item) => `- ${item}`).join("\n")}

Red flags:
${diagnosis.redFlags.map((item) => `- ${item}`).join("\n")}
`;
}

function includesAny(values, needles) {
  return values.filter(Boolean).some((value) => needles.some((needle) => value.toLowerCase().includes(needle)));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
