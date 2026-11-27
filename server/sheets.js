const { JWT } = require('google-auth-library');

const clients = new Map();

class SheetsError extends Error {
  constructor(status) {
    super('Google Sheets request failed');
    this.status = status;
  }
}

async function sheetsRequest(sheetId, range, { suffix = '', query = '', values, write = false, onDispatch } = {}) {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL: email, GOOGLE_PRIVATE_KEY: privateKey } = process.env;
  if (!email || !privateKey || !sheetId || !/^[\w-]+$/.test(sheetId)) {
    throw new Error('Google Sheets configuration is missing or invalid');
  }

  const scope = 'https://www.googleapis.com/auth/spreadsheets' + (write ? '' : '.readonly');
  if (!clients.has(scope)) {
    clients.set(scope, new JWT({ email, key: privateKey.replace(/\\n/g, '\n'), scopes: [scope] }));
  }

  const { token } = await clients.get(scope).getAccessToken();
  if (!token) throw new Error('Google Sheets token unavailable');
  onDispatch?.();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}${suffix}${query}`,
    {
      method: values ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: values ? JSON.stringify({ values }) : undefined,
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new SheetsError(response.status);
  return response.json();
}

module.exports = { sheetsRequest, SheetsError };
