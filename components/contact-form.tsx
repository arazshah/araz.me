"use client";
import { useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
export function ContactForm({ locale }: { locale: SiteLocale }) {
  const fa = locale === "fa";
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, locale }),
    });
    if (response.ok) {
      form.reset();
      setState("success");
    } else setState("error");
  }
  return (
    <form onSubmit={submit} className="form-grid">
      <div className="field">
        <label htmlFor="name">{fa ? "نام" : "Name"}</label>
        <input
          className="input"
          id="name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
        />
      </div>
      <div className="field">
        <label htmlFor="email">{fa ? "ایمیل" : "Email"}</label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="company">
          {fa ? "شرکت (اختیاری)" : "Company (optional)"}
        </label>
        <input
          className="input"
          id="company"
          name="company"
          autoComplete="organization"
        />
      </div>
      <div className="field">
        <label htmlFor="collaborationType">
          {fa ? "نوع همکاری" : "Collaboration type"}
        </label>
        <select
          className="select"
          id="collaborationType"
          name="collaborationType"
          required
        >
          <option value="consulting">
            {fa ? "مشاوره فنی" : "Technical consulting"}
          </option>
          <option value="development">
            {fa ? "توسعه نرم‌افزار" : "Software development"}
          </option>
          <option value="training">
            {fa ? "آموزش و منتورینگ" : "Training and mentoring"}
          </option>
          <option value="other">{fa ? "سایر" : "Other"}</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="subject">{fa ? "موضوع" : "Subject"}</label>
        <input
          className="input"
          id="subject"
          name="subject"
          required
          minLength={4}
        />
      </div>
      <div className="field full">
        <label htmlFor="message">{fa ? "پیام" : "Message"}</label>
        <textarea
          className="textarea"
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
        />
      </div>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="full" style={{ fontSize: ".8rem" }}>
        <input type="checkbox" name="consent" value="true" required />{" "}
        {fa
          ? "با ذخیره امن اطلاعات این فرم برای پاسخ‌گویی موافقم."
          : "I consent to secure storage of this form for a response."}
      </label>
      <div className="full">
        <button
          className="button primary"
          disabled={state === "loading"}
          type="submit"
        >
          {state === "loading"
            ? fa
              ? "در حال ارسال…"
              : "Sending…"
            : fa
              ? "ارسال پیام"
              : "Send message"}
        </button>
      </div>
      <div className="full" role="status" aria-live="polite">
        {state === "success" && (
          <p className="notice">
            {fa
              ? "پیام شما با موفقیت ثبت شد."
              : "Your message was submitted successfully."}
          </p>
        )}
        {state === "error" && (
          <p className="notice">
            {fa
              ? "ارسال انجام نشد؛ لطفاً کمی بعد دوباره تلاش کنید."
              : "Submission failed. Please try again shortly."}
          </p>
        )}
      </div>
    </form>
  );
}
