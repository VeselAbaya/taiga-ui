import {EMPTY_FUNCTION} from '@taiga-ui/cdk/constants';

export const tuiAssert = {
    enabled: false,
    get assert(): (assertion: boolean, ...args: any[]) => void {
        return this.enabled
            ? Function.prototype.bind.call(console.assert, console)
            : EMPTY_FUNCTION;
    },
};

export function tuiAssertIsHTMLElement(element: unknown): asserts element is HTMLElement {
    const isElement =
        element instanceof HTMLElement ||
        element instanceof Element ||
        element instanceof HTMLDocument;

    tuiAssert.assert(isElement, 'Object is not HTML element');
}
