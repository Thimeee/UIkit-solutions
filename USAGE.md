# MUK UI Kit — Usage Guide

Complete reference for every component, with examples.

> **Note on defaults:** Every component is theme-aware. They render in
> **light mode by default** and automatically switch to **dark mode** when
> the theme is dark (via OS preference or `ThemeService`). No extra config
> per-component is needed.

---

## Table of Contents

1. [Button](#button)
2. [Input](#input)
3. [Loader](#loader)
4. [Alert](#alert)
5. [Toast](#toast)
6. [Modal](#modal)
7. [Dialog Service](#dialog-service)
8. [Checkbox](#checkbox)
9. [Switch](#switch)
10. [Radio Group](#radio-group)
11. [Select / Dropdown](#select--dropdown)
12. [Theme Service](#theme-service)
13. [Loader Service](#loader-service)

---

## Button

`<muk-button>` — icon-agnostic action button.

### Import
```ts
import { ButtonComponent } from 'multi-ui-kit';
// imports: [ButtonComponent]
```

### Basic
```html
<muk-button variant="primary" (clicked)="onSave()">Save</muk-button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary` `secondary` `success` `warning` `danger` `info` `light` `dark` | `primary` | Color |
| `buttonStyle` | `solid` `soft` `outline` `ghost` | `solid` | Visual style |
| `size` | `xs` `sm` `md` `lg` `xl` | `md` | Size |
| `shape` | `rounded` `square` `pill` `circle` | `rounded` | Corner shape |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner, blocks clicks |
| `block` | `boolean` | `false` | Full width |
| `iconOnly` | `boolean` | `false` | Icon-only (needs `ariaLabel`) |
| `gradient` | `boolean` | `true` | Gradient bg (solid only) |
| `type` | `button` `submit` `reset` | `button` | Native type |
| `ariaLabel` | `string` | — | A11y label |

| Event | Payload |
|-------|---------|
| `(clicked)` | `MouseEvent` |

| Slot | Description |
|------|-------------|
| `[slot=icon-left]` | Icon before text |
| `[slot=icon-right]` | Icon after text |
| (default) | Button label |

### Examples
```html
<muk-button variant="primary" buttonStyle="soft">Soft</muk-button>

<muk-button variant="primary">
  <i slot="icon-left" class="bi bi-save"></i>
  Save
</muk-button>

<muk-button variant="danger" iconOnly shape="circle" ariaLabel="Delete">
  <i class="bi bi-trash"></i>
</muk-button>

<muk-button variant="primary" [loading]="saving">Save</muk-button>
```

---

## Input

`<muk-input>` — form input with floating/top label, validation, all types.
Works with **ReactiveForms** (`formControl`) and **template-driven** (`ngModel`).

### Import
```ts
import { InputComponent } from 'multi-ui-kit';
// imports: [InputComponent, FormsModule]  // or ReactiveFormsModule
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | `''` | Placeholder |
| `helperText` | `string` | `''` | Help text below |
| `type` | `text` `password` `email` `number` `tel` `url` `search` `date` `time` `datetime-local` `textarea` | `text` | Input type |
| `size` | `sm` `md` `lg` `xl` | `md` | Size |
| `labelStyle` | `floating` `top` `none` | `floating` | Label placement |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Read-only |
| `required` | `boolean` | `false` | Shows asterisk |
| `clearable` | `boolean` | `false` | Show clear (X) button |
| `loading` | `boolean` | `false` | Async-validation spinner |
| `rows` | `number` | `4` | Textarea rows |
| `maxLength` | `number` | — | Max characters |
| `showCounter` | `boolean` | `false` | Character counter |
| `errorMessages` | `Record<string,string>` | `{}` | Custom validator messages |

| Slot | Description |
|------|-------------|
| `[slot=icon-left]` | Leading icon |
| `[slot=prefix]` | Text before input |
| `[slot=suffix]` | Text after input |

### Examples
```html
<muk-input label="Full Name" [(ngModel)]="name"></muk-input>

<muk-input label="Search" type="search" [(ngModel)]="q">
  <i slot="icon-left" class="bi bi-search"></i>
</muk-input>

<muk-input label="Email" type="email" [formControl]="emailCtrl"
  [errorMessages]="{ required: 'We need your email' }"></muk-input>

<muk-input label="Bio" type="textarea" [rows]="4" [maxLength]="200"
  [showCounter]="true" [(ngModel)]="bio"></muk-input>
```

---

## Loader

`<muk-loader>` — loading indicators. Inline, overlay, or full-screen.

### Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `dots` `spinner` `pulse` `wave` `bars` `circle` | `dots` |
| `size` | `sm` `md` `lg` `xl` | `md` |
| `color` | `primary` `secondary` `success` `warning` `danger` `info` `dark` | `primary` |
| `message` | `string` | `Loading` |
| `showMessage` | `boolean` | `true` |
| `fullScreen` | `boolean` | `false` |
| `overlay` | `boolean` | `false` |
| `inline` | `boolean` | `false` |
| `autoBind` | `boolean` | `false` |

### Examples
```html
<muk-loader type="spinner"></muk-loader>
<muk-loader [fullScreen]="true" message="Loading"></muk-loader>
<muk-loader autoBind [fullScreen]="true" type="spinner"></muk-loader>
```

---

## Alert

`<muk-alert>` — contextual feedback banner.

### Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `primary` `secondary` `success` `warning` `danger` `info` | `info` |
| `alertStyle` | `soft` `solid` `outline` `left-accent` | `soft` |
| `size` | `sm` `md` `lg` | `md` |
| `title` | `string` | — |
| `showIcon` | `boolean` | `true` |
| `dismissible` | `boolean` | `false` |
| `autoDismiss` | `number` (ms) | `0` |
| `showProgress` | `boolean` | `false` |

| Slot | Description |
|------|-------------|
| `[slot=icon]` | Custom icon |
| `[slot=actions]` | Action buttons row |

### Examples
```html
<muk-alert variant="success">Saved successfully!</muk-alert>

<muk-alert variant="warning" title="Heads up" [dismissible]="true">
  Your subscription expires soon.
</muk-alert>

<muk-alert variant="warning" title="Unsaved changes">
  Save before leaving?
  <div slot="actions">
    <muk-button size="sm" variant="warning">Save</muk-button>
    <muk-button size="sm" buttonStyle="ghost">Discard</muk-button>
  </div>
</muk-alert>
```

---

## Toast

Programmatic notifications via `ToastService`. Rendered by a single
`<muk-toast-container>` at app root.

### Setup
```html
<!-- app root template -->
<muk-toast-container></muk-toast-container>
```

```ts
import { inject } from '@angular/core';
import { ToastService } from 'multi-ui-kit';

export class MyComponent {
  toast = inject(ToastService);
}
```

### Methods
```ts
toast.success(message, opts?)
toast.error(message, opts?)
toast.warning(message, opts?)
toast.info(message, opts?)
toast.show(options)
toast.dismiss(id)
toast.clear()
toast.configure(defaults)
```

### Options

| Option | Type | Default |
|--------|------|---------|
| `message` | `string` | (required) |
| `title` | `string` | — |
| `variant` | `MukAlertVariant` | `info` |
| `position` | `top-left` `top-center` `top-right` `bottom-left` `bottom-center` `bottom-right` | `top-right` |
| `animation` | `from-left` `from-right` `from-top` `from-bottom` `fade` | auto |
| `duration` | `number` (ms) | `4000` |
| `showProgress` | `boolean` | `true` |

### Animations

| Value | Movement |
|-------|----------|
| `from-left` | left → right |
| `from-right` | right → left |
| `from-top` | top → down |
| `from-bottom` | bottom → up |
| `fade` | fade in place |

### Examples
```ts
this.toast.success('Saved successfully!');
this.toast.error('Failed to save');

this.toast.show({
  message: 'Custom',
  title: 'Heads up',
  variant: 'warning',
  position: 'bottom-center',
  animation: 'from-bottom',
  duration: 5000,
});
```

---

## Modal

`<muk-modal>` — flexible dialog / drawer with content projection.

### Props

| Prop | Type | Default |
|------|------|---------|
| `[(open)]` | `boolean` (two-way) | `false` |
| `position` | `center` `top` `bottom` `left` `right` | `center` |
| `animation` | `zoom` `fade` `slide` | auto |
| `size` | `sm` `md` `lg` `xl` `full` | `md` |
| `title` | `string` | — |
| `staticBackdrop` | `boolean` | `false` |
| `closeOnEsc` | `boolean` | `true` |
| `showClose` | `boolean` | `true` |
| `blurBackdrop` | `boolean` | `true` |
| `scrollable` | `boolean` | `true` |
| `lockScroll` | `boolean` | `true` |

| Slot | Description |
|------|-------------|
| `[slot=title]` | Modal title |
| `[slot=footer]` | Footer actions |
| (default) | Modal body |

### Examples
```html
<!-- Center modal -->
<muk-modal [(open)]="show" position="center" size="md">
  <span slot="title">Edit Profile</span>
  <p>Body content</p>
  <div slot="footer">
    <muk-button (clicked)="show = false">Cancel</muk-button>
    <muk-button variant="primary" (clicked)="save()">Save</muk-button>
  </div>
</muk-modal>

<!-- Right drawer -->
<muk-modal [(open)]="show" position="right" size="md">
  <span slot="title">Settings</span>
  <p>Drawer content</p>
</muk-modal>

<!-- Static backdrop (form) -->
<muk-modal [(open)]="show" [staticBackdrop]="true" [closeOnEsc]="false">
  <span slot="title">Required</span>
  ...
</muk-modal>
```

---

## Dialog Service

Promise-based confirm/alert dialogs. Rendered by `<muk-dialog-host>`.

### Setup
```html
<muk-dialog-host></muk-dialog-host>
```

```ts
import { DialogService } from 'multi-ui-kit';
constructor(private dialog: DialogService) {}
```

### Methods
```ts
dialog.confirm(opts): Promise<boolean>
dialog.alert(opts): Promise<boolean>
```

### Confirm options
`title?`, `message`, `confirmText?`, `cancelText?`, `variant?`, `style?`,
`position?`, `animation?`, `size?`, `staticBackdrop?`

### Alert options
`title?`, `message`, `okText?`, `variant?`, `style?`, `position?`,
`animation?`, `size?`

### Examples
```ts
const ok = await this.dialog.confirm({
  title: 'Delete item?',
  message: 'This action cannot be undone.',
  variant: 'danger',
  confirmText: 'Delete',
  style: 'solid',
});
if (ok) { /* delete */ }

await this.dialog.alert({
  title: 'Success',
  message: 'Saved!',
  variant: 'success',
});
```

---

## Checkbox

`<muk-checkbox>` — single boolean checkbox. ControlValueAccessor.

### Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `primary` `secondary` `success` `warning` `danger` `info` | `primary` |
| `size` | `sm` `md` `lg` | `md` |
| `disabled` | `boolean` | `false` |
| `indeterminate` | `boolean` | `false` |
| `ariaLabel` | `string` | — |

| Event | Payload |
|-------|---------|
| `(checkedChange)` | `boolean` |

### Examples
```html
<muk-checkbox [(ngModel)]="agreed">I agree to the terms</muk-checkbox>

<muk-checkbox [formControl]="ctrl" variant="success">Subscribe</muk-checkbox>

<!-- Select-all pattern -->
<muk-checkbox
  [(ngModel)]="allChecked"
  [indeterminate]="someChecked && !allChecked"
  (checkedChange)="toggleAll($event)"
>Select all</muk-checkbox>
```

---

## Switch

`<muk-switch>` — toggle switch. ControlValueAccessor.

### Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `primary` `secondary` `success` `warning` `danger` `info` | `primary` |
| `size` | `sm` `md` `lg` | `md` |
| `disabled` | `boolean` | `false` |
| `labelPosition` | `left` `right` | `right` |
| `ariaLabel` | `string` | — |

| Event | Payload |
|-------|---------|
| `(checkedChange)` | `boolean` |

### Examples
```html
<muk-switch [(ngModel)]="notifications">Notifications</muk-switch>

<muk-switch [formControl]="darkCtrl" variant="success" size="lg">
  Dark mode
</muk-switch>

<muk-switch [(ngModel)]="wifi" labelPosition="left">Wi-Fi</muk-switch>
```

---

## Radio Group

`<muk-radio-group>` — single-select from options array. ControlValueAccessor.

### Props

| Prop | Type | Default |
|------|------|---------|
| `options` | `MukRadioOption[]` | (required) |
| `variant` | `primary` `secondary` `success` `warning` `danger` `info` | `primary` |
| `size` | `sm` `md` `lg` | `md` |
| `direction` | `vertical` `horizontal` | `vertical` |
| `disabled` | `boolean` | `false` |

| Event | Payload |
|-------|---------|
| `(valueChange)` | `any` |

### `MukRadioOption`
```ts
{
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;   // secondary text below label
}
```

### Examples
```ts
planOptions: MukRadioOption[] = [
  { label: 'Free', value: 'free', description: '$0 / forever' },
  { label: 'Pro', value: 'pro', description: '$9 / month' },
  { label: 'Enterprise', value: 'ent', disabled: true },
];
```

```html
<muk-radio-group [(ngModel)]="plan" [options]="planOptions"></muk-radio-group>

<muk-radio-group
  [(ngModel)]="size"
  [options]="sizeOptions"
  direction="horizontal"
  variant="success"
></muk-radio-group>
```

---

## Select / Dropdown

`<muk-select>` — single or multi-select with search, chips, grouping.
ControlValueAccessor.

### Props

| Prop | Type | Default |
|------|------|---------|
| `options` | `MukSelectOption[]` | (required) |
| `multiple` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `clearable` | `boolean` | `true` |
| `closeOnSelect` | `boolean` | `true` (single only) |
| `maxChips` | `number` | `3` (multi only) |
| `label` | `string` | — |
| `placeholder` | `string` | `Select...` |
| `helperText` | `string` | — |
| `errorMessage` | `string` | — |
| `searchPlaceholder` | `string` | `Search...` |
| `noResultsText` | `string` | `No results found` |
| `size` | `sm` `md` `lg` `xl` | `md` |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |

| Event | Payload |
|-------|---------|
| `(selectionChange)` | `any` (single) or `any[]` (multi) |
| `(opened)` | `void` |
| `(closed)` | `void` |

### `MukSelectOption`
```ts
{
  label: string;          // shown text
  value: any;             // underlying value
  disabled?: boolean;
  description?: string;   // secondary text below label
  group?: string;         // group header
}
```

### Keyboard

| Key | Action |
|-----|--------|
| `↓` `↑` | Navigate options |
| `Enter` | Select highlighted |
| `Space`/`Enter` (closed) | Open dropdown |
| `Escape` | Close |

### Examples
```ts
countries: MukSelectOption[] = [
  { label: 'Sri Lanka', value: 'lk' },
  { label: 'United States', value: 'us' },
  { label: 'Singapore', value: 'sg' },
];

skills: MukSelectOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'ts' },
];

// Grouped
frameworks: MukSelectOption[] = [
  { label: 'Angular', value: 'ng', group: 'Frontend' },
  { label: 'React', value: 'react', group: 'Frontend' },
  { label: 'Express', value: 'exp', group: 'Backend' },
];

// With descriptions
plans: MukSelectOption[] = [
  { label: 'Starter', value: 'starter', description: 'Up to 5 users' },
  { label: 'Pro', value: 'pro', description: '$29/mo' },
];
```

```html
<!-- Single -->
<muk-select label="Country" [options]="countries" [(ngModel)]="country"></muk-select>

<!-- Multi-select with search -->
<muk-select
  label="Skills"
  [options]="skills"
  [multiple]="true"
  [searchable]="true"
  [(ngModel)]="selectedSkills"
  helperText="Pick all that apply"
></muk-select>

<!-- Reactive Form -->
<muk-select [options]="opts" [formControl]="ctrl" required></muk-select>

<!-- Grouped -->
<muk-select [options]="frameworks" [(ngModel)]="framework"></muk-select>
```

---

## Theme Service

Controls light/dark/auto theme.

### API
```ts
import { ThemeService } from 'multi-ui-kit';
theme = inject(ThemeService);

// Signals (reactive)
theme.mode()        // 'light' | 'dark' | 'auto'
theme.resolved()    // 'light' | 'dark' (what's showing)
theme.isDark()      // boolean

// Methods
theme.setMode('dark');
theme.toggle();          // flip light ↔ dark
```

### Example toggle
```html
<muk-button (clicked)="theme.toggle()">
  {{ theme.isDark() ? '☀️ Light' : '🌙 Dark' }}
</muk-button>
```

---

## Loader Service

Global page loader (with parallel-request counter).

### API
```ts
loader.show('Loading users');
loader.hide();
loader.reset();
loader.setMessage('Almost done');
await loader.wrap(promise, 'Loading');

loader.isLoading;        // snapshot
loader.isLoading$;       // observable
```

### Setup
```html
<muk-loader autoBind [fullScreen]="true" type="spinner"></muk-loader>
```

```ts
this.loader.show('Fetching');
await this.api.getData();
this.loader.hide();

// or auto
await this.loader.wrap(this.api.getData(), 'Fetching');
```

---

*For setup and theming, see [README.md](./README.md).*
