# Mira publication readiness gate — draft, non-authoritative

Status: NOT VERIFIED / NOT READY. This document is advisory to Mira, not a fourth reviewer and not a publication approval.

## Critical observations from accessible engine source
- engine/simulation_engine.js returns verified:true without independent evidence and exposes only five stages.
- engine/metrics.js awards score 1.0 when executed and verified are both true; the upstream flag is unsubstantiated.
- These are source-code observations, not proof that a deployed Mira service ran.

## Required canonical sequence
Ehad → Tek → Yek → Hebûn → Zanabûn → Mabûn → Rabûn → Rasterast. Vahid is not a stage.

## Fail-closed acceptance tests
1. With an empty scenario and no independent evidence, verified MUST be false and score MUST be 0.
2. With a scenario merely declaring verified:true, a trusted independent verifier MUST still be required.
3. Pipeline must preserve all eight canonical stages and order.
4. Report source identifiers, test command, environment, timestamp, commit SHA and outputs for each check.
5. Record each of three reviewers' first-round objections and second-round re-evaluations separately, with Mira's disposition and supporting evidence. Missing records = unverified.
6. Check linear reasoning and independent circular back-check separately. Distinguish empirical, formal, theological and normative evidence.
7. Never infer ontological determinism from reflexive equality or a declared axiom.
8. No publish/DOI/arXiv/journal submission without explicit new user approval.

## Scope and protection
Never access zanistarast-papers or any papers folder. Do not modify main, live sites, original papers, old files or archives. Do not assume that creating this document activates Mira or runs reviewers.

## Next engineering action
On a separate isolated branch, implement an evidence validator with independently reproducible outputs, fix the canonical pipeline, and add negative tests. Re-read files and inspect CI results before requesting review.
