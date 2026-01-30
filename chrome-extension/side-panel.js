const DEFAULT_BACKEND_URL = 'http://localhost:3000';

const contentInput = document.getElementById('contentInput');
const questionInput = document.getElementById('questionInput');
const responseOutput = document.getElementById('responseOutput');
const statusLabel = document.getElementById('statusLabel');
const summarizeButton = document.getElementById('summarizeButton');
const askButton = document.getElementById('askButton');
const clearButton = document.getElementById('clearButton');
const grabSelectionButton = document.getElementById('grabSelectionButton');
const backendUrlInput = document.getElementById('backendUrlInput');
const saveSettingsButton = document.getElementById('saveSettingsButton');

const panelState = {
  backendUrl: DEFAULT_BACKEND_URL
};

function setStatus(text) {
  statusLabel.textContent = text;
}

function setOutput(text) {
  responseOutput.textContent = text;
}

function setBusy(isBusy) {
  summarizeButton.disabled = isBusy;
  askButton.disabled = isBusy;
  grabSelectionButton.disabled = isBusy;
  clearButton.disabled = isBusy;
  saveSettingsButton.disabled = isBusy;
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get(['backendUrl']);
  panelState.backendUrl = stored.backendUrl || DEFAULT_BACKEND_URL;
  backendUrlInput.value = panelState.backendUrl;
}

async function saveSettings() {
  panelState.backendUrl = backendUrlInput.value.trim() || DEFAULT_BACKEND_URL;
  await chrome.storage.sync.set({ backendUrl: panelState.backendUrl });
  setStatus('Saved');
}

function getContentText() {
  return contentInput.value.trim();
}

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
}

async function grabSelection() {
  setStatus('Reading');
  const tabId = await getActiveTabId();
  if (!tabId) {
    setStatus('No tab');
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'GET_SELECTION' });
    if (response?.text) {
      contentInput.value = response.text;
      setStatus('Selection ready');
    } else {
      setStatus('No selection');
    }
  } catch (error) {
    setStatus('Cannot read');
  }
}

async function callBackend(messages) {
  const baseUrl = panelState.backendUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/chatgpt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, temperature: 0.2 })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  const data = await response.json();
  return data.content || '';
}

function buildSummaryMessages(content) {
  return [
    {
      role: 'system',
      content:
        'You are the Adaptive Learner side panel. Summarize the provided content in 4-6 short bullets, highlight the key takeaway, and end with one suggested next step. Keep the tone supportive and neutral.'
    },
    {
      role: 'user',
      content: `Content:\n${content}`
    }
  ];
}

function buildQuestionMessages(content, question) {
  const contextLine = content ? `Context:\n${content}` : 'Context: (none provided)';
  return [
    {
      role: 'system',
      content:
        'You are the Adaptive Learner side panel. Answer the question using the provided context. If the context is missing or insufficient, say what is missing in one sentence before answering.'
    },
    {
      role: 'user',
      content: `${contextLine}\n\nQuestion:\n${question}`
    }
  ];
}

async function handleSummarize() {
  const content = getContentText();
  if (!content) {
    setStatus('Add content');
    setOutput('Drop or paste content first.');
    return;
  }

  setBusy(true);
  setStatus('Summarizing');
  try {
    const result = await callBackend(buildSummaryMessages(content));
    setOutput(result || 'No response.');
    setStatus('Done');
  } catch (error) {
    setOutput(`Error: ${error.message}`);
    setStatus('Error');
  } finally {
    setBusy(false);
  }
}

async function handleAsk() {
  const question = questionInput.value.trim();
  if (!question) {
    setStatus('Add question');
    setOutput('Enter a question to continue.');
    return;
  }

  setBusy(true);
  setStatus('Thinking');
  try {
    const result = await callBackend(buildQuestionMessages(getContentText(), question));
    setOutput(result || 'No response.');
    setStatus('Done');
  } catch (error) {
    setOutput(`Error: ${error.message}`);
    setStatus('Error');
  } finally {
    setBusy(false);
  }
}

function handleClear() {
  contentInput.value = '';
  questionInput.value = '';
  setOutput('Drop content, then choose an action.');
  setStatus('Idle');
}

function setupDropZone() {
  const onDragOver = (event) => {
    event.preventDefault();
    contentInput.classList.add('panel__input--dragging');
  };

  const onDragLeave = () => {
    contentInput.classList.remove('panel__input--dragging');
  };

  const onDrop = (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData('text/plain');
    if (text) {
      contentInput.value = text;
      setStatus('Dropped');
    }
    contentInput.classList.remove('panel__input--dragging');
  };

  contentInput.addEventListener('dragover', onDragOver);
  contentInput.addEventListener('dragleave', onDragLeave);
  contentInput.addEventListener('drop', onDrop);
}

summarizeButton.addEventListener('click', handleSummarize);
askButton.addEventListener('click', handleAsk);
clearButton.addEventListener('click', handleClear);
grabSelectionButton.addEventListener('click', grabSelection);
saveSettingsButton.addEventListener('click', saveSettings);

setupDropZone();
loadSettings();
