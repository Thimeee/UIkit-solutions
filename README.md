# MUK UI Kit

A modern, theme-aware Angular component library for the MCS ecosystem.
Built for Angular 21+ with native CSS (no Tailwind dependency inside the
library), full dark mode support, and accessibility baked in.

---

## ✨ Features

- 🎨 **Themeable** — override just two colors (`primary`, `secondary`) to re-skin everything
- 🌙 **Dark mode** — hybrid: follows OS preference *and* allows manual override, persisted
- ♿ **Accessible** — ARIA roles, focus rings, WCAG AA contrast, reduced-motion support
- 🧩 **Icon-agnostic** — use any icon library (Lucide, Bootstrap Icons, Font Awesome, raw SVG)
- 📦 **Standalone components** — tree-shakeable, no NgModules
- ⚡ **Modern Angular** — signals, `@if`/`@for` control flow, `OnPush` change detection
- 📝 **Forms-ready** — every form control implements `ControlValueAccessor`

---

## 📦 Components

| Component | Selector | Description |
|-----------|----------|-------------|
| **Button** | `<muk-button>` | 8 variants × 4 styles, sizes, loading, icons |
| **Input** | `<muk-input>` | Floating/top label, validation, all input types, textarea |
| **Loader** | `<muk-loader>` | 6 types, page/overlay/inline, service-driven |
| **Alert** | `<muk-alert>` | 6 variants × 4 styles, dismissible, auto-dismiss |
| **Toast** | `<muk-toast-container>` + `ToastService` | 6 positions, 5 animations, programmatic |
| **Modal** | `<muk-modal>` | Center + 4 drawers, animations, static backdrop |
| **Dialog** | `<muk-dialog-host>` + `DialogService` | Programmatic confirm/alert, Promise-based |
| **Checkbox** | `<muk-checkbox>` | 6 variants, 3 sizes, indeterminate, CVA |
| **Switch** | `<muk-switch>` | 6 variants, 3 sizes, label left/right, CVA |
| **Radio** | `<muk-radio-group>` | Options array, vertical/horizontal, CVA |
| **Select** | `<muk-select>` | Single/multi, search, chips, groups, CVA |

| Service | Purpose |
|---------|---------|
| **ThemeService** | light / dark / auto theme control |
| **LoaderService** | global page loader control |
| **ToastService** | programmatic toast notifications |
| **DialogService** | programmatic confirm / alert dialogs |

---

## 🚀 Quick Start

### 1. Import the global styles

In your app's `styles.scss`, the theme tokens **must** be available globally
(this is what makes dark mode work):

```scss
/* projects/your-app/src/styles.scss */
/* See styles.scss in this repo for the full token set */

:root {
  --muk-primary-user: #0d6efd;
  --muk-secondary-user: #6c757d;
  /* ... all theme tokens (surface, text, border, etc.) ... */
}

html, body {
  background-color: var(--muk-surface-sunken);
  color: var(--muk-text);
}
```

### 2. Use a component

```ts
import { Component } from '@angular/core';
import { ButtonComponent } from 'multi-ui-kit';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ButtonComponent],
  template: `<muk-button variant="primary">Click me</muk-button>`,
})
export class DemoComponent {}
```

### 3. Enable theme switching (optional)

```ts
import { inject } from '@angular/core';
import { ThemeService } from 'multi-ui-kit';

export class AppComponent {
  theme = inject(ThemeService);
  // theme.toggle(), theme.setMode('dark'), theme.isDark()
}
```

### 4. Add the host containers (once at app root)

```html
<!-- For toast notifications -->
<muk-toast-container></muk-toast-container>

<!-- For programmatic confirm/alert dialogs -->
<muk-dialog-host></muk-dialog-host>
```

---

## 🎨 Theming

### Override brand colors

The entire library re-skins from two CSS variables:

```css
:root {
  --muk-primary-user: #7c3aed;   /* your brand color */
  --muk-secondary-user: #64748b;
}
```

Every component's primary/secondary states follow these automatically.

### Dark mode (hybrid)

Three modes via `ThemeService`:

| Mode | Behavior |
|------|----------|
| `'light'` | Forces light, ignores OS |
| `'dark'` | Forces dark, ignores OS |
| `'auto'` | Follows OS `prefers-color-scheme` (default) |

```ts
this.theme.setMode('dark');   // force dark
this.theme.setMode('auto');   // follow OS
this.theme.toggle();          // flip light ↔ dark
this.theme.isDark();          // boolean (current resolved)
```

Choice is **persisted to localStorage** and survives refresh.

### Prevent flash-of-wrong-theme (FOUC)

Add to `index.html` `<head>` so the saved theme applies before Angular boots:

```html
<script>
  (function() {
    try {
      var t = localStorage.getItem('muk-theme');
      var r = document.documentElement;
      if (t === 'dark') r.classList.add('muk-theme-dark');
      else if (t === 'light') r.classList.add('muk-theme-light');
    } catch (e) {}
  })();
</script>
```

---

## 📁 Project Structure

```
projects/multi-ui-kit/src/
├── public-api.ts
└── lib/
    ├── styles/
    │   └── _global-styles.scss        ← theme tokens + dark mode
    ├── components/
    │   ├── button.component/
    │   ├── input.component/
    │   ├── loader.component/
    │   ├── alert.component/
    │   ├── toast/
    │   │   ├── toast.service.ts
    │   │   └── toast-container.component.*
    │   ├── modal/
    │   │   ├── modal.component.*
    │   │   ├── dialog.service.ts
    │   │   └── dialog-host.component.ts
    │   ├── checkbox/
    │   ├── switch/
    │   ├── radio/
    │   └── select/
    └── themService/
        └── theme.service.ts
```

---

## 📖 Documentation

See **[USAGE.md](./USAGE.md)** for complete usage examples of every component
with full props tables and code snippets.

---

## ♿ Accessibility

- All interactive elements have visible focus rings
- Alerts/toasts use appropriate `role` and `aria-live`
- Modals use `role="dialog"`, `aria-modal`, focus management, body scroll lock
- Form controls use proper labels, `role="switch"`/`"radio"`/`"listbox"`
- Color contrast meets WCAG AA in both light and dark modes
- `prefers-reduced-motion` is respected throughout
- Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Icon-only buttons require `ariaLabel`

---

## 🛠️ Tech

- Angular 21+
- Native CSS (CSS custom properties)
- No runtime icon dependency
- Standalone components, signals
- ControlValueAccessor for all form controls

---

*Built and maintained for MCS Computer Systems.*
