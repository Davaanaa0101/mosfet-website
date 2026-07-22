"use client";

import { useState } from "react";

interface Props {
  onSuccess?: () => void;
}

export default function QuoteForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "Electrical Engineering",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      alert("Thank you! Your request has been sent.");

      setForm({
        name: "",
        company: "",
        phone: "",
        email: "",
        service: "Electrical Engineering",
        message: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to send your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      />

      <input
        placeholder="Company"
        value={form.company}
        onChange={(e) =>
          setForm({ ...form, company: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      />

      <input
        required
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      />

      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      />

      <select
        value={form.service}
        onChange={(e) =>
          setForm({ ...form, service: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      >
        <option>Electrical Engineering</option>
        <option>Automation</option>
        <option>CCTV</option>
        <option>Fire Alarm</option>
        <option>Networking</option>
        <option>Software Development</option>
      </select>

      <textarea
        required
        rows={5}
        placeholder="Project Details"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
        className="w-full rounded-xl border border-border px-4 py-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Sending..." : "Request Quote"}
      </button>

    </form>
  );
}