# Skill Library contributor rules

Use Node.js 22+ built-ins and plain HTML/CSS/JS unless an explicit new dependency is justified. Keep scans read-only; never execute skill scripts, change Codex config, relocate skills, or publish skill content during inventory collection.

Never assume cache presence means enabled. Keep unknown/stale separate from missing. Preserve duplicate identities and origins. Record package fingerprints including scripts/assets and executable modes. Never serve data/ or reporter credentials.

Tests: npm test. Manual scan: npm run scan. Default port: 4317. Local configuration and inventories must remain Git-ignored. The host dashboard scans itself; the second machine runs only the reporter.

No remote GitHub publication, automatic skill reconciliation, or overwriting service files without clear user scope and review. Read docs/SECOND-MACHINE.md before configuring another machine. Keep README limitations accurate.
