export function setBtnText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving...",
) {
  if (isLoading) {
    btn.textContent = loadingText;
    // set the loading text
    console.log(`Setting text to ${loadingText}`);
  } else {
    btn.textContent = defaultText;
    // set not loading text
  }
}
