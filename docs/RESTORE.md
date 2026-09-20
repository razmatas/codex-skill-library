# Restore the private personal-skill snapshot

All 44 audited personal package copies from Raz's laptop are archived under skills/ with their original roots and exact hashes. This excludes built-in/runtime/plugin caches and credentials. Included license files are preserved. Unknown authorship/licenses remain explicitly unknown: these are private backups, not permission to publish third-party packages.

On Gabs, clone/fetch the private repository without resetting local Git changes. Read SECOND-MACHINE.md to pair reporting first. Then:

```sh
npm test
npm run restore:plan
```

Review every action. Identical packages remain unchanged and are not adopted. Different unmanaged packages or local edits are conflicts. The normal missing-only command installs absent packages and skips every conflict or update, so an unrelated package such as `taste-skill` cannot block safe installs and is never overwritten. Four renamed entry files are backup-only and intentionally excluded.

```sh
npm run restore:missing
```

This is the recommended cross-machine sync command. It rechecks the complete plan and each target immediately before copying. Its summary lists installed, matching and skipped packages. Re-run `npm run restore:plan` afterward to review remaining differences.

Only when you deliberately want to update packages previously managed by this tool, review the digest and use the advanced apply form:

```sh
node scripts/restore.js --apply=FULL_DIGEST_FROM_THIS_MACHINE
```

This is separate authorization from cloning/downloading. The apply checks the current plan digest again and stops if contents/paths changed. Stop other skill installers while applying; locks coordinate this tool only. Backups remain in each installation root's hidden .skill-library-backups/ folder. Failed stages and interrupted locks are kept for deliberate recovery. Do not force-remove locks until the process is confirmed stopped and stages/backups are inspected. Applies are per-package, not all-or-nothing across multiple skills.

The package instructions are preserved, not executed during backup/restore. Connector authentication, plugins, CLIs and project permissions still need local setup. In particular, Framer-generated instructions contain machine-specific temporary-folder permissions and a project-specific ID; run its normal setup locally after review instead of assuming copied instructions provide access. Pencil/Figma and other integrations need their own local tools. Built-ins come from Codex updates; plugins use normal plugin installers.

After applying, report again and compare fresh hashes in the dashboard. A matching private snapshot is not proof that dependencies/authentication work. Future new installs appear automatically in inventory, but repository backups remain a reviewed operation rather than silently uploading arbitrary files.
