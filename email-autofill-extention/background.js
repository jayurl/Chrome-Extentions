chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetch-code') {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting auth token:', chrome.runtime.lastError.message);
                sendResponse({ action: 'error', error: chrome.runtime.lastError.message });
                return;
            }

            console.log('Auth token obtained:', token);

            fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?q=subject:"verification code" OR subject:"Verification Code"`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.messages && data.messages.length > 0) {
                        const messageId = data.messages[0].id;
                        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then(response => response.json())
                            .then(message => {
                                const snippet = message.snippet;
                                const codeMatch = snippet.match(/\b[A-Za-z0-9]{6}\b/); // Match a six-character alphanumeric code
                                if (codeMatch) {
                                    const code = codeMatch[0];
                                    console.log('Verification code found:', code);

                                    // Send the code to the content script to display it in a tooltip
                                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                        chrome.tabs.sendMessage(tabs[0].id, { action: 'show-tooltip', code: code });
                                    });

                                    sendResponse({ action: 'code-fetched', code: code });
                                } else {
                                    console.log('Verification code not found in email snippet');
                                    sendResponse({ action: 'code-not-found' });
                                }
                            });
                    } else {
                        console.log('No messages found with subject "Verification Code"');
                        sendResponse({ action: 'code-not-found' });
                    }
                })
                .catch(error => {
                    console.error('Error fetching emails:', error);
                    sendResponse({ action: 'error', error: error.message });
                });
        });

        // Required to indicate that the response will be sent asynchronously
        return true;
    }
});
