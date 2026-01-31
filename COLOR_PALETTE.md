# Oracle Boxing Color Palette

## Brand Colors

### Whitesmoke (Background & Light Elements)
- **Hex**: `#F5F5F5`
- **CSS Variable**: `--color-ob-whitesmoke`
- **Tailwind Utility**: `bg-[#F5F5F5]` or `text-[#F5F5F5]`
- **Usage**: Main background color, replacing pure white (#FFFFFF)

### ~~CTA Yellow~~ (DEPRECATED - DO NOT USE)
- **Hex**: `#fef9c3`
- **Status**: ❌ REMOVED — Jordan dislikes this colour. Do NOT use in any new designs, ads, or generated content.
- **Replacement**: Use Whitesmoke (#F5F5F5) on dark backgrounds, or Dark (#171717) on light backgrounds for CTAs. Keep it clean black/white.

### Header/Footer Dark (Navigation & Footers)
- **Hex**: `#171717`
- **CSS Variable**: `--color-ob-dark` or `--color-header-footer`
- **Tailwind Utility**: `bg-neutral-900` or `bg-[#171717]`
- **Usage**: Header, footer, and dark UI elements

## Color Replacements Applied

### CSS Variables (globals.css)
✅ Updated all theme color variables to use whitesmoke (#F5F5F5)
- `--color-background`
- `--color-card`
- `--color-popover`
- `--color-primary-foreground`
- `--color-destructive-foreground`

### CTA Button System
✅ Updated all button classes to use whitesmoke
- `.ob-btn-primary` - Black background with whitesmoke text
- `.ob-btn-secondary` - Yellow background, whitesmoke on hover
- `.ob-btn-gp-byg-s` - Transparent with whitesmoke text/border
- `.ob-btn-gp-wbg-p` - Whitesmoke background (was pure white)
- `.ob-btn-gp-try-s` - Transparent with whitesmoke text/border

## Component Update Guide

### Find & Replace Strategy

**For Tailwind Classes:**
Replace the following patterns in TSX/JSX files:

1. Background colors:
   - `bg-white` → `bg-[#F5F5F5]` or keep for specific cases

2. Text colors:
   - `text-white` → `text-[#F5F5F5]` or keep for specific high-contrast cases

3. Border colors:
   - `border-white` → `border-[#F5F5F5]` or keep for specific cases

### Files Requiring Updates

Total: **325 occurrences** across **56 files**

**Priority Files** (highest usage):
- `app/black-friday-challenge-2025/page.tsx` - 47 occurrences
- `app/membership/page.tsx` - 33 occurrences
- `app/6wc/page.tsx` - 20 occurrences
- `components/Footer.tsx` - 18 occurrences
- `components/Header.tsx` - 14 occurrences

### Exceptions (Keep White)

Some elements should remain pure white (#FFFFFF) for high contrast:
- Text on very dark backgrounds (when #F5F5F5 isn't visible enough)
- Icons that need maximum contrast
- Specific design elements requiring pure white

## Usage Examples

### Background
```tsx
// Old
<div className="bg-white">

// New
<div className="bg-[#F5F5F5]">
```

### Text
```tsx
// Old
<p className="text-white">

// New
<p className="text-[#F5F5F5]">
```

### CTA Buttons (already updated in CSS)
```tsx
// Primary CTA - uses whitesmoke automatically
<button className="ob-btn ob-btn-primary">Join Now</button>

// Secondary CTA - uses whitesmoke automatically
<button className="ob-btn ob-btn-secondary">Learn More</button>
```

## CSS Variables Reference

```css
/* Brand Colors */
--color-ob-whitesmoke: #F5F5F5;
--color-ob-yellow: #fef9c3;
--color-ob-dark: #171717;

/* Use in custom CSS */
.custom-element {
  background-color: var(--color-ob-whitesmoke);
  color: var(--color-ob-dark);
}
```

## Next Steps

1. ✅ CSS variables and button system updated
2. ⏳ Review and update component files (56 files, 325 occurrences)
3. ⏳ Test visual consistency across all pages
4. ⏳ Update any hardcoded #FFFFFF or #FFF values in components

## Notes

- Whitesmoke (#F5F5F5) provides a softer, more modern look than pure white
- Maintains excellent readability while reducing eye strain
- Pairs beautifully with the CTA yellow (#fef9c3) and dark header (#171717)
