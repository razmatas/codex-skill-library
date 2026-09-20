# Second-machine handoff

Do this after the dashboard is running and this project is available on the other computer (public GitHub checkout or deliberate local transfer). Do not use a remote-control Codex task to assume the other user's home path or overwrite their skills.

The public repository is https://github.com/razmatas/codex-skill-library . On Gabs laptop, clone it into an appropriate local code-project folder:

```sh
gh repo clone razmatas/codex-skill-library
```

Then give Codex the prompt below. Local configuration and the reporter token are intentionally not in GitHub and must be set up separately. Once those two local files are ready, the intended happy path is one command: `npm run setup:gabs`.

## Prompt to give Codex on Gabs laptop

> Finish this Codex Skill Library setup for Gabs laptop. Pull the current main branch without resetting local changes. Read README.md and this handoff. Preserve every existing skill and config file. Confirm ignored config.local.json uses machineId `gabs-laptop`, machineName `Gabs laptop`, and reportUrl `http://100.108.148.72:4317/api/inventory`. Confirm the privately transferred data/report-token exists with mode 0600 without printing it. Run `npm test`, then `npm run setup:gabs`. This installs only absent reviewed personal skills, leaves matching skills untouched, skips every conflict or update (including a differing taste-skill), sends one report, and installs the background reporter. Never delete, rename, merge, adopt, or overwrite an existing skill to resolve a conflict. Report the installed, matching and skipped counts, then verify the central dashboard shows a fresh Gabs inventory.

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
npm run setup:gabs
```

The reporter service deploys to `~/Library/Application Support/Codex Skill Library/reporter/`, with logs, inventories and token in its `data/` folder. If the host is asleep, reports fail and retry each minute while local snapshots continue to be saved. This is normal; the central dashboard marks inventories stale after five minutes. Removing the reporter: `node scripts/service.js remove --reporter`. To redeploy changed code/config, remove then reinstall from the same checkout; credentials and snapshots are preserved.

## Acceptance checks

After reporter pairing, install only missing personal skills with `npm run restore:missing`. It leaves matching packages alone and skips every differing or managed-update target. Then run `npm run restore:plan` again and send one report. Do not reset Git changes or overwrite a mismatching unmanaged skill.

1. Central Gabs column is live and last received is recent.
2. A temporary test skill created in a dedicated folder under a configured skill root appears after the next scan and disappears after removing only that test folder. Never delete real skills for testing.
3. Existing skills have not moved or changed; plugins still use their normal installation mechanism.
4. Reporter token and local paths are excluded from Git.
5. Review cross-root duplicates and version differences with Raz before any reconciliation.
