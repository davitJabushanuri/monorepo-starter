# 🚀 Monorepo Starter Template

A production-ready monorepo template using modern tooling:

- 🏗️ Monorepo: Turborepo
- 🧑‍💻 Framework: Next.js
- 🧪 Testing: Bun Test (unit) + Playwright (e2e)
- 🧹 Linting: Biome
- 🧾 Typing: TypeScript
- 🚦 CI/CD: GitHub Actions
- 🧩 Commit Style: Conventional Commits (w/ linting)
- 🚀 Release: Semantic Release (auto versioning + changelog)
- 📦 Package Manager: Bun

---

## 🛠️ Getting Started

```bash
bun install
bun dev
```

---

## 📦 Scripts

| Command | Description |
|--------|-------------|
| `bun dev` | Run the dev server |
| `bun build` | Build all apps |
| `bun lint` | Run Biome (lint + format) |
| `bun typecheck` | Run TypeScript type checking |
| `bun test` | Run unit tests with Bun Test |
| `bun test:e2e` | Run E2E tests with Playwright |

---

## 🧪 Testing

### Unit Tests

```bash
bun test
```

### E2E Tests

```bash
bun test:e2e
```

To install Playwright browsers for CI:

```bash
bun test:e2e:install:ci
```

---

## ✅ Git Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) + commitlint.

Example:

```bash
git commit -m "feat(auth): add login flow (#123)"
```

> Make sure to include the task ID in your commit message if using Jira.

---

## 🔄 Releases

We use [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) for automated versioning and changelogs.

### To manually trigger a release

```bash
bun release
```

> Releasing is automatically triggered on `main` via GitHub Actions.

---

## 🔧 GitHub Actions CI

- ✅ Linting (Biome)
- ✅ TypeScript type checking
- ✅ Bun Test (unit tests)
- ✅ Playwright tests
- ✅ Semantic release (on push to `main`)

Check `.github/workflows/` for full config.

---

## 🧩 Project Structure

```text
.
├── apps/
│   ├── web/                 # Main Next.js app
│   └── docs/                # Documentation app
├── packages/
│   ├── ui/                  # Shared component library
│   └── typescript-config/   # Shared TypeScript configs
├── .github/
│   └── workflows/           # CI config
├── turbo.json               # Turborepo config
├── biome.json               # Biome config
├── bunfig.toml              # Bun config
└── package.json
```

---

## 🛡️ Security

- ✅ Biome security checks
- ✅ Playwright E2E auth flows
- 🔒 Add tools like Snyk, CodeQL for deeper scans (optional)

---

## 📋 Changelog

Maintained by `semantic-release` in [`CHANGELOG.md`](./CHANGELOG.md)

---

## 📦 Versioning

Semantic release automatically:

- Bumps version based on commit history
- Updates `CHANGELOG.md`
- Creates GitHub release

---

## 🧠 License

MIT © [Your Name or Team]
