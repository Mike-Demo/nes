import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { NesButton } from "../components/NesButton";
import { NesContainer } from "../components/NesContainer";
import { NesField } from "../components/NesField";
import { NesInput } from "../components/NesInput";
import { supabase } from "../integrations/supabase/client";
import { ShowcaseShell } from "../showcase/ShowcaseShell";
import { useAuthUser } from "../showcase/studio/useAuthUser";

const SearchSchema = z.object({
  next: z.string().optional(),
});

const CredentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password needs at least 8 characters"),
});

const SAFE_NEXT: ReadonlyArray<string> = ["/studio", "/icons", "/"];

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => SearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Sign in — NES.css Design System" },
      { name: "description", content: "Sign in to save custom pixel icons to the NES.css design system gallery." },
      { property: "og:title", content: "Sign in — NES.css Design System" },
      { property: "og:description", content: "Sign in to save custom pixel icons to the NES.css design system gallery." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; tone: "info" | "error" } | null>(null);
  const [pending, setPending] = useState(false);

  const target = next && SAFE_NEXT.includes(next) ? next : "/studio";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = CredentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setMessage({ text: parsed.error.issues[0]?.message ?? "Check your details", tone: "error" });
      return;
    }
    setPending(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}${target}` },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage({ text: "Check your inbox to confirm the account, then sign in.", tone: "info" });
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
      await navigate({ to: target });
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Something went wrong", tone: "error" });
    } finally {
      setPending(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMessage({ text: "Signed out.", tone: "info" });
  };

  return (
    <ShowcaseShell>
      <h1>{mode === "signin" ? "Sign in" : "Create account"}</h1>
      <p className="lede">Saving icons from the studio needs an author account. Browsing never does.</p>

      <NesContainer title={user ? "PLAYER 1" : mode === "signin" ? "LOGIN" : "NEW GAME"} rounded className="auth-card">
        {user ? (
          <div className="lovable-stack">
            <p className="studio-status">Signed in as {user.email}</p>
            <div className="studio-tools">
              <NesButton variant="primary" onClick={() => void navigate({ to: target })}>Continue</NesButton>
              <NesButton onClick={() => void signOut()}>Sign out</NesButton>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="lovable-stack">
            <NesField label="Email" htmlFor="auth-email">
              <NesInput id="auth-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </NesField>
            <NesField label="Password" htmlFor="auth-password">
              <NesInput
                id="auth-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </NesField>
            <div className="studio-tools">
              <NesButton type="submit" variant="primary" disabled={pending}>
                {pending ? "…" : mode === "signin" ? "Start" : "Sign up"}
              </NesButton>
              <NesButton type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                {mode === "signin" ? "Need an account?" : "Have an account?"}
              </NesButton>
            </div>
          </form>
        )}
        {message ? (
          <p className={`studio-status mt-4${message.tone === "error" ? " is-error" : ""}`} role="status">
            {message.text}
          </p>
        ) : null}
      </NesContainer>
    </ShowcaseShell>
  );
}
