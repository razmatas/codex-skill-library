# Restore the private personal-skill snapshot

All 44 audited personal package copies from Raz's laptop are archived under skills/ with their original roots and exact hashes. This excludes built-in/runtime/plugin caches and credentials. Included license files are preserved. Unknown authorship/licenses remain explicitly unknown: these are private backups, not permission to publish third-party packages.

On Gabs, clone/fetch the private repository without resetting local Git changes. Read SECOND-MACHINE.md to pair reporting first. Then:

```sh
npm test
npm run restore:plan
```

Review every action. Identical packages remain unchanged and are not adopted. Absent packages can be installed. Different unmanaged packages or local edits are conflicts; the command refuses the whole apply until these are resolved deliberately. Never delete a real skill to bypass a conflict. Managed unchanged originals can be updated with a retained backup. Four renamed entry files are backup-only and are intentionally excluded from normal restore; do not rename/enable them without a separate compatibility review.

After reviewing the digest printed by the dry-run, explicitly approve it on that machine:

```sh
node scripts/restore.js --apply=FULL_DIGEST_FROM_THIS_MACHINE
```

This is separate authorization from cloning/downloading. The apply checks the current plan digest again and stops if contents/paths changed. Stop other skill installers while applying; locks coordinate this tool only. Backups remain in each installation root's hidden .skill-library-backups/ folder. Failed stages and interrupted locks are kept for deliberate recovery. Do not force-remove locks until the process is confirmed stopped and stages/backups are inspected. Applies are per-package, not all-or-nothing across multiple skills.

The package instructions are preserved, not executed during backup/restore. Connector authentication, plugins, CLIs and project permissions still need local setup. In particular, Framer-generated instructions contain machine-specific temporary-folder permissions and a project-specific ID; run its normal setup locally after review instead of assuming copied instructions provide access. Pencil/Figma and other integrations need their own local tools. Built-ins come from Codex updates; plugins use normal plugin installers.

After applying, report again and compare fresh hashes in the dashboard. A matching private snapshot is not proof that dependencies/authentication work. Future new installs appear automatically in inventory, but repository backups remain a reviewed operation rather than silently uploading arbitrary files.
