# Private GitHub source of truth

Recommended repository name: codex-skill-library, private. This build does not create a remote, publish skill content, or imply that a backup already exists.

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
  "source": "skills/my-skill",
  "revision": "reviewed git commit",
  "expectedHash": "verified 64-character SHA-256",
  "examplePrompt": "$my-skill perform this concrete workflow"
}
```

Third-party entries should include upstream repository, pinned revision, license and installation root. Plugin entries go in library.json's plugins list with plugin ID, observed version and notes; the current dashboard compares observed skill packages, not plugin manifest declarations. Authentication always remains machine-local. Built-in packages come from Codex/runtime updates and should not be copied from caches.

## Safe workflow

1. Review which personal skills are custom versus third-party; folder location cannot establish authorship.
2. Secret-scan and license-review all proposed packages, including scripts, references and assets.
3. Record approved sources/revisions/hashes. Add only intended files to Git; inspect the staged diff.
4. Create the private remote under the chosen owner and push the reviewed commit.
5. On each computer, fetch and compare. Link/install approved skill packages only if the destination is absent or an explicitly approved managed install. Preserve local edits and reject conflicts.
6. Register new skills through the same review workflow. Inventory discovery is automatic; backup/publication is deliberately not automatic.

No blind two-way auto-push: simultaneous edits can conflict and skill packages can contain executable code or secrets. A single reviewed repository branch should define approved content. A future safe-sync command can fast-forward unchanged managed packages and produce a plan for conflicts; it must not reset/delete user changes.
