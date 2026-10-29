const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle.querySelector(".theme-label");

themeToggle.addEventListener("click", () => {
    const lightThemeEnabled = document.body.classList.toggle("light-theme");
    const nextTheme = lightThemeEnabled ? "dark" : "light";

    themeLabel.textContent = lightThemeEnabled ? "Dark mode" : "Light mode";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    document.querySelector('meta[name="theme-color"]')
        .setAttribute("content", lightThemeEnabled ? "#f3f5fa" : "#101522");
});

async function callEndpoint(button, responsePanel, path, formatResponse) {
    const originalLabel = button.querySelector("span:first-child").textContent;
    button.disabled = true;
    button.querySelector("span:first-child").textContent = "Loading...";
    responsePanel.className = "response-panel";
    responsePanel.innerHTML = '<div class="response-heading"><span class="response-dot"></span> RESPONSE</div><p class="response-placeholder">Requesting endpoint...</p>';

    try {
        const response = await fetch(path, {
            headers: { Accept: path === "/api/status" ? "application/json" : "text/plain" }
        });

        if (!response.ok) {
            throw new Error(`Request failed with HTTP ${response.status}`);
        }

        const data = path === "/api/status" ? await response.json() : await response.text();
        responsePanel.classList.add("has-success");
        responsePanel.innerHTML =
            '<div class="response-heading"><span class="response-dot"></span> RESPONSE · 200 OK</div>' +
            formatResponse(data);
    } catch (error) {
        responsePanel.classList.add("has-error");
        responsePanel.innerHTML =
            '<div class="response-heading"><span class="response-dot"></span> REQUEST ERROR</div>' +
            `<p class="response-message">${escapeHtml(error.message)}. Make sure the Spring Boot application is running.</p>`;
    } finally {
        button.disabled = false;
        button.querySelector("span:first-child").textContent = originalLabel;
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.getElementById("hello-button").addEventListener("click", (event) => {
    callEndpoint(
        event.currentTarget,
        document.getElementById("hello-response"),
        "/api/hello",
        (message) => `<p class="response-message">${escapeHtml(message)}</p>`
    );
});

document.getElementById("status-button").addEventListener("click", (event) => {
    callEndpoint(
        event.currentTarget,
        document.getElementById("status-response"),
        "/api/status",
        (status) => `<pre>${escapeHtml(JSON.stringify(status, null, 2))}</pre>`
    );
});
