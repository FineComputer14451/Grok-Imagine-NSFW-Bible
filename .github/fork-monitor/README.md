# Fork Monitor

This directory is used by the automated **Monitor Repository Forks** GitHub Action.

- `state.json` stores the list of forks from the previous run so the workflow can detect new forks.
- The workflow runs every Monday and can also be triggered manually.
- It maintains a single tracking issue titled "🔄 Fork Monitor Report".

Do not edit `state.json` manually unless you know what you are doing.
