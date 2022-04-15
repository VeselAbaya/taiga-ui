import {
    ChangeDetectorRef,
    Directive,
    HostListener,
    Inject,
    Input,
    Optional,
    Self,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {
    tuiCoerceBooleanProperty,
    tuiDefaultProp,
    TuiDestroyService,
    watch,
} from '@taiga-ui/cdk';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TuiSliderComponent} from './slider.component';

/**
 * Native <input type='range' readonly> doesn't work.
 * This directive imitates this native behaviour.
 */
@Directive({
    selector: 'input[tuiSlider][readonly]',
    providers: [TuiDestroyService],
})
export class TuiSliderReadonlyDirective {
    private lastValue = this.slider.value;

    @Input()
    @tuiDefaultProp()
    readonly: '' | boolean = true;

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
        readonly ngControl: NgControl | null,
        @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
        @Inject(TuiDestroyService) destroy$: Observable<unknown>,
        @Inject(TuiSliderComponent) private readonly slider: TuiSliderComponent,
    ) {
        ngControl?.valueChanges
            ?.pipe(watch(changeDetectorRef), takeUntil(destroy$))
            .subscribe(() => {
                this.lastValue = this.slider.value;
            });
    }

    @HostListener('input')
    onInput() {
        if (tuiCoerceBooleanProperty(this.readonly)) {
            this.slider.value = this.lastValue;
        }
    }
}
