import {Directive, ElementRef, Inject, Input} from '@angular/core';
import {getElementObscurers, TuiDestroyService} from '@taiga-ui/cdk';
import {Observable, ReplaySubject} from 'rxjs';
import {debounceTime, filter, switchMapTo, takeUntil} from 'rxjs/operators';

import {TUI_DOC_PAGE_LOADED} from '../../tokens/page-loaded';

/**
 * @deprecated: use {@link TuiScrollIntoViewLinkDirective}
 * TODO: remove in v3.0
 */
@Directive({
    selector: `[scrollIntoView]`,
    providers: [TuiDestroyService],
})
// eslint-disable-next-line @typescript-eslint/naming-convention
export class ScrollIntoViewDirective {
    @Input()
    set scrollIntoView(shallWe: boolean) {
        this.scroll$.next(shallWe);
    }

    private readonly scroll$ = new ReplaySubject<boolean>(1);

    constructor(
        @Inject(TuiDestroyService) destroy$: TuiDestroyService,
        @Inject(ElementRef) {nativeElement}: ElementRef<HTMLElement>,
        @Inject(TUI_DOC_PAGE_LOADED)
        readonly readyToScroll$: Observable<boolean>,
    ) {
        this.readyToScroll$
            .pipe(
                filter(Boolean),
                switchMapTo(this.scroll$),
                debounceTime(750),
                filter(shallWe => shallWe && !!getElementObscurers(nativeElement)),
                takeUntil(destroy$),
            )
            .subscribe(() => {
                nativeElement.scrollIntoView();
            });
    }
}

@Directive({
    selector: `[tuiScrollIntoViewLink]`,
    providers: [TuiDestroyService],
})
export class TuiScrollIntoViewLinkDirective extends ScrollIntoViewDirective {}
