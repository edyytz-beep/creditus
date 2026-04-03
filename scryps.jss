window.addEventListener("DOMContentLoaded", () => {
  const issueTitle = document.getElementById("issueTitle");
  const issueDescription = document.getElementById("issueDescription");
  const createIssueBtn = document.getElementById("createIssueBtn");
  const statusMessage = document.getElementById("statusMessage");

  async function createIssue() {
    const title = issueTitle.value.trim();
    const description = issueDescription.value.trim();

    if (!title) {
      statusMessage.textContent = "Introdu titlul.";
      return;
    }

    statusMessage.textContent = "Se trimite...";

    try {
      const response = await fetch("/api/create-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (data.error) {
        statusMessage.textContent = data.error;
        return;
      }

      if (data.success && data.issue) {
        statusMessage.innerHTML = `✅ Issue creat: <a href="${data.issue.url}" target="_blank">${data.issue.identifier}</a>`;
      } else {
        statusMessage.textContent = "Nu s-a creat issue.";
      }

    } catch (err) {
      console.error(err);
      statusMessage.textContent = "Eroare conexiune.";
    }
  }

  createIssueBtn.addEventListener("click", createIssue);
});
