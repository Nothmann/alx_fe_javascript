// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const quoteForm = document.getElementById("quoteForm");

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Add a new quote
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories(); // Refresh dropdown
    quoteForm.reset();
    filterQuotes(); // Show quote from selected category
    document.getElementById("quoteForm").reset();
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
newQuoteBtn.addEventListener("click", showRandomQuote);
quoteForm.addEventListener("submit", addQuote);

// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Health is wealth.", category: "Wellness" },
  { text: "Ubuntu: I am because we are.", category: "Culture" },
  { text: "Cannabis is medicine.", category: "Cannabis" }
];

// Save quotes to localStorage
localStorage.setItem("quotes", JSON.stringify(quotes));

function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    quoteForm.reset();
    showRandomQuote();
  }
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function createAddQuoteForm() {
  const formSection = document.createElement("section");
  formSection.id = "addQuoteSection";

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";

  const form = document.createElement("form");
  form.id = "quoteForm";

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";
  inputText.required = true;

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(submitBtn);
  formSection.appendChild(heading);
  formSection.appendChild(form);
  document.body.appendChild(formSection);

  form.addEventListener("submit", addQuote);
}

window.addEventListener("load", () => {
  createAddQuoteForm();
  populateCategories();
  // ...rest of your load logic
});

// Optional: Load last quote on page load
window.addEventListener("load", () => {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importFile").addEventListener("change", importFromJsonFile);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categorySet = new Set(quotes.map(q => q.category));
  const filter = document.getElementById("categoryFilter");

  // Clear existing options except "All"
  filter.innerHTML = '<option value="all">All Categories</option>';

  categorySet.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
    filterQuotes();
  }
}

window.addEventListener("load", () => {
  populateCategories();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
});

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
  } else {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated endpoint

function fetchServerQuotes() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverData => {
      const serverQuotes = serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
      resolveConflicts(serverQuotes);
    })
    .catch(err => console.error("Server fetch failed:", err));
}

// Poll every 30 seconds
setInterval(fetchServerQuotes, 30000);

function resolveConflicts(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text);
    if (!exists) {
      quotes.push(sq);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    notifyUser("New quotes synced from server.");
  }
}

function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 5000);
}

function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      // Simulate server quotes
      return data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
    })
    .catch(error => {
      console.error("Error fetching server quotes:", error);
      return [];
    });
}

function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      notifyUser("Quotes synced from server. Conflicts resolved.");
    }
  });
}

setInterval(syncQuotes, 30000); // Sync every 30 seconds

function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log("Posted to server:", data);
    })
    .catch(error => {
      console.error("Error posting quote:", error);
    });
}

postQuoteToServer({ text, category });

