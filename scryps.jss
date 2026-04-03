const createIssueBtn = document.getElementById("createIssueBtn");
const issueTitle = document.getElementById("issueTitle");
const issueDescription = document.getElementById("issueDescription");
const statusMessage = document.getElementById("statusMessage");

function createIssue() {
    const title = issueTitle.value.trim();
    const description = issueDescription.value.trim();

    if (!title) {
        statusMessage.textContent = "Introdu titlul.";
        return;
    }

    statusMessage.textContent = `Demo trimis cu succes: ${title}`;
    console.log("Titlu:", title);
    console.log("Descriere:", description);

    issueTitle.value = "";
    issueDescription.value = "";
}

createIssueBtn.addEventListener("click", createIssue);
