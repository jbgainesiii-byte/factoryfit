"use client";

import { useEffect, useMemo, useState } from "react";
import { seedSuppliers, verificationTiers } from "../data/suppliers";
import {
  isSupabaseConfigured,
  readCloudState,
  saveCloudFeedback,
  saveCloudSubmission,
  saveCloudSupplier,
  seedCloudSuppliers,
  setCloudAttachment,
} from "../lib/dataStore";
import {
  assets,
  demoIntake,
  diagnose,
  formSteps,
  initialIntake,
  options,
  pathVisuals,
  reportText,
  storageKey,
  supplierTypes,
} from "../lib/factoryFit";

const adminPin = "factoryfit";

const homepageImages = [
  {
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    alt: "Fabric and apparel development workspace",
    label: "Sample room",
    copy: "For custom ideas that need pattern, fit, sample, or tech pack development before production.",
  },
  {
    src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
    alt: "Premium garment finishing detail",
    label: "Brand finish",
    copy: "For founders who need labels, neck tags, packaging, embroidery, or print decisions clarified.",
  },
  {
    src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Neutral garments hanging on a rack",
    label: "Supplier fit",
    copy: "For deciding whether the next conversation is with a blank supplier, decorator, sample room, or factory.",
  },
];

const howItWorksSteps = [
  ["Intake", "Founder, product, budget, quantity, assets, timeline, and concern."],
  ["Diagnosis", "A rule-based production path: blanks, relabeling, private label, cut-and-sew, sample room, or prep first."],
  ["Score", "A readiness score across clarity, specs, budget, minimums, timeline, and outreach assets."],
  ["Report", "A practical brief with next move, cost reality, outreach script, questions, and red flags."],
];

const blankAppState = {
  submissions: [],
  suppliers: seedSuppliers,
  feedback: [],
  attachments: {},
};

export default function FactoryFitApp() {
  const [view, setView] = useState("home");
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState(initialIntake);
  const [appState, setAppState] = useState(blankAppState);
  const [activeReportId, setActiveReportId] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSelection, setAdminSelection] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [toast, setToast] = useState("");
  const [cloudStatus, setCloudStatus] = useState(isSupabaseConfigured ? "Connecting to Supabase..." : "Local demo mode");

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      const stored = localStorage.getItem(storageKey);
      if (stored && !cancelled) setAppState({ ...blankAppState, ...JSON.parse(stored) });

      if (!isSupabaseConfigured) return;
      try {
        let cloudState = await readCloudState();
        if (!cloudState.suppliers.length) {
          await seedCloudSuppliers();
          cloudState = await readCloudState();
        }
        if (!cancelled) {
          setAppState({ ...blankAppState, ...cloudState });
          setCloudStatus("Supabase connected");
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setCloudStatus("Local fallback active");
      }
    }

    loadState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeSubmission = useMemo(
    () => appState.submissions.find((item) => item.id === activeReportId) || appState.submissions[0],
    [activeReportId, appState.submissions],
  );

  function updateField(field, value) {
    setIntake((current) => ({ ...current, [field]: value }));
  }

  function toggleAsset(asset) {
    setIntake((current) => {
      const nextAssets = current.assets.includes(asset)
        ? current.assets.filter((item) => item !== asset)
        : [...current.assets, asset];
      return { ...current, assets: nextAssets };
    });
  }

  function nextStep() {
    const missing = requiredForStep(step).find((field) => !intake[field]);
    if (missing) {
      setToast("Fill in the required fields before continuing.");
      return;
    }
    setStep((current) => Math.min(current + 1, formSteps.length - 1));
  }

  function submitIntake(event) {
    event.preventDefault();
    const diagnosis = diagnose(intake);
    const submission = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      intake,
      diagnosis,
    };
    setAppState((current) => ({ ...current, submissions: [submission, ...current.submissions] }));
    if (isSupabaseConfigured) {
      saveCloudSubmission(submission)
        .then(() => setCloudStatus("Saved to Supabase"))
        .catch((error) => {
          console.error(error);
          setCloudStatus("Saved locally only");
        });
    }
    setActiveReportId(submission.id);
    setAdminSelection(submission.id);
    setView("report");
  }

  function saveSupplier(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const supplier = { id: editingSupplier?.id || crypto.randomUUID(), ...data };
    setAppState((current) => ({
      ...current,
      suppliers: editingSupplier
        ? current.suppliers.map((item) => (item.id === editingSupplier.id ? supplier : item))
        : [supplier, ...current.suppliers],
    }));
    if (isSupabaseConfigured) {
      saveCloudSupplier(supplier)
        .then(() => setCloudStatus("Supplier saved to Supabase"))
        .catch((error) => {
          console.error(error);
          setCloudStatus("Supplier saved locally only");
        });
    }
    setEditingSupplier(null);
    setToast("Supplier saved.");
  }

  function toggleAttachment(supplierId) {
    if (!adminSelection) return;
    setAppState((current) => {
      const existing = current.attachments[adminSelection] || [];
      const next = existing.includes(supplierId) ? existing.filter((id) => id !== supplierId) : [...existing, supplierId];
      if (isSupabaseConfigured) {
        setCloudAttachment(adminSelection, supplierId, !existing.includes(supplierId))
          .then(() => setCloudStatus("Supplier candidate synced"))
          .catch((error) => {
            console.error(error);
            setCloudStatus("Supplier candidate saved locally only");
          });
      }
      return { ...current, attachments: { ...current.attachments, [adminSelection]: next } };
    });
  }

  async function copyActiveReport() {
    if (!activeSubmission) return;
    await navigator.clipboard.writeText(reportText(activeSubmission));
    setToast("Report copied.");
  }

  function saveFeedback(event) {
    event.preventDefault();
    const feedback = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      submissionId: activeSubmission?.id || null,
      ...Object.fromEntries(new FormData(event.currentTarget).entries()),
    };
    setAppState((current) => ({
      ...current,
      feedback: [feedback, ...current.feedback],
    }));
    if (isSupabaseConfigured) {
      saveCloudFeedback(feedback)
        .then(() => setCloudStatus("Feedback saved to Supabase"))
        .catch((error) => {
          console.error(error);
          setCloudStatus("Feedback saved locally only");
        });
    }
    event.currentTarget.reset();
    setToast("Feedback saved.");
    setView("home");
  }

  function resetDemoData() {
    setAppState(blankAppState);
    setAdminSelection("");
    setEditingSupplier(null);
    setToast("Demo data cleared.");
  }

  return (
    <main className="min-h-screen bg-bone text-ink">
      <Header view={view} setView={setView} />
      {view === "home" && <Landing setView={setView} />}
      {view === "intake" && (
        <Intake
          intake={intake}
          setIntake={setIntake}
          updateField={updateField}
          toggleAsset={toggleAsset}
          step={step}
          setStep={setStep}
          nextStep={nextStep}
          submitIntake={submitIntake}
        />
      )}
      {view === "report" && (
        <Report
          submission={activeSubmission}
          suppliers={appState.suppliers}
          attachments={appState.attachments}
          setView={setView}
          copyReport={copyActiveReport}
        />
      )}
      {view === "admin" && (
        <Admin
          open={adminOpen}
          setOpen={setAdminOpen}
          submissions={appState.submissions}
          suppliers={appState.suppliers}
          feedback={appState.feedback}
          attachments={appState.attachments}
          selection={adminSelection}
          setSelection={setAdminSelection}
          editingSupplier={editingSupplier}
          setEditingSupplier={setEditingSupplier}
          saveSupplier={saveSupplier}
          toggleAttachment={toggleAttachment}
          resetDemoData={resetDemoData}
        />
      )}
      {view === "feedback" && <Feedback saveFeedback={saveFeedback} />}
      <div className={`fixed bottom-5 right-5 z-50 rounded-lg bg-charcoal px-4 py-3 text-sm font-bold text-paper shadow-editorial transition ${toast ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {toast}
      </div>
      <div className="no-print fixed bottom-5 left-5 z-40 rounded-full border border-line bg-paper px-3 py-2 text-xs font-black text-muted shadow-sm">
        {cloudStatus}
      </div>
    </main>
  );
}

function Header({ view, setView }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-bone/90 px-5 py-4 backdrop-blur md:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <button className="flex items-center gap-3 text-left" onClick={() => setView("home")} type="button">
          <span className="grid size-11 place-items-center rounded-lg bg-charcoal text-sm font-black text-paper">FF</span>
          <span>
            <strong className="block">Factory Fit</strong>
            <small className="text-muted">Detroit AI Works</small>
          </span>
        </button>
        <nav className="flex gap-2 text-sm font-black text-muted">
          {[
            ["home", "Home"],
            ["intake", "Intake"],
            ["report", "Report"],
            ["admin", "Admin"],
          ].map(([key, label]) => (
            <button
              className={`rounded-full px-3 py-2 ${view === key ? "bg-paper text-charcoal" : "hover:text-charcoal"}`}
              key={key}
              onClick={() => setView(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Landing({ setView }) {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-end gap-10 px-5 py-14 md:grid-cols-[1.4fr_0.6fr] md:px-10 lg:py-24">
        <div className="max-w-5xl pb-8">
          <p className="eyebrow mb-5">Production path diagnostic</p>
          <h1 className="font-serif text-5xl font-medium leading-[0.95] md:text-7xl lg:text-8xl">
            Stop guessing which manufacturer fits your clothing brand.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#514d46] md:text-xl">
            Factory Fit helps first-time apparel founders figure out what kind of supplier they need,
            whether they are ready to contact one, and what to prepare before spending money on samples or production.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => setView("intake")} type="button">Start Factory Fit Check</button>
            <a className="btn btn-secondary" href="#how">See How It Works</a>
          </div>
        </div>
        <aside className="panel overflow-hidden">
          <img
            alt="Folded premium apparel blanks and garment texture"
            className="h-64 w-full object-cover"
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="grid gap-5 p-7">
            <p className="eyebrow">Example outcome</p>
            <h2 className="font-serif text-4xl">Premium blanks + relabeling</h2>
            <p>Best for a founder validating demand before custom patterns, higher minimums, and longer sampling timelines.</p>
            <div className="flex items-end justify-between border-t border-line pt-5">
              <strong className="font-serif text-7xl font-medium leading-none">75</strong>
              <span className="badge">Almost Ready</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 border-y border-line px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-10">
        <div>
          <p className="eyebrow">The real bottleneck</p>
          <h2 className="mt-3 font-serif text-4xl">Most founders do not need a bigger factory list first.</h2>
        </div>
        <p className="text-lg leading-8">
          They get stuck because they contact the wrong supplier too early, with unclear specs, unrealistic quantities,
          weak budgets, or no plan for comparing responses. Factory Fit turns that confusion into a realistic sourcing path.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10" id="how">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-serif text-4xl">A guided check before outreach</h2>
            <p className="mt-4 text-lg leading-8">
              The point is not to hand a beginner a giant list. It is to tell them which kind of supplier conversation is realistic right now.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {howItWorksSteps.map(([title, copy], index) => (
              <article className="panel p-5" key={title}>
                <span className="grid size-9 place-items-center rounded-full bg-charcoal text-sm font-black text-paper">{index + 1}</span>
                <h3 className="mt-5 font-black">{title}</h3>
                <p className="mt-2 text-sm">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {homepageImages.map((image) => (
            <article className="panel overflow-hidden" key={image.label}>
              <img alt={image.alt} className="h-56 w-full object-cover" src={image.src} />
              <div className="p-5">
                <p className="eyebrow">{image.label}</p>
                <p className="mt-2 text-sm">{image.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-10">
        <div className="panel p-7">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-3 font-serif text-4xl">A practical sourcing brief</h2>
          <List items={["Production path recommendation", "Readiness score", "Supplier type explanation", "Prep checklist", "Outreach script", "Red flags", "30-day action plan"]} />
        </div>
        <div className="panel p-7">
          <p className="eyebrow">Designed for</p>
          <h2 className="mt-3 font-serif text-4xl">Streetwear and simple apparel founders</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Hoodies", "T-shirts", "Sweatsuits", "Capsule drops", "Hats", "Blanks with decoration", "Simple cut-and-sew"].map((item) => (
              <span className="rounded-full border border-line bg-white px-3 py-1 text-sm font-extrabold" key={item}>{item}</span>
            ))}
          </div>
          <p className="mt-5 text-sm text-[#a6452e]">
            Not currently designed for footwear, handbags, luxury tailoring, technical outerwear, complex activewear,
            leather goods, or regulated performance apparel.
          </p>
        </div>
      </section>
    </>
  );
}

function Intake({ intake, setIntake, updateField, toggleAsset, step, setStep, nextStep, submitIntake }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[320px_1fr] md:px-10">
      <aside className="panel h-fit p-6 md:sticky md:top-24">
        <p className="eyebrow">Founder intake</p>
        <h1 className="mt-2 font-serif text-4xl">Factory Fit Check</h1>
        <p className="mt-3 text-sm">Move through each section. Your answers generate the diagnosis, score, and report.</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#e8dece]">
          <div className="h-full bg-olive transition-all" style={{ width: `${((step + 1) / formSteps.length) * 100}%` }} />
        </div>
        <ol className="mt-5 grid gap-2 pl-5 text-sm font-black text-muted">
          {formSteps.map((item, index) => (
            <li className={index === step ? "text-clay" : ""} key={item}>{item}</li>
          ))}
        </ol>
      </aside>

      <form className="panel p-6 md:p-8" onSubmit={submitIntake}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-black text-muted">Step {step + 1} of {formSteps.length}</span>
          <button className="text-sm font-black text-clay" onClick={() => setIntake(demoIntake)} type="button">Load test answers</button>
        </div>

        {step === 0 && <BrandBasics intake={intake} updateField={updateField} />}
        {step === 1 && <ProductDetails intake={intake} updateField={updateField} />}
        {step === 2 && <SelectBlock field="needType" label="Which best describes what you think you need?" value={intake.needType} updateField={updateField} />}
        {step === 3 && <Budget intake={intake} updateField={updateField} />}
        {step === 4 && <Timeline intake={intake} updateField={updateField} />}
        {step === 5 && <Readiness intake={intake} toggleAsset={toggleAsset} />}
        {step === 6 && <SelectBlock field="concern" label="What are you most worried about?" value={intake.concern} updateField={updateField} />}
        {step === 7 && <Context intake={intake} updateField={updateField} />}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button className="btn btn-secondary" disabled={step === 0} onClick={() => setStep(Math.max(step - 1, 0))} type="button">Back</button>
          {step < formSteps.length - 1 ? (
            <button className="btn btn-primary" onClick={nextStep} type="button">Continue</button>
          ) : (
            <button className="btn btn-primary" type="submit">Generate Report</button>
          )}
        </div>
      </form>
    </section>
  );
}

function BrandBasics({ intake, updateField }) {
  return (
    <FormSection title="Brand Basics">
      <TextInput field="founderName" label="Founder name" value={intake.founderName} updateField={updateField} />
      <TextInput field="email" label="Email" type="email" value={intake.email} updateField={updateField} />
      <TextInput field="brandName" label="Brand name" value={intake.brandName} updateField={updateField} />
      <TextInput field="brandUrl" label="Website or Instagram" value={intake.brandUrl} updateField={updateField} />
      <TextInput field="location" label="Location" value={intake.location} updateField={updateField} />
      <SelectBlock field="launchedBefore" label="Have you launched clothing before?" value={intake.launchedBefore} updateField={updateField} compact />
    </FormSection>
  );
}

function ProductDetails({ intake, updateField }) {
  return (
    <FormSection title="Product Details">
      {["productType", "styleCount", "units", "mockups", "techPack", "references", "measurements"].map((field) => (
        <SelectBlock key={field} field={field} label={labelFor(field)} value={intake[field]} updateField={updateField} compact />
      ))}
    </FormSection>
  );
}

function Budget({ intake, updateField }) {
  return (
    <FormSection title="Budget">
      {["budget", "sampleBudget", "deposit"].map((field) => (
        <SelectBlock key={field} field={field} label={labelFor(field)} value={intake[field]} updateField={updateField} compact />
      ))}
    </FormSection>
  );
}

function Timeline({ intake, updateField }) {
  return (
    <FormSection title="Timeline">
      {["sampleTimeline", "productTimeline", "launchDate"].map((field) => (
        <SelectBlock key={field} field={field} label={labelFor(field)} value={intake[field]} updateField={updateField} compact />
      ))}
    </FormSection>
  );
}

function Readiness({ intake, toggleAsset }) {
  return (
    <div>
      <h2 className="font-serif text-4xl">Readiness</h2>
      <p className="mt-2">Which assets do you already have?</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <label className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-3 text-sm font-extrabold" key={asset}>
            <input checked={intake.assets.includes(asset)} onChange={() => toggleAsset(asset)} type="checkbox" />
            {asset}
          </label>
        ))}
      </div>
    </div>
  );
}

function Context({ intake, updateField }) {
  return (
    <div className="grid gap-5">
      <h2 className="font-serif text-4xl">Context</h2>
      <Textarea field="consultantHelp" label="What were you hoping a paid program or consultant would help you figure out?" value={intake.consultantHelp} updateField={updateField} />
      <Textarea field="valuable" label="What would make this report valuable to you?" value={intake.valuable} updateField={updateField} />
      <Textarea field="useless" label="What would make this report useless?" value={intake.useless} updateField={updateField} />
    </div>
  );
}

function Report({ submission, suppliers, attachments, setView, copyReport }) {
  if (!submission) {
    return <Empty title="No report yet" body="Complete the founder intake to generate a Factory Fit report." action={() => setView("intake")} actionLabel="Start Intake" />;
  }
  const attachedSuppliers = suppliers.filter((supplier) => (attachments[submission.id] || []).includes(supplier.id));
  const { intake, diagnosis } = submission;
  const visual = pathVisuals[diagnosis.path];
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 md:px-10">
      <div className="no-print mb-4 flex flex-wrap justify-end gap-3">
        <button className="btn btn-secondary" onClick={() => setView("intake")} type="button">Edit Intake</button>
        <button className="btn btn-secondary" onClick={copyReport} type="button">Copy Report</button>
        <button className="btn btn-primary" onClick={() => window.print()} type="button">Export / Print</button>
      </div>
      <article className="panel p-6 md:p-10">
        <header className="grid gap-6 border-b border-line pb-8 md:grid-cols-[1fr_220px]">
          <div>
            <p className="eyebrow">Factory Fit Report</p>
            <h1 className="mt-3 font-serif text-5xl md:text-7xl">{intake.brandName || "Founder Report"}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8">{diagnosis.interpretation}</p>
          </div>
          <div className="overflow-hidden rounded-lg bg-charcoal text-paper">
            <img alt={visual.alt} className="h-28 w-full object-cover opacity-75" src={visual.image} />
            <div className="p-6 text-center">
              <strong className="block font-serif text-7xl font-medium leading-none">{diagnosis.score}</strong>
              <span className="mt-2 block text-sm font-black text-paper/75">{diagnosis.scoreLabel}</span>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Module title="Executive Read">
            <div className="grid gap-4">
              <p><strong>Best next move:</strong> {diagnosis.nextMove}</p>
              <p><strong>Confidence:</strong> {diagnosis.confidence}. This is based on how complete and internally realistic the intake answers are.</p>
            </div>
          </Module>
          <Module title="Cost Reality">
            <span className="badge">{diagnosis.costReality.range}</span>
            <p className="mt-4">{diagnosis.costReality.note}</p>
          </Module>
          <Module title="Founder Snapshot">
            <Snapshot intake={intake} />
          </Module>
          <Module title="Recommended Production Path">
            <span className="badge">{diagnosis.path}</span>
            <p className="mt-4">{diagnosis.interpretation}</p>
            <p className="mt-3"><strong>Path to avoid for now:</strong> {diagnosis.avoid}</p>
          </Module>
          <Module title="Your Likely Mistake" full>
            <p className="text-lg leading-8">{diagnosis.likelyMistake}</p>
          </Module>
          <Module title="Readiness Score Breakdown" full>
            {Object.entries(diagnosis.scores).map(([label, item]) => <ScoreRow key={label} label={label} item={item} />)}
          </Module>
          <Module title="What You Need Before Outreach">
            <List items={diagnosis.missing} />
          </Module>
          <Module title="Supplier Type Explanation">
            <div className="grid gap-4">
              {diagnosis.supplierKeys.map((key) => (
                <p key={key}><strong>{supplierTypes[key][0]}:</strong> {supplierTypes[key][1]}</p>
              ))}
            </div>
          </Module>
          <Module title="Suggested Supplier Search Criteria" full>
            <p>{diagnosis.criteria}</p>
          </Module>
          <Module title="Outreach Script" full>
            <pre className="whitespace-pre-wrap rounded-lg border border-line bg-bone p-4 font-sans text-sm leading-6">{diagnosis.outreach}</pre>
          </Module>
          <Module title="Questions to Ask Suppliers">
            <List items={diagnosis.questions} />
          </Module>
          <Module title="Red Flags">
            <List items={diagnosis.redFlags} />
          </Module>
          <Module title="30-Day Action Plan" full>
            <div className="grid gap-3 md:grid-cols-4">
              {diagnosis.plan.map(([week, action]) => <div className="rounded-lg border border-line bg-white p-4" key={week}><strong>{week}</strong><p className="mt-2 text-sm">{action}</p></div>)}
            </div>
          </Module>
          <Module title="Supplier Candidates Attached by Admin" full>
            {attachedSuppliers.length ? (
              <div className="grid gap-3">
                {attachedSuppliers.map((supplier) => (
                  <p key={supplier.id}><strong>{supplier.name}</strong> - {supplier.type}. {supplier.bestFor} <br /><a className="font-bold text-clay" href={supplier.website}>{supplier.website}</a></p>
                ))}
              </div>
            ) : (
              <p>No supplier candidates attached yet. Use the admin workspace to add research-graded supplier candidates.</p>
            )}
          </Module>
          <Module title="Feedback" full>
            <p>Was this useful? What was missing? What would you pay for this? Would you recommend it?</p>
            <button className="btn btn-secondary mt-4" onClick={() => setView("feedback")} type="button">Leave Feedback</button>
          </Module>
        </div>
      </article>
    </section>
  );
}

function Admin(props) {
  const [pin, setPin] = useState("");
  if (!props.open) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-12">
        <div className="panel grid gap-5 p-7">
          <p className="eyebrow">Internal admin</p>
          <h1 className="font-serif text-5xl">Supplier and report workspace</h1>
          <p>Enter the MVP admin PIN to view private submissions and edit the seed supplier database.</p>
          <div className="rounded-lg border border-line bg-white p-4 text-sm">
            <strong>PIN format:</strong> use <code className="rounded bg-bone px-2 py-1 font-black">factoryfit</code>, all lowercase with no space.
          </div>
          <label className="field">Admin PIN<input className="field-control" onChange={(event) => setPin(event.target.value)} type="password" value={pin} /></label>
          <button className="btn btn-primary" onClick={() => pin === adminPin && props.setOpen(true)} type="button">Open Admin</button>
        </div>
      </section>
    );
  }

  const selectedSubmission = props.submissions.find((item) => item.id === props.selection);
  const attached = props.attachments[props.selection] || [];

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Internal workspace</p>
          <h1 className="font-serif text-5xl">Admin Dashboard</h1>
        </div>
        <button className="btn btn-secondary" onClick={props.resetDemoData} type="button">Clear demo data</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Module title="Submitted Intakes">
          <div className="grid gap-3">
            {props.submissions.length ? props.submissions.map((submission) => (
              <button className={`rounded-lg border p-4 text-left ${props.selection === submission.id ? "border-clay bg-[#efe0d3]" : "border-line bg-white"}`} key={submission.id} onClick={() => props.setSelection(submission.id)} type="button">
                <strong>{submission.intake.brandName || "Unnamed brand"}</strong>
                <p className="text-sm">{submission.diagnosis.path} - {submission.diagnosis.score}/100</p>
              </button>
            )) : <p>No intakes submitted yet.</p>}
          </div>
        </Module>
        <Module title="Attach Supplier Candidates">
          {selectedSubmission ? (
            <div className="grid gap-3">
              <p className="text-sm"><strong>{selectedSubmission.intake.brandName}</strong> has {attached.length} candidate(s) attached.</p>
              {props.suppliers.map((supplier) => (
                <label className="flex items-start gap-3 rounded-lg border border-line bg-white p-3 text-sm" key={supplier.id}>
                  <input checked={attached.includes(supplier.id)} onChange={() => props.toggleAttachment(supplier.id)} type="checkbox" />
                  <span><strong>{supplier.name}</strong><br />{supplier.type} - {supplier.verificationTier}</span>
                </label>
              ))}
            </div>
          ) : <p>Select a submission to attach candidates.</p>}
        </Module>
      </div>

      <Module title="Supplier Seed Database">
        <button className="btn btn-secondary mb-4" onClick={() => props.setEditingSupplier({})} type="button">New Supplier</button>
        {props.editingSupplier && <SupplierForm supplier={props.editingSupplier} saveSupplier={props.saveSupplier} />}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr><th className="border-b border-line p-3">Supplier</th><th className="border-b border-line p-3">Type</th><th className="border-b border-line p-3">MOQ</th><th className="border-b border-line p-3">Verification</th><th className="border-b border-line p-3">Best for</th><th className="border-b border-line p-3"></th></tr>
            </thead>
            <tbody>
              {props.suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="border-b border-line p-3"><strong>{supplier.name}</strong><br /><a className="text-clay" href={supplier.website}>{supplier.website}</a></td>
                  <td className="border-b border-line p-3">{supplier.type}</td>
                  <td className="border-b border-line p-3">{supplier.moq}</td>
                  <td className="border-b border-line p-3">{supplier.verificationTier}</td>
                  <td className="border-b border-line p-3">{supplier.bestFor}</td>
                  <td className="border-b border-line p-3"><button className="font-black text-clay" onClick={() => props.setEditingSupplier(supplier)} type="button">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Module>

      <Module title="Feedback">
        <div className="grid gap-3">
          {props.feedback.length ? props.feedback.map((item) => (
            <div className="rounded-lg border border-line bg-white p-4" key={item.id}>
              <strong>{item.useful} - {item.price}</strong>
              <p className="text-sm">{item.missing || "No notes"}</p>
              <span className="badge mt-2">Recommend: {item.recommend}</span>
            </div>
          )) : <p>No feedback yet.</p>}
        </div>
      </Module>
    </section>
  );
}

function SupplierForm({ supplier, saveSupplier }) {
  const fields = ["name", "website", "location", "type", "categories", "services", "moq", "startupFit", "techPackRequired", "priceTier", "bestFor", "avoidIf", "notes", "lastChecked"];
  return (
    <form className="mb-5 grid gap-3 rounded-lg border border-line bg-bone p-4 md:grid-cols-3" onSubmit={saveSupplier}>
      {fields.map((field) => (
        <label className={`field ${["bestFor", "avoidIf", "notes"].includes(field) ? "md:col-span-3" : ""}`} key={field}>
          {labelize(field)}
          <input className="field-control" defaultValue={supplier[field] || ""} name={field} />
        </label>
      ))}
      <label className="field">
        Verification tier
        <select className="field-control" defaultValue={supplier.verificationTier || verificationTiers[0]} name="verificationTier">
          {verificationTiers.map((tier) => <option key={tier}>{tier}</option>)}
        </select>
      </label>
      <button className="btn btn-primary md:self-end" type="submit">Save Supplier</button>
    </form>
  );
}

function Feedback({ saveFeedback }) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <form className="panel grid gap-5 p-7" onSubmit={saveFeedback}>
        <p className="eyebrow">Feedback</p>
        <h1 className="font-serif text-5xl">Help tune Factory Fit</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <SimpleSelect name="useful" label="Was this useful?" values={["Yes", "Somewhat", "No"]} />
          <SimpleSelect name="price" label="What would you pay?" values={["$49", "$97", "$197", "$297", "$497", "$1,000+"]} />
          <SimpleSelect name="recommend" label="Recommend it?" values={["Yes", "Maybe", "No"]} />
        </div>
        <label className="field">What was missing?<textarea className="field-control min-h-28" name="missing" /></label>
        <button className="btn btn-primary" type="submit">Send Feedback</button>
      </form>
    </section>
  );
}

function FormSection({ title, children }) {
  return (
    <div>
      <h2 className="font-serif text-4xl">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function TextInput({ field, label, value, updateField, type = "text" }) {
  return (
    <label className="field">
      {label}
      <input className="field-control" onChange={(event) => updateField(field, event.target.value)} type={type} value={value} />
    </label>
  );
}

function Textarea({ field, label, value, updateField }) {
  return (
    <label className="field">
      {label}
      <textarea className="field-control min-h-28" onChange={(event) => updateField(field, event.target.value)} value={value} />
    </label>
  );
}

function SelectBlock({ field, label, value, updateField, compact = false }) {
  return (
    <label className={`field ${compact ? "" : "max-w-2xl"}`}>
      {label}
      <select className="field-control" onChange={(event) => updateField(field, event.target.value)} value={value}>
        <option value="">Choose one</option>
        {options[field].map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function SimpleSelect({ name, label, values }) {
  return (
    <label className="field">
      {label}
      <select className="field-control" name={name}>
        {values.map((value) => <option key={value}>{value}</option>)}
      </select>
    </label>
  );
}

function Module({ title, children, full = false }) {
  return (
    <section className={`rounded-lg border border-line bg-white p-5 ${full ? "md:col-span-2" : ""}`}>
      <h3 className="mb-3 font-black">{title}</h3>
      {children}
    </section>
  );
}

function Snapshot({ intake }) {
  const rows = {
    Founder: intake.founderName,
    Product: intake.productType,
    Stage: intake.launchedBefore,
    Quantity: intake.units,
    Budget: intake.budget,
    Timeline: intake.productTimeline,
    Concern: intake.concern,
  };
  return (
    <dl className="grid gap-2 text-sm">
      {Object.entries(rows).map(([label, value]) => (
        <div className="grid grid-cols-[120px_1fr] gap-3" key={label}>
          <dt className="font-black text-muted">{label}</dt>
          <dd>{value || "Not provided"}</dd>
        </div>
      ))}
    </dl>
  );
}

function ScoreRow({ label, item }) {
  return (
    <div className="grid grid-cols-[150px_1fr_52px] items-center gap-3 py-2 text-sm">
      <strong>{label}</strong>
      <div className="h-2 overflow-hidden rounded-full bg-[#eadfce]">
        <div className="h-full bg-olive" style={{ width: `${(item.points / item.max) * 100}%` }} />
      </div>
      <span className="font-black">{item.points}/{item.max}</span>
    </div>
  );
}

function List({ items }) {
  return <ul className="mt-4 list-disc space-y-2 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Empty({ title, body, action, actionLabel }) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 text-center">
      <div className="panel p-8">
        <h1 className="font-serif text-5xl">{title}</h1>
        <p className="mt-4">{body}</p>
        <button className="btn btn-primary mt-6" onClick={action} type="button">{actionLabel}</button>
      </div>
    </section>
  );
}

function requiredForStep(step) {
  return [
    ["founderName", "email", "brandName", "launchedBefore"],
    ["productType", "styleCount", "units", "mockups", "techPack", "references", "measurements"],
    ["needType"],
    ["budget", "sampleBudget", "deposit"],
    ["sampleTimeline", "productTimeline", "launchDate"],
    [],
    ["concern"],
    [],
  ][step];
}

function labelFor(field) {
  return {
    productType: "What are you trying to make first?",
    styleCount: "How many styles are in your first drop?",
    units: "How many units per style?",
    mockups: "Do you have mockups?",
    techPack: "Do you have a tech pack?",
    references: "Do you have reference garments?",
    measurements: "Do you have measurements/specs?",
    budget: "Total budget for the first run",
    sampleBudget: "Most you would spend on a sample",
    deposit: "Prepared to pay a production deposit?",
    sampleTimeline: "When do you want samples?",
    productTimeline: "When do you want finished products?",
    launchDate: "Do you have a launch date?",
  }[field] || labelize(field);
}

function labelize(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
