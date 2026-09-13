chrome.action.onClicked.addListener(async (tab) => {
  if (typeof tab.id !== 'number') {
    return;
  }

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/injected-tools.js'],
      world: 'MAIN',
    });

    const enabled = injection?.result?.enabled === true;
    await Promise.all([
      chrome.action.setBadgeText({ tabId: tab.id, text: enabled ? 'ON' : '' }),
      chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#6D5DFB' }),
      chrome.action.setTitle({
        tabId: tab.id,
        title: enabled
          ? 'Hermes Browser Interop Lab is enabled on this page. Click to disable.'
          : 'Hermes Browser Interop Lab is disabled. Click to enable.',
      }),
    ]);
  } catch (error) {
    console.error('Hermes Browser Interop Lab could not run on this page.', error?.message);
    await Promise.all([
      chrome.action.setBadgeText({ tabId: tab.id, text: 'NO' }),
      chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#B42318' }),
      chrome.action.setTitle({
        tabId: tab.id,
        title: 'Hermes Browser Interop Lab cannot run on this page.',
      }),
    ]);
  }
});
