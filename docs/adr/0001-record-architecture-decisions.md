# 1. Record architecture decisions

Date: 2026-05-23

## Status

Accepted.

## Context

We want a lightweight, durable record of the architecturally significant
choices made on this project, with their rationale at the time. CLAUDE.md
states the rules in force; this directory explains why those rules exist
and what alternatives were considered. Without ADRs, the reasoning gets
lost in commit messages and chat history, and the next engineer (or LLM)
ends up re-litigating decisions that were settled months ago.

## Decision

We will use Architecture Decision Records, in the style described by
Michael Nygard
([blog post](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)).

- One file per decision, kept in `docs/adr/`.
- Filenames are `NNNN-short-title.md`, monotonically numbered.
- Each ADR has the sections used here: **Status**, **Context**,
  **Decision**, **Consequences**.
- Statuses: *Proposed*, *Accepted*, *Deprecated*, *Superseded by ADR-XXXX*.
- Superseding an ADR means writing a new one and updating the old one's
  status — not editing the old one's decision.
- Keep ADRs short. A decision that needs ten pages of justification is
  probably two decisions.

## Consequences

- Anyone reviewing a change can find the recorded rationale for a
  convention by skimming this directory.
- Cost: one short markdown file per significant decision, written when
  the decision is made.
- We commit to keeping the directory honest. ADRs that get silently
  ignored are worse than no ADRs at all.
