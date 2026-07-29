"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const result = await authClient.signUp.email({
        name: form.get("name") as string,
        email: form.get("email") as string,
        password: form.get("password") as string,
    });

    console.log(result);

    if (result.error) {
        alert(result.error.message);
    return;
    }

window.location.href = "/dashboard";

    console.log(result);

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={register}
        className="space-y-4 w-full max-w-md rounded-xl border p-8"
      >
        <h1 className="text-2xl font-bold">
          Create Account
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full border rounded p-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 text-white py-2"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}