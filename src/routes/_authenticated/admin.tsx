import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  BarChart3,
  FileUp,
  Files,
  Loader2,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Wallet,
} from "lucide-react";
import { GRADES, SUBJECTS, RESOURCE_TYPES, TERMS } from "@/data/catalog";
import { formatKES } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListResources,
  adminReports,
  createResource,
  deleteResource,
  getMyRoles,
  setResourcePublished,
} from "@/lib/resources.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — ELIMUPEPE" },
      { name: "description", content: "Upload papers and view sales, top papers and user reports for ELIMUPEPE." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel — ELIMUPEPE" },
      { property: "og:description", content: "Upload papers and view ELIMUPEPE reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type Tab = "upload" | "papers" | "reports";

function AdminPage() {
  const checkRole = useServerFn(getMyRoles);
  const { data: role, isLoading } = useQuery({ queryKey: ["my-roles"], queryFn: () => checkRole() });
  const [tab, setTab] = useState<Tab>("upload");

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-24 text-sm text-muted-foreground sm:px-6">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking your access…
      </div>
    );
  }

  if (!role?.isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Admins only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is restricted. <Link to="/dashboard" className="font-semibold text-primary hover:underline">Go to your dashboard</Link>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="border-b bg-surface py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">ELIMUPEPE control panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload real paper PDFs and track sales, top papers and learner signups.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {([
              ["upload", "Add paper", FileUp],
              ["papers", "Papers", Files],
              ["reports", "Reports", BarChart3],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  tab === id ? "border-primary bg-primary-soft text-primary" : "hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === "upload" && <UploadPaper onDone={() => setTab("papers")} />}
        {tab === "papers" && <PapersTable />}
        {tab === "reports" && <Reports />}
      </section>
    </>
  );
}

function UploadPaper({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const addResource = useServerFn(createResource);

  const [title, setTitle] = useState("");
  const [gradeSlug, setGradeSlug] = useState("grade-7");
  const [subjectSlug, setSubjectSlug] = useState("mathematics");
  const [type, setType] = useState<string>(RESOURCE_TYPES[0]);
  const [term, setTerm] = useState<string>(TERMS[0]);
  const [price, setPrice] = useState("100");
  const [includes, setIncludes] = useState("Paper PDF, Marking Scheme, Instant Download");
  const [popular, setPopular] = useState(false);
  const [published, setPublished] = useState(true);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [schemeFile, setSchemeFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const grade = GRADES.find((g) => g.slug === gradeSlug);
  const subjectOptions = useMemo(
    () => SUBJECTS.filter((s) => (grade ? s.levels.includes(grade.level) : true)),
    [grade],
  );

  async function uploadFile(file: File, suffix: string) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${gradeSlug}/${subjectSlug}/${Date.now()}-${suffix}-${safe}`;
    const { error } = await supabase.storage.from("papers").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/pdf",
    });
    if (error) throw new Error(error.message);
    return path;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!paperFile) {
      toast.error("Add the paper PDF", { description: "Learners need at least the paper file to download." });
      return;
    }
    setBusy(true);
    try {
      const paperPath = await uploadFile(paperFile, "paper");
      const schemePath = schemeFile ? await uploadFile(schemeFile, "scheme") : null;
      await addResource({
        data: {
          title,
          gradeSlug,
          subjectSlug,
          type,
          term,
          priceKES: Number(price),
          includes: includes.split(",").map((i) => i.trim()).filter(Boolean),
          paperPath,
          schemePath,
          popular,
          published,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast.success("Paper published", { description: title });
      setTitle("");
      setPaperFile(null);
      setSchemeFile(null);
      onDone();
    } catch (error) {
      toast.error("Upload failed", { description: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-bold">Paper details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Grade 8 Mathematics Assignment"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Grade">
            <select value={gradeSlug} onChange={(e) => setGradeSlug(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              {GRADES.map((g) => <option key={g.slug} value={g.slug}>{g.label}</option>)}
            </select>
          </Field>
          <Field label="Subject">
            <select value={subjectSlug} onChange={(e) => setSubjectSlug(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              {subjectOptions.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Term">
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Price (KES)">
            <input
              required
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="What's included (comma separated)" className="sm:col-span-2">
            <input
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish immediately
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} /> Mark as popular
          </label>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-bold">Files</h2>
        <p className="mt-1 text-xs text-muted-foreground">PDFs are stored privately. Buyers get secure time-limited download links.</p>

        <FileInput label="Paper PDF (required)" file={paperFile} onFile={setPaperFile} />
        <FileInput label="Marking scheme (optional)" file={schemeFile} onFile={setSchemeFile} />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground shadow-card transition hover:bg-secondary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Upload paper"}
        </button>
      </div>
    </form>
  );
}

function FileInput({ label, file, onFile }: { label: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <label className="mt-4 flex cursor-pointer flex-col gap-1 rounded-xl border border-dashed p-4 text-sm transition hover:border-primary/50">
      <span className="font-semibold">{label}</span>
      <span className="truncate text-xs text-muted-foreground">{file ? file.name : "Choose a PDF…"}</span>
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function PapersTable() {
  const queryClient = useQueryClient();
  const fetchAll = useServerFn(adminListResources);
  const togglePublish = useServerFn(setResourcePublished);
  const removePaper = useServerFn(deleteResource);

  const { data: papers = [], isLoading } = useQuery({ queryKey: ["admin-resources"], queryFn: () => fetchAll() });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
    queryClient.invalidateQueries({ queryKey: ["resources"] });
  };

  const publish = useMutation({
    mutationFn: (v: { id: string; published: boolean }) => togglePublish({ data: v }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error("Update failed", { description: e.message }),
  });

  const del = useMutation({
    mutationFn: (id: string) => removePaper({ data: { id } }),
    onSuccess: () => {
      invalidate();
      toast.success("Paper deleted");
    },
    onError: (e: Error) => toast.error("Delete failed", { description: e.message }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading papers…</p>;
  if (papers.length === 0) return <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">No papers uploaded yet. Use “Add paper” to upload your first PDF.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Paper</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Type / Term</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Files</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {papers.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-3 font-semibold">{p.title}</td>
              <td className="px-4 py-3">{GRADES.find((g) => g.slug === p.gradeSlug)?.label ?? p.gradeSlug}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.type} · {p.term}</td>
              <td className="px-4 py-3">{formatKES(p.priceKES)}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {p.hasPaper ? "Paper" : "—"}{p.hasScheme ? " + Scheme" : ""}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => publish.mutate({ id: p.id, published: !p.published })}
                  className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider ${p.published ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}
                >
                  {p.published ? "Published" : "Hidden"}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => del.mutate(p.id)}
                  aria-label={`Delete ${p.title}`}
                  className="rounded-lg border p-2 text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports() {
  const fetchReports = useServerFn(adminReports);
  const { data, isLoading } = useQuery({ queryKey: ["admin-reports"], queryFn: () => fetchReports() });

  if (isLoading) return <p className="text-sm text-muted-foreground">Crunching the numbers…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">No report data yet.</p>;

  const maxRevenue = Math.max(1, ...data.salesByDay.map((d) => d.revenue));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Wallet} label="Revenue" value={formatKES(data.totals.revenue)} />
        <Stat icon={TrendingUp} label="Paid orders" value={String(data.totals.orders)} />
        <Stat icon={Users} label="Registered users" value={String(data.totals.users)} />
        <Stat icon={Files} label="Papers live" value={String(data.totals.papers)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sales (last 30 days)">
          {data.salesByDay.length === 0 ? (
            <Empty>No sales recorded yet.</Empty>
          ) : (
            <div className="flex h-40 items-end gap-1.5">
              {data.salesByDay.map((d) => (
                <div key={d.day} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10px] text-muted-foreground opacity-0 transition group-hover:opacity-100">{formatKES(d.revenue)}</span>
                  <div className="w-full rounded-t bg-primary/80" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground">{d.day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Payment methods">
          {data.byMethod.length === 0 ? <Empty>No payments yet.</Empty> : (
            <ul className="space-y-3 text-sm">
              {data.byMethod.map((m) => (
                <li key={m.method} className="flex items-center justify-between gap-3">
                  <span className="font-semibold capitalize">{m.method}</span>
                  <span className="text-muted-foreground">{m.count} orders · {formatKES(m.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top papers">
          {data.topPapers.length === 0 ? <Empty>No purchases yet.</Empty> : (
            <ul className="space-y-3 text-sm">
              {data.topPapers.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 font-semibold">{p.title}</span>
                  <span className="shrink-0 text-right text-xs text-muted-foreground">
                    {p.count} sold · {formatKES(p.revenue)}<br />{p.downloads} downloads
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent purchases">
          {data.recent.length === 0 ? <Empty>Nothing yet.</Empty> : (
            <ul className="space-y-3 text-sm">
              {data.recent.map((r, i) => (
                <li key={`${r.title}-${i}`} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="font-semibold">{r.title}</span>
                    <span className="block text-xs text-muted-foreground capitalize">{r.method} · {r.status}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatKES(r.price)}<br />{(r.created_at ?? "").slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Learner signups (last 30 days)">
        {data.signupsByDay.length === 0 ? <Empty>No signups yet.</Empty> : (
          <ul className="flex flex-wrap gap-2 text-xs">
            {data.signupsByDay.map((s) => (
              <li key={s.day} className="rounded-lg bg-surface px-2.5 py-1.5 ring-1 ring-border">
                <span className="font-semibold">{s.day.slice(5)}</span> · {s.count}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
