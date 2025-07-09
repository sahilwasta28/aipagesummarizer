chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Page Summarizer extension installed');
}); // Handles background tasks and API calls

// Handles any background tasks (if needed) 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
        
        sendResponse({success: true});
    }
});