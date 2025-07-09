# 🧠 AI Web Summarizer - Chrome Extension

> A lightweight Chrome Extension that uses **Groq's LLaMA 3 model** to generate concise, AI-powered bullet point summaries of any webpage. Ideal for quick revision, note-taking, and reading long articles without the clutter!

---

## 🚀 Features

✅ Summarize any webpage into **3–7 bullet points**  
✅ Uses **Groq’s free LLaMA 3 API** (100 free requests/day)  
✅ Extracts **only the important content** (ignores ads, navbars, etc.)  
✅ **Download summaries** as `.txt` files directly to your device  
✅ **Save and revisit summaries** inside the extension  
✅ Clean, minimal UI using modern JavaScript, HTML, CSS  
✅ No paid API key required (uses **free tier** from [Groq](https://console.groq.com))

---

## 🔧 Tech Stack

- **Chrome Extension** (Manifest v3)
- **LLaMA 3** model via [Groq API](https://console.groq.com)
- JavaScript (popup.js, content.js, background.js)
- HTML + CSS for responsive UI
- Smart DOM content extraction logic
- Chrome Storage API for saving summaries

---

## 🗝️ Getting Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Copy your **API key** (you get 100 free requests per day)
4. Paste it into the extension when prompted

---

## ⚙️ How to Install Locally

1. **Clone this repository** or **download as a zip folder**

2. Open Chrome and go to:  
   `chrome://extensions`

3. Enable **Developer Mode** (top-right)

4. Click **Load Unpacked** and select the extracted folder

5. You’ll now see **"AI Web Summarizer"** in your Chrome toolbar

---

## 📥 Download Summary

After generating a summary:
- You can **save it locally** inside the extension
- You can **download it as a .txt file** using the “Download” button

---

## 🎯 Why I Built This

I often browse long blogs, docs, and articles — and wanted a quick, AI-powered tool to summarize key points without needing expensive services or paid APIs.

This project helped me learn:
- How to work with Chrome Extension APIs (messaging, scripting, downloads)
- How to integrate real-world **AI APIs** like Groq
- How to extract meaningful content from raw HTML
- How to design user-friendly browser tools using JavaScript

---

## 🧠 Future Improvements

- Option to export as `.docx` instead of `.txt`
- Multi-language support
- Offline summarization (via Ollama and local models)
- Dark/light mode toggle

---

## 📌 Important Notes

- You must have an **active internet connection** for the AI summarization to work.
- API usage is limited to **100 requests/day** on the Groq free tier.

---
## 📸 Screenshots 
![aisum1](https://github.com/user-attachments/assets/52d1ba34-0cee-4334-b6a1-0db25c3cc830)

![aisum2](https://github.com/user-attachments/assets/c4361f56-f2c3-42a2-91fa-aaf3cf7f4e20)

## 🔗 Connect With Me

🌐 [LinkedIn](www.linkedin.com/in/sahilwasta2803)  
📁 [Portfolio](https://sahilwasta28.github.io/sahilwasta28.portfolio.github.io/)

---

## ⭐ If You Like It

Leave a ⭐ star on this repo and share it with your network!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
