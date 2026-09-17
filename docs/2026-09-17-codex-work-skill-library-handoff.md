---
source_type: handoff
source_agent: Codex
agent_family: Codex
execution_environment: codex-work
created: 2026-09-17
---

# 2026-09-17 — Codex Skill Library foundation

## Source

- User requested a Codex skills cheatsheet, automatically updated inventories from two computers, installation-status comparison, and a GitHub source-of-truth plan.
- Related project: Codex Skill Library, source at `/Volumes/Baro/03 Local Projects/Raz Admin/codex-skill-library/`.
- Evidence: README.md, docs/SECOND-MACHINE.md, docs/GITHUB.md, scanner/server implementation, 10 passing Node tests, successful browser checks for filters/search/details/empty state and phone-width containment, verified launchd running state and Tailscale health endpoint.
- Official local discovery reference: https://learn.chatgpt.com/docs/build-skills .

## Durable findings

- Local dashboard uses port 4317, loopback plus the host's Tailscale interface only. No LAN-wide binding or public Funnel was configured.
- Each machine must scan its own user/system/admin/plugin roots. Second computer runs a reporter, not another central dashboard. Gabs reporter is not yet installed or paired.
- Observed inventory and approved desired setup are separate. Green is observed installed/enabled, red is fresh verified absence, amber is disabled/cache-only/drift/unavailable fingerprint, grey is unconnected/stale/incomplete. Connector authentication and dependencies remain unchecked.
- Cache presence alone cannot establish plugin enablement. Newest observed cache version is not an authoritative active-version selector. Duplicate names remain distinct by origin/package path; consistent install locations still need review.
- Read-only scanning fingerprints full packages including scripts/assets and executable bits, never executes skill scripts, relocates skills, modifies Codex settings, or automatically publishes content.
- macOS xpcproxy denied creating launchd logs on the external Baro volume. Managed runtime deployment to `~/Library/Application Support/Codex Skill Library/dashboard/` resolved it. Source remains on Baro; installed runtime, local config, inventories, logs and reporter token live on internal storage. Runtime survives source-volume disconnection, but not host sleep. Source/config/manifest changes require explicit redeployment; runtime credentials/snapshots are preserved.
- Private reporter credential is generated locally and never served to browsers, committed, or saved in Wiki notes. Second-machine pairing needs deliberate private transfer.
- Local Git repository is initialized and committed. No GitHub remote/publication/skill backup exists yet. library.json and skills/ are an empty review-ready scaffold. Third-party license/source review and custom-skill authorship classification are prerequisites to backing up packages. Automatic installation/reconciliation is not implemented.

## Suggested canonical pages

- Proposed `projects/codex-skill-library.md` for Sob, not created by Codex.
- Proposed `workflows/codex-skill-library-two-machine-setup.md` after GitHub and the second reporter are configured.
- Existing `workflows/project-creation-and-storage-boundaries.md`: source is under the user-selected task workspace rather than the legacy warung-repo default. Internal Application Support is only a deployed runtime, not a competing source repository or Wiki sync mechanism.

## Open questions

- Confirm private GitHub owner/repository and review which personal packages are custom versus third-party before publication.
- Pair Gabs laptop using docs/SECOND-MACHINE.md, then review differences before any safe-sync implementation.
- Whether the dashboard eventually needs an always-on host instead of a sleeping laptop.
- Optional private HTTPS Tailscale Serve for secure-context clipboard support; currently HTTP tailnet access has manual-copy fallback.

No curated Wiki pages, index, log, schema, or Obsidian configuration were changed.
