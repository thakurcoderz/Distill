# Generate Project Guidelines

Analyze the current project and create comprehensive development guidelines based on the project structure, tech stack, and existing code patterns.

## Instructions

1. **Analyze the Project Structure**
   - Read `package.json` to identify dependencies and tech stack
   - Examine the directory structure (`src/`, `app/`, `components/`, etc.)
   - Review existing code files to understand patterns and conventions
   - Check for configuration files (`tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, etc.)

2. **Identify Key Technologies**
   - Framework (Next.js, React, etc.)
   - Language (TypeScript, JavaScript)
   - Styling (Tailwind CSS, CSS Modules, etc.)
   - Build tools and linters
   - Testing frameworks (if any)
   - Content management (Markdown, CMS, etc.)

3. **Extract Code Patterns**
   - Component structure and naming conventions
   - File organization patterns
   - Import/export patterns
   - Type definitions and interfaces
   - Styling approaches
   - Routing patterns (if applicable)

4. **Generate GUIDELINES.md**
   Create a comprehensive guidelines document that includes:

   ### Required Sections:
   
   - **Project Overview**: Brief description of the project
   - **Tech Stack**: List of technologies used
   - **Code Style**: 
     - Language-specific conventions (TypeScript/JavaScript)
     - Naming conventions (files, components, variables)
     - Code formatting rules
   - **Project Structure**: 
     - Directory organization
     - File naming conventions
     - Where to place new files
   - **Component Guidelines** (if React/Next.js):
     - Component structure
     - Props patterns
     - State management
     - Client vs Server components
   - **Styling Guidelines**:
     - CSS framework usage
     - Class naming conventions
     - Responsive design patterns
     - Theme management (if applicable)
   - **Git Workflow**:
     - Branch naming conventions
     - Commit message format
     - PR guidelines
   - **Testing Guidelines** (if applicable):
     - Testing approach
     - Test file locations
     - Coverage expectations
   - **Performance Considerations**:
     - Optimization practices
     - Bundle size management
     - Image optimization
   - **Common Patterns**:
     - Code examples from the project
     - Do's and Don'ts
     - Best practices

5. **Update or Create GUIDELINES.md**
   - Write the guidelines document
   - Use clear sections with headers
   - Include code examples from the actual project
   - Reference specific files/folders when relevant
   - Add a table of contents for easy navigation

## Example Output Structure

```markdown
# Development Guidelines

[Project-specific guidelines based on analysis]

## 📋 Table of Contents
- [Code Style](#code-style)
- [Project Structure](#project-structure)
- [Component Guidelines](#component-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Performance Considerations](#performance-considerations)

## 🎨 Code Style
[Based on actual code patterns found]

## 📁 Project Structure
[Based on actual directory structure]

## ⚛️ Component Guidelines
[Based on React/Next.js patterns found]

## 🎨 Styling Guidelines
[Based on CSS/Tailwind usage]

## 🔄 Git Workflow
[Standard or project-specific workflow]

## 🧪 Testing Guidelines
[If testing is set up]

## ⚡ Performance Considerations
[Framework-specific optimizations]
```

## Notes

- Use actual code examples from the project when possible
- Reference specific files and folders
- Include both positive examples (✅ Good) and negative examples (❌ Bad)
- Make guidelines actionable and specific
- Consider the project's complexity and scale
- Include links to relevant documentation
- Add troubleshooting section if common issues are identified

## When to Use

- When starting a new project
- When onboarding new team members
- When refactoring or standardizing code
- When project structure changes significantly
- When adding new technologies or patterns
