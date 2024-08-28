document.getElementById('fetch-code').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'fetch-code' }, (response) => {
        if (response.action === 'code-fetched') {
            document.getElementById('code-display').textContent = `Verification Code: ${response.code}`;
        } else if (response.action === 'code-not-found') {
            document.getElementById('code-display').textContent = 'Verification code not found.';
        } else if (response.action === 'error') {
            document.getElementById('code-display').textContent = `Error: ${response.error}`;
        }
    });
});
