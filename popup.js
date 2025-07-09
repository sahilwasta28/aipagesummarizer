let currentSummary = null;
let currentPageTitle = null;
let currentPageUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const viewSavedBtn = document.getElementById('viewSavedBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const summarySection = document.getElementById('summarySection');
    const savedSummaries = document.getElementById('savedSummaries');
    
    // Loading the saved API key
    chrome.storage.local.get(['groqApiKey'], function(result) {
        if (result.groqApiKey) {
            apiKeyInput.value = result.groqApiKey;
        }
    });
    
    
    apiKeyInput.addEventListener('input', function() {
        chrome.storage.local.set({groqApiKey: apiKeyInput.value});
    });
    
    summarizeBtn.addEventListener('click', summarizePage);
    viewSavedBtn.addEventListener('click', toggleSavedSummaries);
    saveBtn.addEventListener('click', saveSummary);

    downloadBtn.addEventListener('click', () => {
    if (!currentSummary || !currentPageTitle) return;

    const blob = new Blob([`Title: ${currentPageTitle}\nURL: ${currentPageUrl}\n\nSummary:\n${currentSummary}`], {
        type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

    
    async function summarizePage() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showError('Please enter your Groq API key first');
            return;
        }
        
        try {
            summarizeBtn.textContent = 'Summarizing...';
            summarizeBtn.disabled = true;
            
            
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            currentPageTitle = tab.title;
            currentPageUrl = tab.url;
            
            
            let pageContent;
            try {
                const results = await chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    function: extractPageContent
                });
                pageContent = results[0].result;
            } catch (scriptError) {
                // Fallback: sending message to content script
                pageContent = await new Promise((resolve, reject) => {
                    chrome.tabs.sendMessage(tab.id, {action: 'extractContent'}, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error('Could not access page content. Please refresh the page and try again.'));
                        } else {
                            resolve(response?.content || '');
                        }
                    });
                });
            }
            
            if (!pageContent || pageContent.trim().length < 100) {
                throw new Error('Not enough content to summarize');
            }
            
            // Calling Groq API
            currentSummary = await callGroqAPI(apiKey, pageContent);
            displaySummary(currentSummary);
            
        } catch (error) {
            showError(error.message);
        } finally {
            summarizeBtn.textContent = 'Summarize Page';
            summarizeBtn.disabled = false;
        }
    }
    
    function extractPageContent() {
       
        const scripts = document.querySelectorAll('script, style, nav, header, footer, aside');
        scripts.forEach(el => el.remove());
        
        
        const mainContent = document.querySelector('main') || 
                           document.querySelector('article') || 
                           document.querySelector('[role="main"]') || 
                           document.body;
        
        
        let text = mainContent.innerText || mainContent.textContent || ''; // Extracting text content
        
        
        text = text.replace(/\s+/g, ' ').trim(); // Cleaning up the text
        
        // Limiting to first 4000 characters to avoid API limits
        return text.substring(0, 4000);
    }
    
    async function callGroqAPI(apiKey, content) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that summarizes web page content into concise bullet points. Focus only on the most important and relevant information. Return 3-7 bullet points maximum.'
                    },
                    {
                        role: 'user',
                        content: `Please summarize this web page content into key bullet points:\n\n${content}`
                    }
                ],
                max_tokens: 300,
                temperature: 0.3
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get summary from AI');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    function displaySummary(summary) {
    const summaryContent = document.getElementById('summaryContent');

    const lines = summary.split('\n').filter(line => line.trim());
    const bulletPoints = lines.map(line => {
        return line.replace(/^[-•*]\s*/, '').trim();
    }).filter(line => line.length > 0);

    const ul = document.createElement('ul');
    ul.className = 'summary-list';

    bulletPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        ul.appendChild(li);
    });

    summaryContent.innerHTML = '';
    summaryContent.appendChild(ul);

    summarySection.style.display = 'block';
    savedSummaries.style.display = 'none';

    
    if (summary === currentSummary) {
        saveBtn.style.display = 'inline-block';
    } else {
        saveBtn.style.display = 'none';
    }
}

    
    function saveSummary() {
    if (!currentSummary) return;

    const summaryData = {
        title: currentPageTitle,
        url: currentPageUrl,
        summary: currentSummary,
        timestamp: Date.now()
    };

    chrome.storage.local.get(['savedSummaries'], function(result) {
        const saved = result.savedSummaries || [];
        saved.unshift(summaryData);

        if (saved.length > 20) {
            saved.splice(20);
        }

        chrome.storage.local.set({savedSummaries: saved}, function() {
            saveBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveBtn.textContent = 'Save Summary';
            }, 1000);
        });
    });
}

    
    function toggleSavedSummaries() {
        if (savedSummaries.style.display === 'none') {
            loadSavedSummaries();
        } else {
            savedSummaries.style.display = 'none';
            summarySection.style.display = currentSummary ? 'block' : 'none';
        }
    }
    
    function loadSavedSummaries() {
    chrome.storage.local.get(['savedSummaries'], function(result) {
        const saved = result.savedSummaries || [];
        const savedContent = document.getElementById('savedContent');

        if (saved.length === 0) {
            savedContent.innerHTML = '<p style="text-align: center; opacity: 0.7;">No saved summaries yet</p>';
            summarySection.style.display = 'none';
        } else {
            // Showing latest saved summary at top 
            const latest = saved[0];
            currentSummary = latest.summary;
            currentPageTitle = latest.title;
            currentPageUrl = latest.url;

            displaySummary(currentSummary);

            
            saveBtn.style.display = 'none';

           
            savedContent.innerHTML = '';
            saved.forEach(item => {
                const div = document.createElement('div');
                div.className = 'saved-item';
                div.innerHTML = `
                    <div class="saved-item-title">${item.title}</div>
                    <div class="saved-item-date">${new Date(item.timestamp).toLocaleDateString()}</div>
                `;
                div.addEventListener('click', () => {
                    currentSummary = item.summary;
                    currentPageTitle = item.title;
                    currentPageUrl = item.url;
                    displaySummary(item.summary);
                    saveBtn.style.display = 'none'; 
                });
                savedContent.appendChild(div);
            });

            summarySection.style.display = 'block';
            savedSummaries.style.display = 'block';
        }
    });
}

    
    function showError(message) {
        const summaryContent = document.getElementById('summaryContent');
        summaryContent.innerHTML = `<div class="error">${message}</div>`;
        summarySection.style.display = 'block';
        savedSummaries.style.display = 'none';
    }
});