# Interactive Data Visualization Dashboard

A web-based application for data enthusiasts, analysts, and students who want a quick and intuitive way to visualize datasets.  
Users can upload a dataset (CSV or JSON) and the application will automatically generate interactive charts and graphs.  
The goal is to provide an accessible, lightweight, and powerful tool for exploring data without requiring advanced coding skills or heavy software.

---

## Features

- Upload datasets (CSV, JSON)
- Automatic parsing and transformation of data
- Interactive visualizations (line, bar, pie, scatter, etc.)
- Responsive dashboard layout
- Built with modern web technologies

Planned features:

- Save datasets and dashboards
- User authentication
- Shareable dashboards
- Custom chart builder

---

## Tech Stack

- **Languages:** JavaScript (ES6+), HTML5, CSS3  
- **Frontend:** Angular + Tailwind CSS  
- **Data Visualization:** Recharts (elegant charts), D3.js (advanced custom visualizations)  
- **Data Parsing:** [PapaParse](https://www.papaparse.com/) (CSV parser)  
- **Backend:** Node.js with Express (file upload handling using Multer)  
- **Testing:** Jest (frontend + backend)  

---

## Getting Started

### Prerequisites

- Node.js v22+  
- Angular CLI v20+  
- npm 11+

### Installation

```bash
# Clone repository
git clone hhttps://github.com/hmoustaphaousmane/ai-4-dev-ii-capston-project.git
cd ai-4-dev-ii-capston-project

# Install dependencies
npm install
````

### Running the Application

```bash
# Start frontend
ng serve

# Start backend
npm run dev
```

Frontend will be available at `http://localhost:4200`
Backend server runs at `http://localhost:3000`

---

## Testing

This project uses **Jest** instead of Jasmine/Karma for consistency across frontend and backend.

Run tests:

```bash
npm test
```

- Unit tests: validate data parsing, transformation, and chart rendering logic

* Integration tests: verify file upload → data parsing → chart visualization flow

---

## AI Integration Strategy

AI tools will be used to **accelerate development** and **boost productivity**.

- **Code Generation**: Scaffold Angular components (`chart-wrapper.component.ts`, `upload-form.component.ts`, `dashboard-layout.component.ts`), boilerplate Express routes, and utility functions.
- **Testing**: Generate Jest test suites for parsing, edge cases, and integration scenarios.
- **Documentation**: Auto-generate JSDoc comments, inline explanations, and drafts for README/CONTRIBUTING.
- **Bug Fixing**: Use AI to suggest fixes by feeding it error logs and snippets.
- **In-Editor AI Tooling**: GitHub Copilot for code completion, refactoring, PR reviews, and commit message generation.

**Note:** All AI-generated code will be **reviewed by developers** to ensure correctness, security, and maintainability.

---

## Prompting Strategy

Example prompts we’ll use with AI:

- **Component Generation**:
  `"Using Recharts, create an Angular component that displays a responsive line chart. The component should accept data and dataKey props. Include a tooltip and a legend."`

- **Testing**:
  `"Generate a Jest unit test suite for the parseCsvData function. The tests should cover a valid CSV string, an empty string, and a string with malformed data, asserting the function returns the expected JSON structure."`

---

## Roadmap

- [x] File upload (CSV/JSON)
- [x] Basic chart rendering (line, bar, pie)
- [ ] Save uploaded datasets
- [ ] Authentication and user accounts
- [ ] Dashboard sharing
- [ ] Advanced chart customization

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages
4. Open a Pull Request

We use conventional commit messages and GitHub PR templates to ensure smooth collaboration.

---

## License

This project is licensed under the **MIT License**.
See [LICENSE](./LICENSE) for details.
