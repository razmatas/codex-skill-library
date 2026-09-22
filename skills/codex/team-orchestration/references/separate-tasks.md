Read this reference only when the user explicitly requests separate persistent Codex tasks. Native subagents remain the default in SKILL.md.

# Separate persistent task mode

## Activation and roles

Only activate on an explicit request for separate persistent Codex tasks. Loading this skill for inspection is not permission to create tasks. Do not enable it for every project or add a global automatic trigger.

The user talks to the current task, **Mastermind**, which owns direction, scope and final acceptance. Keep its current model; the user's preferred setup is Astra. **Orchestrator** uses Sol High for execution and routine repairs; **Muscle** uses Terra High selectively for bounded work or meaningful independent review. These are Codex desktop tasks, not CLI processes, Hermes identities or native subagents. This explicitly invoked setup requests the two named project tasks; do not create unrelated tasks.

Use the exact model IDs supported by the current app tools (preferred family mapping: gpt-5.6-sol / high and gpt-5.6-terra / high). Do not silently substitute another model when unavailable. Report the limitation and ask only for the missing choice. Never claim verified monetary savings: delegation adds context/handoff overhead and subscription allowance differs from API billing.

## Discover before creating

1. Read the current project's AGENTS.md and relevant existing team/plan files. List app projects/tasks, identify the current project and matching role tasks from project identity and saved IDs, not titles alone. Inspect matching automation records before modifying a timer. Reuse the existing team; an explicit repeated invocation must not duplicate it.
2. Keep the current task as Mastermind. For missing Orchestrator/Muscle tasks, use app create_thread with the selected project ID, explicit requested model/effort and clear role title. Follow the tool's Git/worktree selection rules. Do not invent a branch or copy credentials. Respect user-selected workspace arrangements.
3. Creation is asynchronous: verify readiness with a bounded wait. Do not treat clientThreadId as a ready threadId. Record returned IDs, hosts and actual workspaces, and emit tool-required created-task directives. If the app tools are unavailable, prepare the project docs and report that team creation is unavailable; do not replace this with CLI workers automatically.
4. Explain that saved uncommitted plans are not inherited into new worktrees. Give workers explicit read-only absolute paths to main planning files; synchronize a reviewed baseline deliberately and assign nonoverlapping writable paths. Preserve existing edits and never use destructive resets as setup.

## Project records

Create or extend only the records needed, preserving existing content:

- `docs/TEAM_WORKFLOW.md`: role/task/model/workspace mapping, authority, integration ownership, reporting and timer policy.
- `docs/WORK_QUEUE.md`: Mastermind-owned approved slices, dependencies, writable scope, acceptance checks and exclusions. READY permits execution; HOLD/CANCELLED do not; only Mastermind marks ACCEPTED.
- `docs/ORCHESTRATOR_STATE.md` in Orchestrator's workspace: its single-writer ledger with CLAIMED/RUNNING/WAITING/REVIEW/BLOCKED/REPORTED, dispatch IDs and report state.
- Existing product plan and acceptance checklist remain the scope source. Do not turn a roadmap into permission to implement everything. If setup was the only request, leave the queue empty and team idle.

Do not put project IDs/paths, credentials or mutable progress in this global skill. Keep secrets in the project's established private mechanism and out of messages, Wiki, plans and backups.

## Dispatch and autonomy

Mastermind sends a concrete slice to Orchestrator through the app: objective, acceptance criteria, input paths, owned output paths, baseline, authorization bounds and report destination. Orchestrator checks ledger/task state before sending work; ambiguous delivery is inspected, not blindly repeated.

Orchestrator can resolve routine implementation bugs and adjacent code/configuration repairs within the approved objective without a new Mastermind slice for each fix. Verify proportionately and include repairs in the final handoff. After two unsuccessful repair rounds on the same blocker, escalate with evidence. Escalate material scope/architecture changes or actions requiring new user authorization immediately. Existing user authorization persists; do not manufacture repeat approval gates.

Use Muscle only for useful bounded work or meaningful independent review. Sol may verify small reversible changes directly. Honor explicit review requirements on a slice. Keep one active assignment per worker, no concurrent writes to the same files, no extra workers or nested delegation without authorization. Explicitly review/integrate worktree output; it does not automatically appear in main.

Paid generation, ambiguous retries, deployment, publishing and destructive actions stay within the user's actual authorization. Routine repair authority does not authorize extra spending. No automatic paid fallback or replay.

## Event-driven reporting and optional recovery timer

Muscle reports once to Orchestrator; Orchestrator messages Mastermind on completed deliverables, meaningful blockers or required decisions. Send concise evidence: changed paths, checks, limitations and recommended next action. Batch routine repair details. Avoid acknowledgment loops and repeated unchanged updates. These app task messages are authorized coordination; external email/Slack messages are not.

Mastermind reviews, accepts or scopes follow-up, then ends its turn. Do not start a native automatic goal or a Mastermind polling heartbeat merely because the team exists. Preserve any user-paused goal.

Immediate task messages are the default. A backup heartbeat is optional, not an automatic consequence of setup. When the user requests or has authorized one, use the app automation tool for a thread heartbeat targeting Orchestrator, normally 15 minutes. Reuse its ID and preserve unrelated fields; never handwrite automation config or substitute cron. The prompt must limit execution to approved eligible work, prevent duplicate dispatch, keep unchanged checks quiet and report only meaningful outcomes.

Pause an existing heartbeat when no eligible or in-flight work remains, including when awaiting user approval or Mastermind acceptance. Resume it only for approved active work that benefits from recovery scheduling. Do not busy-poll workers. Local automation depends on the app/computer remaining available; a paused timer cannot wake itself.

## Completion and future use

For setup, report the verified team mapping, doc locations and actual timer state. For implementation, report delivered behavior and evidence; distinguish configured, tested and genuinely completed. Do not claim work started until a task was dispatched and observed active.

The reusable invocation is: “Use $team-orchestration to set up our Mastermind–Orchestrator–Muscle workflow in this project.” For an existing team, read its live state and continue rather than recreating it.

If asked to preserve lessons in a shared Wiki, follow that Wiki's contributor rules and write a concise raw handoff for its curator. The Wiki stores preferences/decisions; this skill stores procedure; project docs store live execution state.
