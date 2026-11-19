# The Saffron Plate - Contributor Code of Conduct & Contribution Guidelines

Thank you for your interest in contributing to **The Saffron Plate** fullstack restaurant web application. We are committed to fostering an inclusive, welcoming, and collaborative engineering community.

---

## 1. Contributor Code of Conduct

### 1.1 Our Pledge
In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### 1.2 Our Standards
Examples of behavior that contributes to creating a positive environment include:
- Using welcoming and inclusive language.
- Being respectful of differing viewpoints and architectural experiences.
- Gracefully accepting constructive criticism and code review feedback.
- Focusing on what is best for the culinary community and engineering quality.
- Showing empathy towards other team members and contributors.

---

## 2. Engineering Contribution Workflow

To maintain code hygiene, zero runtime defects, and effortless collaboration across academic and open-source contributors, please follow our standardized Git workflow:

```
                  ┌───────────────────────────────┐
                  │ Fork & Clone Upstream Repo    │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Create Semantic Branch        │
                  │ (docs/*, feat/*, fix/*)       │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Make Modular Atomic Commits   │
                  │ (Conventional Commits Spec)   │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Run Pre-Commit Syntax Checks  │
                  │ (node -c *.js)                │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Push to Fork & Submit PR      │
                  │ (Target: upstream main)       │
                  └───────────────────────────────┘
```

---

## 3. Conventional Commits Specification

All commit messages submitted to the repository must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <short descriptive summary in imperative mood>

[optional body explaining technical context or motivation]

[optional footer referencing issue or PR numbers]
```

### 3.1 Allowed Commit Types

| Type | Description & Usage Context |
| :--- | :--- |
| `docs` | Documentation additions, architecture manuals, JSDoc annotations, or README updates. |
| `feat` | New user-facing feature, API route handler, or frontend UI component. |
| `fix` | Bug repair, error handling patch, or syntax defect correction. |
| `refactor` | Code reorganization or optimization that neither fixes a bug nor adds a feature. |
| `style` | Formatting, whitespace, semicolon adjustment, or CSS aesthetic polish. |
| `test` | Adding automated test scripts, mock datasets, or test cases. |
| `chore` | Dependency updates, tooling configuration, or build script adjustments. |

### 3.2 Commit Message Examples
- `docs(api): document query parameters and error responses in API reference`
- `feat(reviews): add star rating filter to customer testimonials section`
- `fix(server): handle EADDRINUSE error with graceful port increment`
- `style(css): adjust gold accent hover shadow on hero CTA buttons`

---

## 4. Pull Request Submission Checklist

Before opening a Pull Request against the upstream repository:

- [ ] **Descriptive Title**: Provide a clear, conventional pull request title (e.g. `docs: add comprehensive REST API reference manual`).
- [ ] **Summary of Changes**: Detail the motivation, files touched, and technical context in the pull request description body.
- [ ] **Zero Logic Regressions**: Ensure no existing functionality, layout styling, or database contracts have been inadvertently altered.
- [ ] **Syntax & Linting**: Confirm that all modified JavaScript files pass syntax parsing (`node -c <file>`).
- [ ] **Branch Cleanliness**: Rebase or sync your working branch with the latest upstream `main` branch before submitting to prevent merge conflicts.
- [ ] **Single Domain Scope**: Keep pull requests focused on a single feature, bug fix, or documentation scope rather than bundling unrelated modifications.
