---
name: audit-frontend
description: Audit the frontend implementation against pencil designs and brand guidelines, flagging gaps, missing components, unconnected elements, and inconsistencies. Use this skill after apply_frontend to verify implementation quality, or independently when the user says things like "audit the frontend", "check design consistency", "what's missing in the UI", "compare code to design", "find design gaps", "review the implementation". This is the quality gate before shipping — it catches what was missed, flags what's unconnected, and offers actionable next steps.
---

# Audit Frontend

Systematically compare the implemented frontend against pencil.dev designs and brand-guidelines.md, identifying gaps, inconsistencies, missing states, and unconnected components. This is the quality gate between implementation and shipping.

## When to Use

Trigger when the user:
- Has just completed `apply_frontend` and wants to verify the work
- Says "audit", "check the implementation", "what's missing", "review the UI"
- Wants a gap analysis between design and code
- Needs to know what's unconnected or non-functional before launch

## Workflow

### 1. Establish Audit Scope

Determine what to audit:
```
Audit scope:
- [ ] All pages or specific pages?
- [ ] Full component library or specific components?
- [ ] Include responsive behavior?
- [ ] Include accessibility?
- [ ] Include performance?
```

### 2. Visual Accuracy Audit

For each page, compare the running application against the pencil frame:

#### Method
1. Take a screenshot of the implemented page
2. Compare against the pencil frame
3. Check at each breakpoint (desktop, tablet, mobile)

#### Check Each Element
| Check | Pass? | Notes |
|-------|-------|-------|
| Layout structure matches | | |
| Color values correct | | |
| Typography correct | | |
| Spacing/padding correct | | |
| Shadows/borders match | | |
| Images/icons correct | | |
| Content alignment correct | | |

### 3. Interactive States Audit

For every interactive element, verify ALL states exist:

#### Buttons
- [ ] Default state
- [ ] Hover state (color change, shadow)
- [ ] Active/pressed state
- [ ] Focus state (visible focus ring)
- [ ] Disabled state (opacity, cursor)
- [ ] Loading state (if applicable)

#### Input Fields
- [ ] Empty state with placeholder
- [ ] Filled state
- [ ] Focus state (border highlight)
- [ ] Error state (red border + message)
- [ ] Disabled state
- [ ] Read-only state (if applicable)

#### Cards / Interactive Containers
- [ ] Default state
- [ ] Hover state (if clickable)
- [ ] Selected/active state (if selectable)

#### Navigation
- [ ] Default link state
- [ ] Hover state
- [ ] Active/current page state
- [ ] Mobile collapsed state
- [ ] Mobile expanded state

#### Dropdowns / Selects
- [ ] Closed state
- [ ] Open state
- [ ] Item hover
- [ ] Selected item indicator
- [ ] Multi-select (if applicable)

### 4. Missing Component Audit

Check for components that are needed but weren't designed or implemented:

#### Common Missing Items
- **Tooltips**: Are they on icons/truncated text?
- **Loading states**: Skeleton screens or spinners on every data-fetching view?
- **Empty states**: What shows when a list has 0 items?
- **Error states**: What shows when data fails to load?
- **Confirmation dialogs**: Are destructive actions confirmed?
- **Toast/notifications**: How does the system communicate success/failure?
- **Pagination**: Are long lists paginated?
- **Search**: Is search functional and styled?
- **Breadcrumbs**: Are they present where navigation depth > 2?
- **404 page**: Is it styled consistently?
- **Form validation**: All form fields have validation feedback?
- **Scroll behavior**: Is there virtual scrolling for long lists?

### 5. Unconnected Elements Audit

Identify elements that are visually present but not functional:

```markdown
## Unconnected Elements

### Critical (Affects Core Flow)
| Element | Location | Issue | Suggested Fix |
|---------|----------|-------|---------------|
| "Create Project" button | Dashboard | onClick is empty | Wire to /projects/new route |
| Search bar | Header | No search logic | Connect to search API or client-side filter |

### Non-Critical (Nice to Have)
| Element | Location | Issue | Suggested Fix |
|---------|----------|-------|---------------|
| "Export" button | Reports page | UI only | Could connect to CSV/PDF export |
| Activity feed | Dashboard sidebar | Mock data | Needs activity API endpoint |

### New Features (From Design, Not in Original Codebase)
| Element | Location | Status | Options |
|---------|----------|--------|---------|
| Quick Actions panel | Dashboard | UI built, not wired | a) Wire to existing routes as shortcuts b) Create dedicated API c) Remove for MVP |
| Analytics widget | Dashboard | Placeholder chart | a) Connect to analytics data b) Use mock data for demo c) Remove for MVP |
```

### 6. Brand Guidelines Compliance

Cross-reference implementation against brand-guidelines.md:

- [ ] All colors use CSS variables (no hardcoded hex values)
- [ ] Typography matches the defined scale exactly
- [ ] Spacing uses the defined scale (no arbitrary values)
- [ ] Shadows match defined values
- [ ] Border radii consistent
- [ ] Transitions use defined timing and easing
- [ ] Icon set is consistent (not mixing icon libraries)
- [ ] Component patterns follow defined specs

### 7. Accessibility Quick Check

- [ ] All images have alt text
- [ ] Form fields have labels (visible or aria-label)
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Interactive elements are keyboard-navigable
- [ ] Focus order makes sense
- [ ] ARIA roles on custom components (modals, dropdowns, tabs)
- [ ] Skip navigation link present

### 8. Generate Audit Report

```markdown
# Frontend Audit Report

**Project**: [Name]
**Date**: [Date]
**Scope**: [What was audited]
**Brand Guidelines Version**: [Version from brand-guidelines.md]

---

## Summary

| Category | Score | Issues |
|----------|-------|--------|
| Visual Accuracy | X/10 | X issues |
| Interactive States | X/10 | X missing |
| Component Coverage | X/10 | X gaps |
| Connected Functionality | X/10 | X unconnected |
| Brand Compliance | X/10 | X violations |
| Accessibility | X/10 | X issues |
| **Overall** | **X/10** | **X total** |

---

## Critical Issues (Fix Before Ship)
1. [Issue with specific location and fix]
2. [Issue with specific location and fix]

## Important Issues (Fix Soon)
1. [Issue with specific location and fix]
2. [Issue with specific location and fix]

## Minor Issues (Nice to Fix)
1. [Issue with specific location and fix]

## Unconnected Elements
[Table from step 5]

## Recommendations
1. **Immediate**: [What to fix right now]
2. **Next Sprint**: [What to schedule]
3. **Backlog**: [What to track for later]

---

Want me to fix any of these issues now?
```

## Tips

- Take actual screenshots and compare side-by-side when possible — don't just read the code
- The most commonly missed items are: hover states, empty states, loading states, and mobile layouts
- Use browser dev tools to check actual computed values against brand guidelines
- Check dark mode if it's part of the design system
- Run a quick Lighthouse audit for accessibility basics if time permits
- Be specific in the report — "Button hover state missing on Projects page" is actionable, "some hover states are missing" is not
