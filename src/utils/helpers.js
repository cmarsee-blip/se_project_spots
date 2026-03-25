// export function setBtnText(
//   btn,
//   isLoading,
//   defaultText = "Save",
//   loadingText = "Saving...",
// ) {
//   if (isLoading) {
//     btn.textContent = loadingText;
//     console.log(`Setting text to ${loadingText}`);
//   } else {
//     btn.textContent = defaultText;
//   }
// }

export function renderLoading(
  isLoading,
  btn,
  btnText = "Save",
  loadingText = "Saving...",
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = btnText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  // You need to prevent the default action in any submit handler
  evt.preventDefault();

  // the button is always available inside `event` as `submitter`
  const submitButton = evt.submitter;
  // fix the initial button text
  const initialText = submitButton.textContent;
  // change the button text before requesting
  renderLoading(true, submitButton, initialText, loadingText);
  // call the request function to be able to use the promise chain
  request()
    .then(() => {
      // any form should be reset after a successful response
      // evt.target is the form in any submit handler
      evt.target.reset();
    })
    // we need to catch possible errors
    // console.error is used to handle errors if you don’t have any other ways for that
    .catch(console.error)

    // and in finally we need to stop loading
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
