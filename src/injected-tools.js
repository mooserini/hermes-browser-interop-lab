(() => {
  const stateKey = '__HERMES_BROWSER_INTEROP_LAB__';
  const existing = window[stateKey];

  if (existing) {
    window.removeEventListener('devtoolstooldiscovery', existing.listener);
    existing.notice?.remove();
    delete window[stateKey];
    return { enabled: false, toolCount: 0 };
  }

  const inspectPageSemantics = () => {
    const count = (selector) => document.querySelectorAll(selector).length;

    return {
      documentLanguage: document.documentElement.lang || 'not-declared',
      headings: count('h1, h2, h3, h4, h5, h6'),
      landmarks: count('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'),
      buttons: count('button, [role="button"]'),
      links: count('a[href]'),
      forms: count('form'),
      imagesMissingAlt: count('img:not([alt])'),
      unnamedButtons: [...document.querySelectorAll('button, [role="button"]')].filter((element) => {
        const label = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
        return !label && !element.textContent?.trim();
      }).length,
      note: 'Counts only. No page text, form values, URLs, cookies, storage, or network data were read.',
    };
  };

  const listener = (event) => {
    if (typeof event.respondWith !== 'function') {
      return;
    }

    event.respondWith({
      name: 'Hermes Browser Interop Lab',
      description: 'User-enabled, read-only diagnostics for testing Chrome DevTools for Agents interoperability.',
      tools: [
        {
          name: 'describeHermesInteropHarness',
          description: 'Explains this test harness, its permission boundary, and the data it does not access.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          execute: async () => ({
            purpose: 'Test explicit, inspectable interoperability between a Chrome extension and Chrome DevTools for Agents.',
            activation: 'A person must click the extension action for the current tab.',
            scope: 'The current page only, until the page navigates, closes, or the person clicks the action again.',
            dataCollection: false,
            networkAccess: false,
            mutationTools: false,
          }),
        },
        {
          name: 'auditPageSemantics',
          description: 'Returns aggregate semantic and accessibility counts without returning page text, field values, URLs, or credentials.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          execute: async () => inspectPageSemantics(),
        },
      ],
    });
  };

  window.addEventListener('devtoolstooldiscovery', listener);

  const notice = document.createElement('aside');
  notice.id = 'hermes-browser-interop-lab-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.textContent = 'Hermes Browser Interop Lab enabled — read-only tools, this page only.';
  Object.assign(notice.style, {
    position: 'fixed',
    insetInlineEnd: '16px',
    insetBlockEnd: '16px',
    zIndex: '2147483647',
    maxWidth: '360px',
    padding: '10px 14px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    background: '#17151f',
    color: '#ffffff',
    font: '600 13px/1.4 system-ui, sans-serif',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28)',
  });
  document.documentElement.append(notice);

  window[stateKey] = { listener, notice };
  return { enabled: true, toolCount: 2 };
})();
