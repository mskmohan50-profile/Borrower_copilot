import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { BorrowerAnswers } from "@/types/borrower";
import type { SampleBorrower } from "@/data/sampleBorrowers";
import Welcome from "@/pages/Welcome";
import Assessment from "@/pages/Assessment";
import Results from "@/pages/Results";

const title = "Borrower Copilot — know your numbers before the branch";
const description =
  "Should you borrow, how much, at what rate and what EMI? A self-assessment for Indian borrowers, with a Negotiation Card to hold up at the lender's counter.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "welcome" | "assessment" | "results";

function Index() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [answers, setAnswers] = useState<BorrowerAnswers | null>(null);
  const [prefill, setPrefill] = useState<Partial<BorrowerAnswers> | undefined>(undefined);

  if (stage === "assessment") {
    return (
      <Assessment
        initialAnswers={prefill}
        onComplete={(a) => {
          setAnswers(a);
          setStage("results");
        }}
        onBack={() => setStage("welcome")}
      />
    );
  }

  if (stage === "results" && answers) {
    return (
      <Results
        answers={answers}
        onRestart={() => {
          setAnswers(null);
          setPrefill(undefined);
          setStage("welcome");
        }}
        onBack={() => setStage("assessment")}
      />
    );
  }

  return (
    <Welcome
      onStart={() => {
        setPrefill(undefined);
        setStage("assessment");
      }}
      onRunSample={(s: SampleBorrower) => {
        setPrefill(s.answers);
        setAnswers(s.answers);
        setStage("results");
      }}
      onEditSample={(s: SampleBorrower) => {
        setPrefill(s.answers);
        setStage("assessment");
      }}
    />
  );
}
