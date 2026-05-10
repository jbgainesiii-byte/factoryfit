import { seedSuppliers } from "../data/suppliers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function endpoint(path) {
  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
}

function headers(extra = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function request(path, options = {}) {
  if (!isSupabaseConfigured) return null;
  const response = await fetch(endpoint(path), {
    ...options,
    headers: headers(options.headers),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase ${response.status}: ${details}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function normalizeSubmission(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    intake: row.intake,
    diagnosis: row.diagnosis,
  };
}

function normalizeFeedback(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    submissionId: row.submission_id,
    ...(row.response || {}),
  };
}

function normalizeAttachments(rows) {
  return rows.reduce((result, row) => {
    const current = result[row.submission_id] || [];
    return { ...result, [row.submission_id]: [...current, row.supplier_id] };
  }, {});
}

export async function readCloudState() {
  const [supplierRows, submissionRows, feedbackRows, attachmentRows] = await Promise.all([
    request("suppliers?select=id,record"),
    request("submissions?select=id,created_at,intake,diagnosis&order=created_at.desc"),
    request("feedback?select=id,created_at,submission_id,response&order=created_at.desc"),
    request("report_supplier_candidates?select=submission_id,supplier_id"),
  ]);

  const suppliers = supplierRows.map((row) => ({ id: row.id, ...row.record }));
  return {
    suppliers: suppliers.length ? suppliers : seedSuppliers,
    submissions: submissionRows.map(normalizeSubmission),
    feedback: feedbackRows.map(normalizeFeedback),
    attachments: normalizeAttachments(attachmentRows),
  };
}

export async function seedCloudSuppliers() {
  return upsertSuppliers(seedSuppliers);
}

export async function upsertSuppliers(suppliers) {
  return request("suppliers?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(suppliers.map((supplier) => ({ id: supplier.id, record: supplier }))),
  });
}

export async function saveCloudSubmission(submission) {
  return request("submissions?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      id: submission.id,
      created_at: submission.createdAt,
      intake: submission.intake,
      diagnosis: submission.diagnosis,
    }),
  });
}

export async function saveCloudSupplier(supplier) {
  return upsertSuppliers([supplier]);
}

export async function setCloudAttachment(submissionId, supplierId, shouldAttach) {
  if (shouldAttach) {
    return request("report_supplier_candidates?on_conflict=submission_id,supplier_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ submission_id: submissionId, supplier_id: supplierId }),
    });
  }
  return request(`report_supplier_candidates?submission_id=eq.${submissionId}&supplier_id=eq.${supplierId}`, {
    method: "DELETE",
  });
}

export async function saveCloudFeedback(feedback) {
  return request("feedback", {
    method: "POST",
    body: JSON.stringify({
      id: feedback.id,
      created_at: feedback.createdAt,
      submission_id: feedback.submissionId || null,
      response: feedback,
    }),
  });
}
