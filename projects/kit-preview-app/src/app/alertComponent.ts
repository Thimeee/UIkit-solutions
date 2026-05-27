// ============================================================
// MUK Alert - Usage Examples
// ============================================================

import { Component } from '@angular/core';
import { AlertComponent, ButtonComponent } from 'multi-ui-kit';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [AlertComponent, ButtonComponent],
  template: `
    <!-- ── BASIC ── -->
    <!-- <muk-alert variant="success">Your changes have been saved!</muk-alert>
    <muk-alert variant="info">A new version is available.</muk-alert>
    <muk-alert variant="warning">Your session expires soon.</muk-alert>
    <muk-alert variant="danger">Failed to connect to the server.</muk-alert> -->


  `,
})
export class AlertDemoComponent {
  onDismissed() {
    console.log('Alert dismissed');
  }
  save() { }
  discard() { }
}


/*
╔══════════════════════════════════════════════════════════════╗
║  SETUP                                                        ║
╚══════════════════════════════════════════════════════════════╝

1. Add files to library:
   projects/multi-ui-kit/src/lib/components/alert.component/
     ├── alert.component.ts
     ├── alert.component.html
     └── alert.component.scss

2. Export in public-api.ts:
   export * from './lib/components/alert.component/alert.component';

3. Update _global-styles.scss (soft-text tokens added)

4. Update app styles.scss (soft-text tokens added)

5. Import & use:
   import { AlertComponent } from 'multi-ui-kit';


╔══════════════════════════════════════════════════════════════╗
║  PROPS REFERENCE                                             ║
╚══════════════════════════════════════════════════════════════╝

  variant       'primary'|'secondary'|'success'|'warning'|'danger'|'info'
  alertStyle    'soft'|'solid'|'outline'|'left-accent'   (default 'soft')
  size          'sm'|'md'|'lg'                            (default 'md')
  title         string                                    (optional)
  showIcon      boolean                                   (default true)
  dismissible   boolean                                   (default false)
  autoDismiss   number (ms, 0=off)                        (default 0)
  showProgress  boolean                                   (default false)
  rounded       boolean                                   (default true)
  animate       boolean                                   (default true)

  (dismissed)   EventEmitter<void>

  Slots:
    [slot=icon]     custom icon (overrides default)
    [slot=actions]  action buttons row
    (default)       alert body content
*/