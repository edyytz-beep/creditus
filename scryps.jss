window.addEventListener("DOMContentLoaded", () => {
  const issueTitle = document.getElementById("issueTitle");
  const issueDescription = document.getElementById("issueDescription");
  const createIssueBtn = document.getElementById("createIssueBtn");
  const statusMessage = document.getElementById("statusMessage");

  if (!issueTitle || !issueDescription || !createIssueBtn || !statusMessage) {
    console.error("Lipsesc elemente din HTML.");
    return;
  }

  async function createIssue() {
    const title = issueTitle.value.trim();
    const description = issueDescription.value.trim();

    if (!title) {
      statusMessage.textContent = "Introdu titlul.";
      return;
    }

    statusMessage.textContent = "Se trimite în Linear...";

    try {
      const response = await fetch("/api/create-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        statusMessage.textContent = data.error || "A apărut o eroare.";
        return;
      }

      if (data.success && data.issue) {
        statusMessage.innerHTML = `Issue creat: <a href="${data.issue.url}" target="_blank">${data.issue.identifier} - ${data.issue.title}</a>`;
        issueTitle.value = "";
        issueDescription.value = "";
      } else {
        statusMessage.textContent = "Issue-ul nu a fost creat.";
      }
    } catch (error) {
      console.error(error);
      statusMessage.textContent = "Eroare de conectare.";
    }
  }

  createIssueBtn.addEventListener("click", createIssue);
});
