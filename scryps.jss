const issueTitle = document.getElementById("issueTitle");
const issueDescription = document.getElementById("issueDescription");
const createIssueBtn = document.getElementById("createIssueBtn");
const statusMessage = document.getElementById("statusMessage");

async function createIssue() {
    const title = issueTitle.value.trim();
    const description = issueDescription.value.trim();

    if (!title) {
        statusMessage.textContent = "Introdu titlul issue-ului.";
        return;
    }

    statusMessage.textContent = "Trimit issue-ul în Linear...";

    try {
        const response = await fetch("/create-issue", {
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

        if (data.error) {
            statusMessage.textContent = data.error;
            return;
        }

        if (data.errors) {
            console.error(data.errors);
            statusMessage.textContent = "Linear a returnat o eroare.";
            return;
        }

        const payload = data?.data?.issueCreate;

        if (payload?.success && payload?.issue) {
            statusMessage.innerHTML = `Issue creat: <a href="${payload.issue.url}" target="_blank">${payload.issue.identifier} - ${payload.issue.title}</a>`;
            issueTitle.value = "";
            issueDescription.value = "";
        } else {
            statusMessage.textContent = "Issue-ul nu a fost creat.";
        }
    } catch (error) {
        console.error(error);
        statusMessage.textContent = "Eroare de conectare la server.";
    }
}

createIssueBtn.addEventListener("click", createIssue);
