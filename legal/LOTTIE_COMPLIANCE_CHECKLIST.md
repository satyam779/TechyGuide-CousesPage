# Lottie Compliance Checklist

1. For each file in `lottie-asset-register.csv`, fill `source_url`, `creator`, `license_name`, `license_url`, and `download_date`.
2. Set `account_plan` to the plan used at download time (Free, Individual, Team, or Enterprise).
3. Save proof screenshots/PDFs in `legal/lottie-evidence/` and add the relative path in `evidence_file`.
4. Set `status` to: `approved`, `replace`, or `blocked`.
5. Replace all `replace`/`blocked` assets before commercial deploy.
6. Keep this folder in version control as your audit trail.

## Current Auto-Fill Status

- All assets are currently set to `replace` for safety.
- `account_plan` is set to `Free` (assumed from your message).
- `download_date` is set from local file modified date (`2026-02-25`).
- `evidence_file` has suggested filenames already.

## Exact Next Edits (Per Row)

1. Replace `https://app.lottiefiles.com/` with the exact animation source page.
2. Replace `creator` with the author/profile name from that page.
3. Replace `license_name` with the exact license shown on the source page.
4. Keep or update `license_url` to the exact license page used by that asset.
5. Save screenshot/PDF proof in `legal/lottie-evidence/` using the suggested file name.
6. Change `status` from `replace` to `approved` only after proof is complete.
