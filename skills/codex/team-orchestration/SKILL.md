---
name: team-orchestration
description: Coordinate explicitly requested project work from one Astra Mastermind conversation using native subagents with task-appropriate models. Separate persistent Codex tasks are an explicit alternative. Opt-in only; not automatic on every project.
---

# Team orchestration

## Activation and preferred mode

Use only when explicitly invoked, for example: “Use $team-orchestration for this project.” Do not activate for all projects. Inspecting or updating this skill does not request new agents or implementation work.

Keep the current conversation as **Mastermind**, the user's sole point of contact. The user's preferred Mastermind model is **Astra**; do not silently change the parent model or claim this skill can change it. When another model is active, disclose the mismatch if relevant.

**Native subagents are the default.** Delegate bounded tasks directly from Mastermind, collect their results, review and integrate. Role names describe responsibilities; they do not require permanent workers or a separate Orchestrator layer. Do not create sidebar tasks, recurring automations, worker ledgers or a polling loop merely to enable delegation. If the user requests setup without an implementation objective, record the chosen workflow and remain idle.

## Model routing

Choose the route from the user's explicit invocation. Ordinary invocation uses the standard route below. Select **cheap / save-quota mode** only when the user explicitly requests it, for example “use team orchestration skill for cheap” or “use $team-orchestration to save quota.” Generic efficiency discussion or an unavailable standard model does not activate this mode. Keep Astra as Mastermind in both routes; this changes delegated model selection, not the parent model. These are routing preferences, not a guarantee of measured savings.

### Standard route

| Work | Preferred requested model | Effort guidance |
| --- | --- | --- |
| Complex implementation, investigation or bounded orchestration | `gpt-5.6-sol` | high |
| Standard coding and meaningful independent review | `gpt-5.6-terra` | high or task-appropriate supported effort |
| Precise, mechanical edits | `gpt-5.6-luna` | low |

### Explicit cheap / save-quota route

| Work | Requested model | Effort guidance |
| --- | --- | --- |
| Standard coding and mechanical edits | `deepseek-v4.1-flash:cloud` | task-appropriate supported effort |
| Higher-reasoning work or bounded orchestration | `kimi-k3:cloud` | high |

Do not automatically use Sol/Terra/Luna as a fallback in cheap mode, or Kimi/DeepSeek as a fallback in standard mode. If the selected route cannot execute the task, report the limitation and ask before switching routes. A specific user model override takes precedence.

The user explicitly prefers DeepSeek **v4.1**, not v4. Do not substitute a similarly named v4 model. Do not add layers merely to use all models; if delegation overhead exceeds the task, do it locally.

Inspect the native spawn tool's current schema and capabilities. Advertised model lists can be incomplete: previous bounded tests accepted Sol/Terra/Luna names and returned results, but did not expose authoritative execution-model metadata. This is historical evidence, not guaranteed future support. If the tool allows a string override and higher-priority instructions permit it, try the preferred name on a useful bounded task. Respect a restrictive enum or explicit prohibition. If rejected before dispatch, try an appropriate available model within the selected route when authorized, or report the limitation; if dispatch is ambiguous, check status before retrying to avoid duplicate work.

Distinguish **model requested**, **launch accepted**, **result returned**, and **execution model verified**. Agent self-identification and prompt text are not verification. If no authoritative runtime metadata exists, say execution model is unverified. Never promise token/cost savings or infer billing from accepted model names. Fail rather than silently falling back to parent Astra when the purpose is lower-tier execution and selected alternatives are unavailable.

When overriding a native agent model, use the tool-supported minimal context fork (none or a bounded number of turns); never assume an override works with a full-history fork. Provide a self-contained brief and relevant file paths instead of copying an entire conversation.

## Dispatch and ownership

Read project AGENTS.md and the relevant plan first. Inspect live agents before reusing or spawning work. Every delegated task should have:

- A concrete objective and bounded output, independent of useful work Mastermind can do concurrently.
- Relevant context, input paths, writable paths or read-only scope, and acceptance checks.
- Authorization limits and a reporting destination.

Native agents may share the checkout: assign disjoint write ownership, account for uncommitted changes, and do not run conflicting writes. If isolation is needed, explicitly establish worktrees and integration ownership. Never assume a native agent gets an isolated filesystem. Keep within tool concurrency limits and avoid speculative or ceremonial workers.

Workers may fix routine bugs and necessary adjacent issues inside the assigned objective without asking Mastermind for every small repair. Escalate material scope/architecture changes, repeated failures (normally two unsuccessful repair rounds on the same blocker), and new authorization needs. Use independent review when meaningful, not for every label or formatting change. Paid generation, ambiguous retries, deployment and destructive changes remain bounded by actual user authorization.

Report once on a completed deliverable or meaningful blocker, with changed paths, checks and limitations. Batch routine repair details. Mastermind inspects the result and performs appropriate integration/verification before claiming completion. Do not merely dispatch work and label it delivered. Native work is tied to the current tool/runtime lifecycle; do not promise unattended future resumption or invent a heartbeat to keep it alive.

## Durable state and optional persistent mode

For substantial work, use the project's existing plan/queue and a short team-workflow note. Record model requests and verification limits when useful. Do not create a full multi-task ledger structure for a small native assignment. Keep mutable project state, IDs, paths and secrets out of this global skill.

If the user explicitly asks for persistent separate Codex tasks, read [Separate-task mode](references/separate-tasks.md). This mode is useful for independently resumable work across days. It is not an automatic fallback when a native model is unavailable. Discover/reuse existing tasks before creation. Never archive old tasks or alter existing automations solely because native mode is now preferred; do so only within the user's authorization. Preserve paused goals and timers.

If documenting durable preferences in a shared Wiki, follow its contributor rules: a sourced raw handoff for its curator, not project progress duplicated as global knowledge. Wiki stores preference and rationale; this skill stores procedure; project docs store execution state.

## Invocation

“Use $team-orchestration for this project. Keep Astra as Mastermind and delegate suitable work to native subagents.”

For cheap mode: “Use $team-orchestration to save quota.” This selects Kimi K3 / DeepSeek v4.1 Flash for delegated work, with Astra remaining Mastermind.

For the alternative: “Use $team-orchestration with separate persistent Codex tasks.”
