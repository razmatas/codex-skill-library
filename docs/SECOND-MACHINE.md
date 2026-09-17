# Second-machine handoff

Do this after the dashboard is running and this project is available on the other computer (private GitHub checkout or deliberate local transfer). Do not use a remote-control Codex task to assume the other user's home path or overwrite their skills.

## Prompt to give Codex on Gabs laptop

> Set up this Codex Skill Library checkout as the reporter for Gabs laptop. Read README.md and this handoff first. Preserve every existing skill and config file. Inventory user, system, admin, and plugin skills before proposing reconciliation. Create ignored config.local.json with machineId `gabs-laptop`, machineName `Gabs laptop`, and reportUrl `http://100.108.148.72:4317/api/inventory`. Preserve the two configured machine IDs and use 60-second scans / five-minute staleness. Do not start a dashboard server or assign Raz's Tailscale IP to this laptop. Obtain the reporter token through a private transfer, store it only in ignored data/report-token with mode 0600, and never print or commit it. Run the tests and a single report, verify the central dashboard shows a fresh Gabs inventory, then request any needed permission to install `node scripts/service.js install --reporter`. Do not copy, update, remove, auto-commit, or overwrite skills. Report missing skills, package drift, duplicate names, disabled plugins, and unverifiable enablement separately. Skills in different user roots remain separate identities. GitHub backup and approved-skill installation need a reviewed manifest first.

## Configuration example

```json
{
  "machineId": "gabs-laptop",
  "machineName": "Gabs laptop",
  "port": 4317,
  "scanIntervalMs": 60000,
  "staleAfterMs": 300000,
  "tailscaleHost": "",
  "machines": [
    { "id": "raz-laptop", "name": "Raz laptop" },
    { "id": "gabs-laptop", "name": "Gabs laptop" }
  ],
  "extraRoots": [],
  "reportUrl": "http://100.108.148.72:4317/api/inventory"
}
```

Use apply_patch or a trusted local editor for config creation. The existing template is config.example.json. Do not commit config.local.json or data/. The installed dashboard's private token is in `~/Library/Application Support/Codex Skill Library/dashboard/data/report-token` on Raz laptop; transfer it privately to the reporter checkout's `data/report-token` before installation. It is not a GitHub token. Both machines need Tailscale access to the host and their own local Node 22+ installation.

```sh
npm test
npm run report
node scripts/service.js install --reporter
```

The reporter service deploys to `~/Library/Application Support/Codex Skill Library/reporter/`, with logs, inventories and token in its `data/` folder. If the host is asleep, reports fail and retry each minute while local snapshots continue to be saved. This is normal; the central dashboard marks inventories stale after five minutes. Removing the reporter: `node scripts/service.js remove --reporter`. To redeploy changed code/config, remove then reinstall from the same checkout; credentials and snapshots are preserved.

## Acceptance checks

1. Central Gabs column is live and last received is recent.
2. A temporary test skill created in a dedicated folder under a configured skill root appears after the next scan and disappears after removing only that test folder. Never delete real skills for testing.
3. Existing skills have not moved or changed; plugins still use their normal installation mechanism.
4. Reporter token and local paths are excluded from Git.
5. Review cross-root duplicates and version differences with Raz before any reconciliation.
