"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api/client";

interface Props {
  subjects: string[];
}

export default function ContactForm({ subjects }: Props) {
  const t = useTranslations("contact");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSuccess(false);
    if (!fullName || !email || !message) {
      setError(t("errorRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          subject: subject || undefined,
          message,
        }),
      });
      setSuccess(true);
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
          {t("fullName")}
        </label>
        <input
          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
          placeholder="Alex Mercer"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
          {t("email")}
        </label>
        <input
          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
          {t("subject")}
        </label>
        <select
          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none transition-all appearance-none"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">— Select —</option>
          {subjects.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
          {t("message")}
        </label>
        <textarea
          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all resize-none"
          placeholder={t("messagePlaceholder")}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}
      {success && (
        <p className="text-primary text-sm">{t("successMessage")}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? t("sending") : t("sendBtn")}
      </button>
    </form>
  );
}
