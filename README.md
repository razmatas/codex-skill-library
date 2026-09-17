# Codex Skill Library

A private, read-only cheatsheet for Raz's growing Codex skill library, comparing live inventories from Raz laptop and Gabs laptop. Owner: Raz. Built by Codex in the codex-work environment.

## Run

Requires Node.js 22+. No package install, build step, external font request, or cloud API is needed.

```sh
npm start
```

Open http://127.0.0.1:4317. The current local configuration also listens only on this machine's Tailscale IP, 100.108.148.72:4317. It does not bind to the LAN or all interfaces. These local values are excluded from Git.

```sh
npm run scan
npm test
npm run service:install
```

The macOS service is a user LaunchAgent. It starts at login, scans every minute, restarts after a crash, and resumes after sleep. The installer deploys a managed runtime to `~/Library/Application Support/Codex Skill Library/dashboard/` so macOS can launch it without depending on the external Baro volume. It cannot run while the computer is asleep. The dashboard remains dependent on this host's availability.

`npm run service:remove` stops the dashboard and removes only its own LaunchAgent; it preserves runtime, project data and all skills. The installer refuses to overwrite an existing service. Installed logs, inventories, and reporter token live in that runtime's `data/` folder; manual `npm start` uses the checkout's ignored `data/` instead. To deploy source/config/manifest changes, remove the service then reinstall it from this same checkout. Runtime snapshots and credentials are preserved during redeploy. Don't run the manual server and service on the same port simultaneously.

## What the scanner observes

- User skills: `.agents/skills`, the active `CODEX_HOME/skills` (or `.codex/skills`).
- System skills: `.codex/skills/.system` and primary-runtime plugin skill packages.
- Administrator skills: `/etc/codex/skills`.
- Plugin cache: newest observed package with skills per marketplace/plugin. This is not an authoritative active version selector. A green plugin dot requires an enabled entry in the local Codex config. Remote installs/cache entries without that evidence are amber, not assumed enabled.
- Explicit extra/project roots configured in `extraRoots`; not every repository on disk.

Each skill requires a valid name and description in SKILL.md. Scanner metadata support is intentionally limited to ordinary top-level YAML scalar/folded strings. Invalid or unreadable packages produce warnings, not silent success. Package SHA-256 includes package filenames, file content, and executable bits, excluding Git, dependencies, and Python caches. External package symlinks or files over 20 MB result in an unavailable fingerprint. Skill-directory symlinks are supported.

Duplicate names stay separate by origin. Installation identity includes skill-root origin (and plugin-relative package path), so `.agents` and `.codex` copies remain distinguishable. Keep approved install locations consistent across machines; relocation requires explicit reconciliation. Presence in the dashboard doesn't prove availability in every Codex task: project scope, permissions, tools and connector authentication can differ. No skill code is executed during scanning.

## Status dots

- Green: observed installed/enabled; dependencies and authentication not checked.
- Red: absent from a fresh, sufficiently complete inventory.
- Amber: disabled, cache-only/enablement unverified, different package hash, or fingerprint unavailable.
- Grey: not connected, inventory older than five minutes, or incomplete scope/scan.

Last-known inventories persist in ignored `data/`, never treated as fresh merely because the dashboard restarted. The browser refreshes every 15 seconds. New installations on either connected computer appear after its next scan/report and browser refresh.

## Second machine

Follow [docs/SECOND-MACHINE.md](docs/SECOND-MACHINE.md). The reporter scans locally and sends metadata/fingerprints, not skill files or Codex credentials, to the dashboard over the private tailnet. Reporting requires a shared random token stored in ignored `data/report-token` with private permissions. The token is never exposed through the dashboard. Local skill instructions are not automatically uploaded to GitHub or copied between machines.

## GitHub / approved library

Private source repository: [razmatas/codex-skill-library](https://github.com/razmatas/codex-skill-library). See [docs/GITHUB.md](docs/GITHUB.md). `library.json` records reviewed setup separately from live inventory. `skills/<original-root>/<folder>` now contains seven reviewed, licensed installed snapshots. Four are discoverable packages; three retain renamed entry files as backup-only. All are unmanaged: copying this checkout does not install them. Other personal packages remain under provenance/license review; built-in and plugin caches are excluded. See [docs/REVIEW.md](docs/REVIEW.md).

Current version: live read-only inventory, remote-reporting protocol, background service helper, comparison tests, and handoff docs. Automatic install/overwrite reconciliation is not implemented. Configure and review the approved manifest before adding that capability.

`npm run audit` creates ignored, local-only personal-package review reports. Secret detection is heuristic, not a guarantee. `npm run sync:plan` is a read-only reconciliation preview; it never downloads sources, executes skill code, installs, deletes, or adopts existing packages. Only manifest entries explicitly marked `managed: true` are considered. Each requires `name`, `folder`, `installRoot` (`agents` or `codex`), and an approved `expectedHash`. Custom sources use `{ "type": "custom", "path": "skills/<folder>" }`; GitHub sources require `repo`, a full 40-character commit `revision`, and a safe package `path`. Existing mismatching packages are conflicts unless a prior installation receipt matches their current fingerprint. The empty manifest produces an empty plan, not proof that both laptops match.

The local apply module is tested on temporary fixtures but deliberately not exposed by the CLI yet. It requires an exact plan digest, copies a reviewed plain package to a hidden stage, checks the staged hash and skill name, rechecks the target, and retains updated packages in the install root's hidden `.skill-library-backups/`. It does not delete backups or failed stages. A receipt records ownership only after installation; unchanged unmanaged packages are not automatically adopted. Runs use an advisory `.sync-lock`; other installers must be stopped during apply because they do not honor that lock. Failures may leave recoverable staging or backup folders and previously completed entries; this is not a multi-package atomic transaction. Interrupted runs require explicit recovery, not automatic lock stealing. Upstream acquisition, recovery CLI, real-package approval and two-machine verification remain incomplete.

## Security

The dashboard is readable by permitted tailnet peers; use Tailscale ACLs to restrict access if needed. Plain HTTP on a Tailscale IP travels inside its encrypted network tunnel, but browsers do not treat this address as a secure context (clipboard copying may require manual selection). A private HTTPS Tailscale Serve endpoint can be configured later without enabling public Funnel. Never put credentials in the manifest, custom packages, or Git history.

Host headers are allowlisted; only known static files and API routes are served. Uploads are authenticated, capped at 4 MB, validated against configured machine IDs, and cannot replace this host's inventory. Scans/reports never delete skills or invoke their scripts. This is a trusted-personal-tailnet tool, not a public multi-tenant service.
