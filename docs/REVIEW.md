# Backup, provenance and two-machine review

Execution environment: codex-work. Latest checkpoint: 2026-09-22.

Raz approved backup of personal packages and explicitly confirmed that the GitHub repository should remain public so other agents can clone it. The repository moved to `warung-kerja/codex-skill-library` on 2026-09-22. All 45 archived copies are fingerprint-verified; 41 are discoverable and four nonstandard entries are retained as backup-only. Built-in/runtime/plugin caches, credentials, machine-local configuration, inventories and reporter tokens are excluded from Git.

Public visibility is an access decision, not a licensing conclusion. Package entries whose authorship or license is unknown remain marked unresolved in `library.json`. Before adding or republishing new package content, repeat the secret, provenance and license review.

## Verified upstreams

Exact content matches are recorded under `verifiedUpstreams` in `library.json` and checked against the archived identities by `scripts/verify-backups.js`:

- Eight GSAP packages match `greensock/gsap-skills` at `aed9cfd3277740755f6bfc1155c7aa645403b760`.
- `defuddle` matches `kepano/obsidian-skills` at `1e1df342c231705579ece0c99527012dfe4dfa5b` in both archived roots.
- `json-canvas`, `obsidian-bases`, `obsidian-cli` and `obsidian-markdown` match `kepano/obsidian-skills` at `5a557ceba792fcb4c58591f3117c6887810d8df1` in both archived roots.
- These upstream repositories declare MIT licensing; their notices are preserved in `THIRD_PARTY_NOTICES.md`.

`frontend-slides` did not match any commit found in the available upstream history and therefore remains an unverified snapshot. Figma and other packages without an exact verified origin remain unpinned rather than receiving a guessed attribution.

## Two-machine checkpoint (2026-09-21)

Fresh automatic reporter cycles were observed on 2026-09-21 for both machines, with no scan warnings:

- Raz: 219 observed skills/packages: 12 built-in, 40 personal and 167 plugin/cache observations.
- Gabs: 209 observed skills/packages: 12 built-in, 42 personal and 155 plugin/cache observations.
- All 40 archived discoverable identities are present on both machines.
- Thirty-eight personal identities match exactly.
- Two local edits are deliberately preserved as conflicts: Raz's `brand-inspo-reference` differs from the archive/Gabs copy, while Gabs' `design-taste-frontend` differs from the archive/Raz copy.
- Gabs also has two local-only personal packages: `agent-reach` and `text-to-lottie`.
- Plugin/cache count differences are observed local state, not evidence of a failed personal-skill restore.

The reporting token remains machine-local and ignored. The dashboard service reads the fresh reports without placing credentials or runtime inventories in the public repository.

## Safety properties

- Restore planning installs only missing archived packages and reports conflicts; it does not silently overwrite differing local packages.
- Apply rechecks the plan and target, validates package identity and hash, and backs up explicitly managed updates.
- No restore or sync path deletes user packages.
- Duplicate folders and nonstandard entries remain preserved rather than merged or renamed.
- Automatic scanning updates inventory/status only. Publishing and restoration remain deliberate operations.

## Remaining decisions, not blockers

- Decide manually whether either preserved local edit should replace the archived baseline; no automatic winner is assumed.
- Decide whether Gabs' two local-only packages should be reviewed and added to the shared archive.
- Confirm provenance/licensing before treating any still-unverified snapshot as redistributable third-party content.

Verification at this checkpoint: 44 archived fingerprints passed; 18 archived identities map to exact upstream pins; the full 23-test suite passed; both machine reports advanced automatically.

## Sync checkpoint (2026-09-22)

- The repository was moved to `warung-kerja/codex-skill-library`; this checkout's `origin` was updated and fast-forwarded to include the archived `team-orchestration` skill from commit `2f58d60`.
- The new package's three files matched its archive fingerprint and audit found no credential-file, secret-pattern, binary, symlink, error or machine-path signals. Its authorship/license remain unverified for redistribution despite the public repository.
- Raz's missing `team-orchestration` package was installed by the missing-only restore workflow. His `brand-inspo-reference` conflict was preserved. The Raz dashboard scan now reports 220 entries, including 41 personal packages.
- Gabs' most recent received inventory was scanned 2026-09-21 at 11:18 UTC and is **stale** at this checkpoint. It showed 42 personal packages and no `team-orchestration`, but that is not proof of current absence. Do not claim cross-machine convergence until a fresh report follows a reviewed Gabs-side restore.
- Archive verification now passes for 45 copies (41 discoverable, four backup-only), with 18 identities matched to pinned upstream commits. The 23-test suite still passes.
