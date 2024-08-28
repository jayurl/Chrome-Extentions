chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'show-tooltip') {
        console.log('Received code to display in tooltip:', message.code);
        const input = document.querySelector('input[type="text"], input[type="number"], input[name*="code"], input[name*="verification"]');
        if (input) {
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#4CAF50';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.top = `${input.getBoundingClientRect().top - 30}px`;
            tooltip.style.left = `${input.getBoundingClientRect().left}px`;
            tooltip.style.zIndex = 1000;
            tooltip.textContent = `Verification Code: ${message.code}`;

            document.body.appendChild(tooltip);

            // Remove the tooltip after a certain time or when the user starts typing
            input.addEventListener('focus', () => {
                tooltip.remove();
            });

            sendResponse({ status: 'success' });
        } else {
            console.log('Text box not found');
            sendResponse({ status: 'failure' });
        }
    }
});
