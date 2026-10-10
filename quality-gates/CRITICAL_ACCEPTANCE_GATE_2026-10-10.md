# MIRA — Critical acceptance gate (2026-10-10)

Status: **BLOCKED / NOT READY TO PUBLISH**. This is an advisory record, not evidence of Mira or reviewer activity.

## Verified source observations
- `main/engine/simulation_engine.js` declares `executed: true`, `verified: true` without execution evidence.
- `main/engine/metrics.js` awards 1.0 when those untrusted flags are true.
- Production pipeline contains five unaccented stages, not the canonical eight.
- Isolated candidate modules `fail_closed_engine_candidate.js` and `evidence_integrity_gate.js` exist on this branch. They are **not wired into production**.
- Integrity verification based on a separately supplied SHA-256 digest checks consistency, **not** whether a simulation ran, whether a digest is genuinely independent, or whether any scientific claim is true.

## Required independent evidence to close blockers
1. A real, reproducible scenario runner with input data, software version, seed where applicable, raw outputs, timestamps, and an immutable execution log.
2. A verifier independent from the scenario's own `verified` claim, with trustworthy provenance for reference outputs/digests, negative controls and counterexamples.
3. CI execution of regression tests on the candidate branch, with run URL and commit SHA. Never infer CI success from test files alone.
4. Separate mathematical proof obligations, empirical validation and interpretive/normative claims.
5. Reviewer identities or verifiable review artifacts for three reviewers and two distinct rounds. Without records: **not verified**.
6. Canonical chain: Ehad → Tek → Yek → Hebûn → Zanabûn → Mabûn → Rabûn → Rasterast. Vahid is not a stage.
7. Independent reverse/circular consistency review, plus deductive and inductive scrutiny.

## Protection
Do not access the prohibited repository or any `papers` folder. Do not modify `main`, original files, live sites, archives or published text. No publication, DOI, journal or arXiv submission.

## Acceptance decision
**HENÜZ HAZIR DEĞİL** until the above are supported by actual evidence. Passing local safety tests does not change that decision.
