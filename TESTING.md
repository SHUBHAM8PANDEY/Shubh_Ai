# SHUBH AI restoration testing

## Browser verification

- Served both versions on loopback under separate paths. Opened every restored route in the Codex browser. Checked 1440, 768, and 390 px viewports and rechecked measurements that lagged during viewport changes.
- Captured original and SHUBH AI homepage browser views at all three widths. Company-branded views are local review evidence, outside the publishable project.
- Verified the featured carousel advances, the return control becomes enabled, and keyboard navigation selects the next industry tab.
- Expanded the FAQ, entered a search yielding one of 29 catalog cards, and checked the chat response and Escape dismissal.
- Filtered the article sidebar, saved a reading note locally, and confirmed the value survived reload.
- Checked layout for horizontal overflow and inspected browser console output. SHUBH AI had no reported warnings or errors during the page matrix.
- Previous tests verified mobile navigation, the text analyzer, and Formspree acceptance, failure, unconfigured, and spam paths using mocked network responses. Live Gmail delivery is pending.

## Source verification

- All nine routes preserved. The link and asset check covers 405 local references under a simulated GitHub Pages repository prefix.
- All 29 application cards have separate original editorial images. The project contains 32 generated editorial images.
- JavaScript syntax checks pass. Targeted checks found no company service endpoints or private-key signatures in publishable page code.
- See RESTORATION.md for the file inventory, original and restored section and image counts, and feature mapping. The original and current counts are not identical.

## Manual steps

1. Deploy the Google Apps Script web app, configure its public URL, and confirm inbox delivery and duplicate rejection.
2. Review the local preview and restoration report. Use the README commands only when ready to publish.
3. Verify the final GitHub Pages URL and repeat the mail delivery test once hosted.
