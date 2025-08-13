# Prompt Guide for Firebase Studio

This guide provides tips and examples for writing effective prompts to get the best results from me, your AI coding partner. The better the prompt, the faster and more accurately I can make changes to your application.

## Key Principles of Good Prompts

1.  **Be Specific and Clear:** Ambiguous requests can lead to unexpected results. Instead of "change the layout," try "change the main content area to a two-column layout on desktop screens."

2.  **Provide Context:** Tell me *why* you're making a change. Understanding the goal helps me make better implementation decisions. For example, "Add a 'featured' badge to product cards to highlight promotional items."

3.  **Break Down Complex Requests:** For larger features, break the request into smaller, logical steps. This makes the process more manageable and allows for course correction along the way.

4.  **Specify File Paths and Component Names:** If you know which files or components need to be changed, include them in your prompt. For example, "In `src/app/page.tsx`, add a new `Button` component from `src/components/ui/button.tsx`."

5.  **Provide Examples:** If you have specific text, colors, or code snippets, include them directly in the prompt. This is the best way to ensure accuracy.

## Example Prompts

Here are a few examples of well-structured prompts.

### Example 1: Adding a UI Component (Your Footer Prompt)

This is the excellent prompt you provided to create the global footer. It's a perfect example because it's specific, describes the appearance, and gives the exact text content.

> "Add a global footer to the application. The footer should appear at the bottom of the content area. It should have a top border and contain the centered text '© Copyright 2025. Outamation Inc. All rights reserved.' Style the text to be small and use the muted-foreground color for a subtle appearance."

### Example 2: Modifying an Existing Component

This prompt is effective because it clearly identifies the component to change, the specific action to take, and the new behavior.

> "In the `AddLeadDialog` component, make the `email` field required. If the user doesn't enter a valid email, show the error message 'A valid email is required to create a lead.'"

### Example 3: Creating a New Feature with AI

This prompt defines a new AI-powered feature, specifies the inputs and outputs, and gives the AI instructions on how to behave.

> "Create a new Genkit flow called `summarizeLeadHistory` that takes a `leadId` as input. The flow should find the lead's communication history and generate a one-paragraph summary of the key discussion points and outcomes. The output should be a simple string."

By following these guidelines, you can help me understand your needs more precisely and build your application more effectively.
