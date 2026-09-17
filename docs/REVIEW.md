# Backup review and pending pairing

Execution environment: codex-work. Checkpoint: 2026-09-17.

Raz approved private backup of all personal packages and then explicitly requested finishing every package. All 44 audited copies are now archived and fingerprint-verified against installed originals; no originals changed. Included license files remain intact, and unknown license/authorship details are explicitly recorded as unknown. Four nonstandard entries remain backup-only. This fulfills archival coverage, not public redistribution rights, dependency setup or two-machine equivalence. Local audit reports remain ignored and are not served.

## Remaining review scope

- Review for custom backup: brand-inspo-reference, deck-inspo-reference, logo-inspo-reference, web-inspo-reference, and hatch-pet. Authorship and intended distribution still need confirmation; location and license alone do not establish authorship.
- Preserve but hold for origin review: Pencil workflow skills, Framer/generated project skills, brand-extractor, and ui-ux-pro-max. Do not assume these are user-owned custom packages.
- Pin verified third-party packages to upstream commits, preserving licenses/notices and the observed version rather than silently upgrading: Obsidian/defuddle, GSAP, Figma, frontend-slides, design-taste-frontend, and any held packages whose upstream is established.
- Exclude built-in/runtime/plugin cache contents, credentials, local configuration, inventories, and reporter tokens. Plugins continue through their normal installers and local authentication.
- Preserve all duplicate copies. Five audited pairs had identical fingerprints; this does not authorize deleting either copy.
- Preserve four renamed entry files (brand-extractor, brand-guidelines, frontend-design, skill-creator); do not rename or enable them automatically. The Claude-oriented skill-creator also requires compatibility/name-collision review.

Audit evidence: 44 personal folders, 40 discoverable copies, five duplicate-name pairs, no heuristic secret findings. This is not a guarantee that packages contain no secrets. Source references and license hints are clues requiring verification. The two flagged frontend-slides machine paths were generic examples, not actual user paths. Binary Figma icons require content review before packaging.

## Live-state checkpoint

Read-only health/catalog checks confirmed Raz's dashboard responds and reports a fresh local inventory. Gabs is unconnected; no two-machine equivalence is established. Counts can change as skills are installed and must not be used as acceptance proof. The installed runtime has not been redeployed with the local audit/sync development changes.

## Resume after approval

1. Confirm the exact owned custom packages and accepted upstream scope with Raz.
2. Finish package/provenance/license review and pin commits matching approved content. Review the staged Git diff before uploading any package contents.
3. Pair Gabs using SECOND-MACHINE.md and a private token transfer. Verify a fresh inventory and automatic discovery from that machine. Do not infer permission to launch a remote task or assume its filesystem paths.
4. Complete upstream preparation, recovery/apply CLI and reviewed ownership adoption. Exercise real approved packages with dry-run first, preserve edits and backups, and then verify both machines against the manifest.
5. Redeploy reviewed application changes safely; document verified end-to-end setup. Do not mark the goal complete based on fixture tests alone.

Local development evidence: all 20 tests passed; git diff --check passed. Tests cover read-only inventory protection, audit redaction, manifest validation, edit conflicts, plan-change refusal, fixture installation/update backups and package-link refusal. They do not prove upstream acquisition, crash recovery, arbitrary concurrent third-party installers, or two-machine operation. Apply locking is advisory; other installers must be stopped.
