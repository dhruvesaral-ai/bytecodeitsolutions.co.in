# UI Design Rules

These rules define the visual and interaction standards for this project. Apply them to all new UI and when improving existing screens. The goal is a clean, intentional, production-quality interface—not a generic AI-generated SaaS template.

## 1. Core Principles

- Prioritize usability, clarity, hierarchy, consistency, and accessibility.
- Prefer simple, purposeful design over decoration.
- Use spacing, typography, alignment, and contrast to create visual polish.
- Every visual element must serve a clear purpose.
- Do not add a component or visual effect merely because it looks modern.
- Follow the project's existing design system and component patterns.
- Make the smallest coherent change needed; do not redesign unrelated areas.
- Keep interfaces consistent across pages, dialogs, forms, tables, and responsive layouts.

## 2. Avoid Generic AI UI Patterns

Do not use these by default:

- Gradients or gradient text.
- Glassmorphism, frosted-glass effects, or excessive transparency.
- Glows, neon borders, decorative blobs, and unnecessary background patterns.
- Excessive shadows or layered cards.
- Pill-shaped badges and capsules everywhere.
- Overly rounded cards, buttons, inputs, and containers.
- Decorative icons or illustrations that add no information.
- Unnecessary colored dots, badges, borders, and icons all communicating the same thing.
- Too many nested cards or boxes inside other cards.
- Animations that do not help users understand an action or state.

Use these only when the product's established design system specifically calls for them or when they serve a clear functional purpose.

## 3. Color

- Use the existing project color tokens and theme. Do not invent a new palette for an individual screen.
- Prefer solid backgrounds and restrained accent colors.
- Use accent colors to indicate primary actions, focus, selection, links, and meaningful states.
- Keep most surfaces neutral and maintain readable contrast.
- Do not color every card, icon, heading, or label.
- Do not use color as the only way to communicate status; include text or another accessible cue.
- Use semantic colors consistently: success, warning, error, and informational.
- Avoid pale colored backgrounds and borders on every component.
- Do not introduce gradients unless explicitly requested or already required by the design system.

## 4. Typography and Hierarchy

- Use the project's existing font family and type scale.
- Establish hierarchy through font size, weight, spacing, and placement.
- Keep page titles clear and prominent without decorative icons.
- Use readable line lengths and consistent text styles.
- Avoid making every label bold or every piece of text a different shade.
- Use muted text for secondary information, while maintaining sufficient contrast.
- Avoid unnecessary uppercase labels, letter spacing, and tiny text.
- Do not replace clear text labels with obscure abbreviations.

## 5. Icons: Minimal by Default

Icons must improve recognition, navigation, or interaction. Do not use them as decoration.

### Use an icon when:
- It is a widely recognized control or action, such as search, close, edit, delete, filter, or menu.
- It helps users scan a navigation menu consistently.
- It communicates a state or action more clearly than text alone.
- It is needed for an icon-only control, with an accessible name and tooltip where appropriate.

### Avoid an icon when:
- A heading or page title is already clear.
- A text button such as **Save**, **Cancel**, **Create project**, or **Submit** is self-explanatory.
- It is added to every statistic card just to fill empty space.
- It repeats information already expressed by text, a status label, or a colored indicator.
- It appears beside every field label, metadata item, table heading, or paragraph.
- It is purely decorative or makes the layout more cluttered.

### Icon consistency
- Reuse the icon library already installed in the project.
- Do not add another icon package without a real need.
- Keep icon sizes, stroke weights, and alignment consistent.
- Avoid mixing icon styles or using emoji as interface icons.
- Icon-only buttons must have accessible labels; provide tooltips where the action may not be obvious.
- Do not add icons to existing components automatically. Review whether each one is necessary.

**Decision test:** Before adding an icon, ask: “Would removing this icon make the interface harder to understand or use?” If not, leave it out.

## 6. Buttons and Actions

- Make the primary action visually obvious; keep secondary actions quieter.
- Use clear, action-oriented button labels.
- Do not add icons to every button.
- Avoid making every button a large, brightly colored, rounded pill.
- Keep button heights, padding, radii, and variants consistent.
- Use destructive styling only for destructive actions.
- Avoid multiple competing primary buttons in the same section.
- Show loading, disabled, success, and error states when relevant.
- Prevent duplicate submissions when an action is in progress.
- Use confirmation for destructive or difficult-to-reverse actions when appropriate.

## 7. Badges and Status Labels

- Use badges only when they make status, category, or classification easier to scan.
- Prefer plain text or a subtle compact badge over a pill-shaped capsule.
- Do not put every plan name, heading, or ordinary label inside a badge.
- Do not add an icon and a colored dot to a badge unless both convey distinct useful information.
- Use semantic colors consistently and sparingly.
- Keep badge wording short and meaningful.
- Avoid excessive outlines, bright fills, gradients, and fully rounded shapes.
- Do not style ordinary text as a status badge just to make it look polished.

## 8. Cards, Containers, Borders, and Shadows

- Use a card only when it groups related content or establishes useful hierarchy.
- Do not wrap every section, paragraph, metric, or form field in a separate card.
- Prefer a simple page layout with spacing and subtle dividers where possible.
- Avoid nested cards unless the hierarchy genuinely requires them.
- Use subtle borders to separate surfaces when needed.
- Keep shadows rare and low contrast.
- Use consistent corner radii, generally around 6–8px for standard controls and modestly larger for major containers, following existing project tokens.
- Do not use excessive rounding on every element.
- Avoid decorative borders and multiple outlines around the same content.
- Ensure content remains easy to scan without relying on shadows or colored surfaces.

## 9. Layout and Spacing

- Use a consistent spacing scale from the existing design system.
- Align headings, controls, cards, tables, and content edges deliberately.
- Give sections enough breathing room without wasting space.
- Avoid arbitrary gaps and inconsistent padding.
- Do not add empty decorative space solely to make a screen appear premium.
- Keep related items close and separate unrelated sections.
- Establish hierarchy with spacing rather than adding more containers.
- Avoid crowding the screen with too many controls or visual accents.
- Ensure layouts adapt cleanly to mobile, tablet, and desktop.

## 10. Forms and Inputs

- Keep forms clear, predictable, and easy to scan.
- Use visible labels for inputs; do not rely on placeholders as the only label.
- Add helper text only when it clarifies a requirement or prevents errors.
- Do not add icons inside every input by default.
- Use appropriate input types, validation, and error messages.
- Explain how to correct an error, not merely that an error occurred.
- Group related fields logically.
- Keep required-field indicators consistent.
- Use clear focus, disabled, invalid, and success states.
- Avoid decorative panels around each individual field.

## 11. Tables, Lists, and Data-Dense Screens

- Optimize for readability and quick scanning.
- Use clear column headings, consistent alignment, and appropriate row spacing.
- Keep table actions understandable and avoid adding multiple icons to every row.
- Use an overflow menu when there are several secondary row actions.
- Use status labels only where they convey useful information.
- Do not turn every table cell into a badge or colored component.
- Preserve sorting, filtering, pagination, selection, and keyboard interactions where applicable.
- On narrow screens, use a considered responsive strategy rather than squeezing every column.

## 12. Navigation

- Keep navigation labels clear and consistent.
- Use icons only when they help users recognize destinations; apply them consistently across equivalent items.
- Do not add decorative icons to section headings just because navigation uses icons.
- Clearly distinguish active, hover, focus, and disabled states.
- Avoid unnecessary separators, badges, counters, and nested navigation levels.
- Do not change established navigation behavior without a functional reason.

## 13. Data Visualization and Metrics

- Make the value, label, units, and relevant comparison the focus.
- Do not add an arbitrary icon to every metric card.
- Use charts only when they reveal a pattern or comparison more clearly than text.
- Label axes, units, and legends clearly.
- Use the existing palette and avoid unnecessary chart decoration.
- Do not use color alone to communicate meaning.
- Avoid misleading scales, unnecessary 3D effects, and decorative chart elements.

## 14. Motion and Interaction

- Use animation only when it helps communicate a state change, navigation, feedback, or spatial relationship.
- Keep transitions subtle and brief.
- Avoid bouncing, pulsing, shimmer, or looping effects for decoration.
- Respect reduced-motion preferences.
- Provide visible hover, focus, active, disabled, loading, and error states where appropriate.
- Interactions must behave as their appearance suggests; do not create decorative or nonfunctional controls.

## 15. Accessibility

- Maintain sufficient color contrast.
- Ensure interactive elements are keyboard accessible.
- Use semantic HTML and correct labels.
- Provide accessible names for icon-only buttons and controls.
- Do not rely on color alone for status, errors, or selection.
- Keep focus indicators visible.
- Ensure text can be resized and layouts reflow appropriately.
- Respect reduced-motion settings.

## 16. Responsive Design

- Design for small screens as well as desktop.
- Prevent horizontal overflow and clipped content.
- Keep touch targets comfortable and controls usable.
- Reflow multi-column layouts when space is limited.
- Do not hide essential actions on mobile without a clear alternative.
- Test long labels, empty states, loading states, and validation messages at different widths.

## 17. Content and Empty States

- Use concise, specific, helpful copy.
- Avoid generic filler text and redundant descriptions.
- Explain what users can do next when a page has no data.
- Use illustrations only when they genuinely help; do not add decorative artwork by default.
- Make error messages actionable and distinguish errors from empty states.
- Do not add an icon to every message, title, or information block.

## 18. Consistency and Existing Components

- Inspect the existing design system, theme tokens, and reusable components before building new ones.
- Reuse existing components and patterns instead of creating near-duplicates.
- Do not introduce new fonts, colors, radii, shadows, icon libraries, or UI frameworks without a clear reason.
- Keep behavior and visual conventions consistent across the product.
- Avoid broad refactors when the task only requires a focused UI change.
- Do not modify business logic or functionality merely to change visual styling.

## 19. Required UI Review Before Finishing

After implementing or editing a screen:

1. Remove icons that do not improve usability.
2. Remove unnecessary gradients, glow effects, decorative backgrounds, and excessive shadows.
3. Replace unnecessary pill badges with plain text or subtle labels.
4. Remove redundant borders, nested cards, and repeated colored indicators.
5. Check alignment, spacing, typography, and visual hierarchy.
6. Verify contrast, keyboard access, focus states, and responsive behavior.
7. Confirm that all controls work and that styling changes have not broken functionality.
8. Compare the result against the project's existing design system.
9. Keep the interface purposeful: every visible element should communicate information or support an action.

## 20. Final Design Standard

The finished UI should feel:

- Clean and restrained.
- Professional and product-focused.
- Easy to scan and navigate.
- Consistent across the application.
- Accessible and responsive.
- Polished through fundamentals, not decoration.

**Default principle:** start with the simplest usable design, then add a visual element only when it has a clear functional or informational benefit.

Do not interpret “modern” or “premium” as permission to add gradients, pills, icons, shadows, or decorative effects everywhere.
