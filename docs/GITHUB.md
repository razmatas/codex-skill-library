# Public GitHub source of truth

Public repository: [razmatas/codex-skill-library](https://github.com/razmatas/codex-skill-library), created with Raz's approval on 2026-09-17 and explicitly kept public on 2026-09-21 so other agents can clone it without account-specific repository access. All 44 audited personal copies are archived with exact manifest hashes and original roots/entry filenames. Included licenses remain intact; unknown licenses/authorship are recorded rather than inferred. Public visibility does not establish redistribution permission for entries whose licenses remain unknown. No automatic installation is enabled. Explicit restore instructions: RESTORE.md.

Commit dashboard/scanner source, tests, documentation, config.example.json, library.json, and reviewed custom packages under skills/. Exclude data/, config.local.json, tokens, .env files, plugin caches, dependency folders, account sessions, and machine-specific configuration.

## Desired manifest

An approved personal entry can look like this (replace examples with verified sources and a real scanner hash):

```json
{
  "id": "user:agents:my-skill",
  "origin": "user:agents",
  "name": "my-skill",
  "description": "A reviewed one-line use case",
  "kind": "personal",
  "sourceLabel": "Custom · skills/my-skill",
  "managed": true,
  "folder": "my-skill",
  "installRoot": "agents",
  "source": { "type": "custom", "path": "skills/my-skill" },
  "expectedHash": "verified 64-character SHA-256",
  "examplePrompt": "$my-skill perform this concrete workflow"
}
```

Third-party entries should include upstream repository, pinned revision, license and installation root. Plugin entries go in library.json's plugins list with plugin ID, observed version and notes; the current dashboard compares observed skill packages, not plugin manifest declarations. Authentication always remains machine-local. Built-in packages come from Codex/runtime updates and should not be copied from caches.

Verified third-party sources are recorded under `verifiedUpstreams` with repository, full 40-character commit SHA, package path, exact package hash and every archived identity that matched. See `THIRD_PARTY_NOTICES.md` for preserved MIT notices. Unverified packages remain snapshots and must not be presented as upstream-pinned. Restore still operates on fingerprint-approved local snapshots rather than floating upstream versions.

## Safe workflow

1. Review which personal skills are custom versus third-party; folder location cannot establish authorship.
2. Secret-scan and license-review all proposed packages, including scripts, references and assets.
3. Record approved sources/revisions/hashes. Add only intended files to Git; inspect the staged diff.
4. Push the reviewed commit to the public source repository. Re-check every included package's license/provenance before adding new content because public visibility redistributes it.
5. On each computer, fetch and compare. Link/install approved skill packages only if the destination is absent or an explicitly approved managed install. Preserve local edits and reject conflicts.
6. Register new skills through the same review workflow. Inventory discovery is automatic; backup/publication is deliberately not automatic.

No blind two-way auto-push: simultaneous edits can conflict and skill packages can contain executable code or secrets. A single reviewed repository branch should define approved content. A future safe-sync command can fast-forward unchanged managed packages and produce a plan for conflicts; it must not reset/delete user changes.
