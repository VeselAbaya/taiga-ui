```html
<div [tuiDropdownContext]="content">Host element</div>

<ng-template
  #content
  let-close="close"
>
  Dropdown content
  <button (click)="close()"></button>
</ng-template>
```