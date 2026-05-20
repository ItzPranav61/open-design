# Open Design Install Report

Generated: 2026-05-20 20:02 IST

## Status

- Overall: WORKING
- Open Design repo: `D:\open-design`
- Launch command: `pnpm tools-dev run web`
- Web URL: `http://127.0.0.1:56341`
- Daemon URL: `http://127.0.0.1:57172`
- Browser: opened automatically to the web URL

## Installed Versions

- OS: Microsoft Windows 11 Home Single Language 10.0.26200, 64-bit
- Node: `v24.14.1`
- npm: `11.13.0`
- pnpm: `10.33.2`
- git: `2.50.0.windows.2`
- Codex CLI: `codex-cli 0.125.0`
- Open Design: `0.7.0`
- Open Design commit: `819398151134c33e9b5d032813a3e61a0f9bf4c9`

## Environment Audit

- Node requirement: satisfied, repo requires `~24`.
- pnpm requirement: fixed from `10.33.0` to `10.33.2`, repo requires `>=10.33.2 <11`.
- PowerShell execution policy: `LocalMachine RemoteSigned`.
- Git: installed and available on PATH.
- Codex: installed and available on PATH.
- PATH includes Node, npm global bin, Git, Codex app resources, and Codex temp runtime path.

## Issues Encountered And Fixes

1. `corepack enable` failed with `EPERM` when trying to write shims under `C:\Program Files\nodejs`.
   - Cause: non-admin write restriction in Program Files.
   - Fix: used the existing npm global path and installed pnpm with `npm install -g pnpm@10.33.2`.

2. Initial clone into the Codex workspace on C: failed with `No space left on device`.
   - Cause: C: had under 1 GB free.
   - Fix: removed the incomplete checkout, pruned package caches, then cloned to `D:\open-design`, where sufficient space was available.

3. PowerShell rejected `&&` as a command separator.
   - Cause: this host's PowerShell parsing mode does not accept `&&`.
   - Fix: split commands into separate invocations.

4. pnpm install warned about ignored optional build scripts and a packaged-app `od` bin.
   - Cause: pnpm build-script approval defaults and the daemon CLI not yet built during one packaged-app bin link attempt.
   - Fix: no repair needed; workspace postinstall built required Open Design packages successfully and `tools-dev` later built the daemon CLI.

5. Web log contains a React hydration warning.
   - Cause: Chrome extension script injection, shown by the log as a `chrome-extension://...` script difference.
   - Fix: no application fix needed; UI served HTTP 200 and app remained running.

## Codex Integration

- Codex executable detected by Open Design: `C:\Users\PRANAV\AppData\Roaming\npm\codex.CMD`
- Open Design app config selected agent: `codex`
- Pinned Codex config:
  - `CODEX_HOME=C:\Users\PRANAV\.codex`
  - `CODEX_BIN=C:\Users\PRANAV\AppData\Roaming\npm\codex.CMD`
- Open Design connection test:
  - Result: success
  - Agent: Codex CLI
  - Sample reply: `ok`
  - Used executable source: configured

## Validation

- Open Design launches: PASS
- UI accessible: PASS, `GET http://127.0.0.1:56341` returned 200
- Daemon health: PASS, `GET http://127.0.0.1:57172/api/health` returned `{"ok":true,"version":"0.7.0"}`
- Startup status: PASS
  - daemon running at `http://127.0.0.1:57172`
  - web running at `http://127.0.0.1:56341`
- Codex detected: PASS
- Codex connection test: PASS
- `.od` directory created: PASS
- `.od\artifacts` directory created: PASS

## Useful Commands

```powershell
cd D:\open-design
pnpm tools-dev status
pnpm tools-dev logs
pnpm tools-dev run web
```
