const LINEAR_URL = "https://api.linear.app/graphql";
const TEAM_KEY = "CRE";

async function linearRequest(query, variables = {}) {
  const response = await fetch(LINEAR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.LINEAR_API_KEY
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  return response.json();
}

async function getTeamIdByKey(teamKey) {
  const query = `
    query Teams {
      teams {
        nodes {
          id
          key
          name
        }
      }
    }
  `;

  const result = await linearRequest(query);

  if (result.errors) {
    throw new Error(result.errors[0].message || "Nu pot încărca echipele.");
  }

  const teams = result?.data?.teams?.nodes || [];
  const team = teams.find((item) => item.key === teamKey);

  if (!team) {
    throw new Error("Nu am găsit echipa CRE.");
  }

  return team.id;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.LINEAR_API_KEY) {
      return res.status(500).json({ error: "LINEAR_API_KEY nu este setată în Vercel." });
    }

    const { title, description } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Titlul este obligatoriu." });
    }

    const teamId = await getTeamIdByKey(TEAM_KEY);

    const mutation = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            url
          }
        }
      }
    `;

    const variables = {
      input: {
        teamId,
        title: title.trim(),
        description: (description || "").trim()
      }
    };

    const result = await linearRequest(mutation, variables);

    if (result.errors) {
      return res.status(400).json({
        error: result.errors[0].message || "Eroare la crearea issue-ului."
      });
    }

    const payload = result?.data?.issueCreate;

    return res.status(200).json({
      success: payload?.success || false,
      issue: payload?.issue || null
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Eroare internă."
    });
  }
};
