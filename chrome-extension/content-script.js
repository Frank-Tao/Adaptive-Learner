chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'GET_SELECTION') {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : '';
    sendResponse({ text });
    return true;
  }

  return false;
});
