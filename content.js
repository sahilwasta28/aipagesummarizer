console.log('AI Page Summarizer content script loaded');  //page content extraction content script

// Function extracting page content
function extractPageContent() {
    
    const scripts = document.querySelectorAll('script, style, nav, header, footer, aside');
    scripts.forEach(el => el.remove());
    

    const mainContent = document.querySelector('main') || 
                       document.querySelector('article') || 
                       document.querySelector('[role="main"]') || 
                       document.body;
    
   
    let text = mainContent.innerText || mainContent.textContent || '';
    
    text = text.replace(/\s+/g, ' ').trim();
   
    return text.substring(0, 4000);
}

// Listening messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContent') {
        try {
            const content = extractPageContent();
            sendResponse({content: content});
        } catch (error) {
            sendResponse({error: error.message});
        }
    }
    return true; // Keeping message channel opened for async
});