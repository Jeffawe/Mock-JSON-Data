const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock GitHub Issues endpoint
server.post("/repos/:owner/:repo/issues", (req, res) => {
  // Validate required fields
  const { title, body, assignees, milestone, labels } = req.body;
  
  if (!title) {
    return res.status(422).json({
      message: "Validation Failed",
      errors: [
        {
          resource: "Issue",
          field: "title",
          code: "missing_field"
        }
      ]
    });
  }

  // Mock successful response
  const mockIssue = {
    id: Math.floor(Math.random() * 1000000),
    node_id: "MDU6SXNzdWU" + Math.floor(Math.random() * 1000000),
    url: `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/issues/${Math.floor(Math.random() * 100)}`,
    repository_url: `https://api.github.com/repos/${req.params.owner}/${req.params.repo}`,
    html_url: `https://github.com/${req.params.owner}/${req.params.repo}/issues/${Math.floor(Math.random() * 100)}`,
    number: Math.floor(Math.random() * 100),
    state: "open",
    title: title,
    body: body || "",
    user: {
      login: "mockuser",
      id: 1,
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      type: "User"
    },
    labels: labels ? labels.map(label => ({
      id: Math.floor(Math.random() * 10000),
      name: label,
      color: "d73a4a",
      default: label === "bug"
    })) : [],
    assignees: assignees ? assignees.map(assignee => ({
      login: assignee,
      id: Math.floor(Math.random() * 10000),
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 10000)}?v=4`,
      type: "User"
    })) : [],
    milestone: milestone ? {
      id: milestone,
      number: milestone,
      title: "v1.0",
      state: "open"
    } : null,
    comments: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    closed_at: null,
    author_association: "OWNER",
    locked: false
  };

  res.status(201).json(mockIssue);
});

server.use(router);

server.listen(process.env.PORT || 3000, () => {
  console.log("JSON Server is running");
  console.log("Mock GitHub endpoint available at: POST /repos/:owner/:repo/issues");
});