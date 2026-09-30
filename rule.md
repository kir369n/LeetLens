# LeetLens Workspace Rules

## 1. Sacred Reference Folders and Files

All existing folders and files outside `Redesigned LeetLens` are sacred reference materials.

They must be treated as read-only:

- The existing root LeetLens project files.
- The existing `Main-LeetLens` folder.
- All Python files, Streamlit pages, assets, documentation, configuration files, and other files outside `Redesigned LeetLens`.

These reference files may be inspected, read, and used to understand existing functionality or design. They must not be edited, renamed, deleted, moved, or overwritten.

## 2. Writable Project Folder

Only the following folder is writable:

```text
Redesigned LeetLens/
```

All new application code, configuration, assets, documentation, tests, generated files, and deployment files must be created inside this folder.

The redesigned project may contain and modify:

```text
Redesigned LeetLens/frontend/
Redesigned LeetLens/backend/
Redesigned LeetLens/plan.md
Redesigned LeetLens/rule.md
Redesigned LeetLens/master.md
```

`Redesigned LeetLens/prompts.md` is a protected instruction file. It must not be modified, renamed, deleted, moved, or overwritten during implementation unless the user explicitly requests a change to that file.

## 3. Required Separation

The redesigned application must be implemented as two separate applications:

```text
Redesigned LeetLens/
├── frontend/   React and Vite application
└── backend/    FastAPI application
```

The existing Streamlit application must not be modified as part of the redesign.

The existing `Main-LeetLens` portfolio template must not be modified as part of the redesign. Its visual design may be studied and recreated inside the new frontend.

## 4. Before Every File Operation

Before creating or modifying a file, verify that its path is inside:

```text
Redesigned LeetLens/
```

If the path is outside that folder, do not perform the operation.

Do not use destructive commands or operations against sacred reference folders and files, including:

- Delete
- Rename
- Move
- Overwrite
- In-place formatting
- Automated migrations
- Bulk replacements
- Dependency or configuration changes

## 5. Reference Usage

Reference folders and files may be used only for:

- Understanding existing LeetCode API queries.
- Understanding existing data shapes.
- Understanding existing analytics behavior.
- Understanding existing PDF and CSV functionality.
- Understanding the `Main-LeetLens` visual design.
- Reusing ideas and behavior by reimplementing them in the new project.

Code or assets should be copied into the redesigned project only when necessary and only by creating a new copy inside `Redesigned LeetLens`.

## 6. Validation and Testing

All development, testing, builds, generated output, and temporary project artifacts should target the new project inside `Redesigned LeetLens`.

Validation must confirm that:

- The frontend builds successfully.
- The backend starts successfully.
- The new frontend and backend communicate correctly.
- The original reference folders and files remain unchanged.
- No secrets are written into tracked files.

## 7. Deployment Files

Deployment files must be created only inside the redesigned project:

- `Redesigned LeetLens/frontend/vercel.json`
- `Redesigned LeetLens/frontend/.env.example`
- `Redesigned LeetLens/backend/render.yaml`
- `Redesigned LeetLens/backend/.env.example`

Production secrets must never be stored in the repository. Use Vercel and Render environment variables.

## 8. Rule Priority

These rules take priority over convenience during implementation.

If a change appears to require modifying a sacred reference file or folder, stop and request explicit permission before proceeding.

The default behavior is:

```text
Read existing folders and files.
Write only inside Redesigned LeetLens.
Never modify sacred reference materials.
```
