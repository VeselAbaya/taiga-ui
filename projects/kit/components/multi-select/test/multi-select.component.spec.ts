import {Component, DebugElement, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {tuiAssertIsHTMLElement} from '@taiga-ui/cdk';
import {
    TuiDataListModule,
    TuiHintControllerModule,
    TuiRootModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
    TUI_ARROW_MODE,
    TuiDataListWrapperModule,
    TuiMultiSelectComponent,
} from '@taiga-ui/kit/components';
import {configureTestSuite, NativeInputPO, PageObject} from '@taiga-ui/testing';

import {TuiMultiSelectModule} from '../multi-select.module';
import {tuiAssertIsHTMLElement} from '@taiga-ui/cdk';

describe('MultiSelect', () => {
    describe('Basic', () => {
        let fixture: ComponentFixture<TestComponent>;
        let testComponent: TestComponent;
        let pageObject: PageObject<TestComponent>;
        let inputPO: NativeInputPO;

        class User {
            constructor(
                readonly firstName: string,
                readonly lastName: string,
                readonly id: string,
            ) {}

            toString(): string {
                return `${this.firstName} ${this.lastName}`;
            }
        }

        const ITEMS = [
            new User('Marsi', 'Barsi', '0'),
            new User('Water', 'Plea', '2'),
            new User('Alexander', 'Inkin', '3'),
        ];

        @Component({
            template: `
                <tui-root>
                    <tui-multi-select
                        [formControl]="control"
                        [readOnly]="readOnly"
                    >
                        <tui-data-list-wrapper
                            *tuiDataList
                            automation-id="tui-multi-select__menu"
                            [items]="items"
                        ></tui-data-list-wrapper>
                    </tui-multi-select>
                </tui-root>
            `,
        })
        class TestComponent {
            @ViewChild(TuiMultiSelectComponent, {static: true})
            component!: TuiMultiSelectComponent<User>;

            items = ITEMS;

            control = new FormControl([ITEMS[0]]);

            readOnly = false;
        }

        configureTestSuite(() => {
            TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    NoopAnimationsModule,
                    TuiMultiSelectModule,
                    TuiRootModule,
                    TuiDataListModule,
                    TuiDataListWrapperModule,
                    TuiTextfieldControllerModule,
                    TuiHintControllerModule,
                ],
                declarations: [TestComponent],
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestComponent);
            pageObject = new PageObject(fixture);
            testComponent = fixture.componentInstance;

            inputPO = new NativeInputPO(fixture, 'tui-input-tag__native');
            fixture.detectChanges();
        });

        describe('Field', () => {
            describe('when you click on it', () => {
                beforeEach(() => {
                    // Focus happens before click, after mousedown
                    inputPO.focus();
                });

                it('opens a dropdown', () => {
                    getInputTag(pageObject).nativeElement.click();
                    fixture.detectChanges();

                    expect(getDropdown(pageObject)).not.toBeNull();
                });

                describe('does not open the dropdown', () => {
                    it('in readOnly mode', () => {
                        testComponent.readOnly = true;
                        fixture.detectChanges();
                        getInputTag(pageObject).nativeElement.click();
                        fixture.detectChanges();

                        expect(getDropdown(pageObject)).toBeNull();
                    });

                    it('if control is disabled', () => {
                        testComponent.control.disable();
                        fixture.detectChanges();
                        getInputTag(pageObject).nativeElement.click();
                        fixture.detectChanges();

                        expect(getDropdown(pageObject)).toBeNull();
                    });
                });
            });
        });

        describe('Arrow', () => {
            it('Click on the arrow to open the dropdown', () => {
                getArrow(pageObject)?.nativeElement.click();
                fixture.detectChanges();

                expect(getDropdown(pageObject)).not.toBeNull();
            });

            it('Clicking the arrow again closes the dropdown', () => {
                getArrow(pageObject)?.nativeElement.click();
                fixture.detectChanges();
                getArrow(pageObject)?.nativeElement.click();
                fixture.detectChanges();

                expect(getDropdown(pageObject)).toBeNull();
            });

            it('There is exists interactive arrow in readOnly mode', () => {
                testComponent.readOnly = true;
                fixture.detectChanges();

                expect(getArrow(pageObject)?.nativeElement).toBeTruthy();
            });

            it('In disabled mode there is interactive arrow exists', () => {
                testComponent.control.disable();
                fixture.detectChanges();

                expect(getArrow(pageObject)?.nativeElement).toBeTruthy();
            });
        });

        describe('Keyboard', () => {
            beforeEach(() => {
                inputPO.focus();
            });

            it('Down arrow opens a dropdown', () => {
                inputPO.sendKeydown('ArrowDown');
                fixture.detectChanges();

                expect(getDropdown(pageObject)).not.toBeNull();
            });

            it('Esc closes the dropdown', () => {
                inputPO.sendKeydown('ArrowDown');
                fixture.detectChanges();
                inputPO.sendKeydown('Escape');
                fixture.detectChanges();

                expect(getDropdown(pageObject)).toBeNull();
            });

            it('Down arrow does not open dropdown in readOnly mode', () => {
                testComponent.readOnly = true;
                fixture.detectChanges();
                inputPO.sendKeydown('ArrowDown');
                fixture.detectChanges();

                expect(getDropdown(pageObject)).toBeNull();
            });

            it('The repeated down arrow moves focus to the item', () => {
                inputPO.sendKeydown('ArrowDown');
                inputPO.sendKeydown('ArrowDown');

                expect(document.activeElement?.tagName.toLowerCase()).toBe('button');
            });

            it('Click to remove the selected item', () => {
                inputPO.sendKeydown('ArrowDown');
                inputPO.sendKeydown('ArrowDown');
                tuiAssertIsHTMLElement(document.activeElement);
                document.activeElement.click();

                expect(testComponent.control.value).toEqual([]);
            });

            it('Click to select an unselected item', () => {
                inputPO.sendKeydown('ArrowDown');
                inputPO.sendKeydown('ArrowDown');
                tuiAssertIsHTMLElement(document.activeElement);
                document.activeElement.click();
                document.activeElement.click();

                expect(testComponent.control.value).toEqual([ITEMS[0]]);
            });
        });
    });

    describe('Change arrow mode', () => {
        let fixture: ComponentFixture<TestComponent>;
        let testComponent: TestComponent;
        let pageObject: PageObject<TestComponent>;

        class User {
            constructor(
                readonly firstName: string,
                readonly lastName: string,
                readonly id: string,
            ) {}

            toString(): string {
                return `${this.firstName} ${this.lastName}`;
            }
        }

        const ITEMS = [new User('Alexander', 'Inkin', '1')];

        @Component({
            template: `
                <tui-root>
                    <tui-multi-select
                        [formControl]="control"
                        [readOnly]="readOnly"
                    >
                        <tui-data-list-wrapper
                            *tuiDataList
                            automation-id="tui-multi-select__menu"
                            [items]="items"
                        ></tui-data-list-wrapper>
                    </tui-multi-select>
                </tui-root>
            `,
        })
        class TestComponent {
            @ViewChild(TuiMultiSelectComponent, {static: true})
            component!: TuiMultiSelectComponent<User>;

            items = ITEMS;

            control = new FormControl([ITEMS[0]]);

            readOnly = false;
        }

        // noinspection DuplicatedCode
        configureTestSuite(() => {
            TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    NoopAnimationsModule,
                    TuiMultiSelectModule,
                    TuiRootModule,
                    TuiDataListModule,
                    TuiDataListWrapperModule,
                    TuiTextfieldControllerModule,
                    TuiHintControllerModule,
                ],
                declarations: [TestComponent],
                providers: [
                    {
                        provide: TUI_ARROW_MODE,
                        useValue: {interactive: '☆', disabled: '★'},
                    },
                ],
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestComponent);
            pageObject = new PageObject(fixture);
            testComponent = fixture.componentInstance;

            fixture.detectChanges();
        });

        it('switch arrow mode by disable or enable method', () => {
            testComponent.control.disable();
            fixture.detectChanges();

            expect(getArrow(pageObject)?.nativeElement.innerText).toEqual('★');

            testComponent.control.enable();
            fixture.detectChanges();

            expect(getArrow(pageObject)?.nativeElement.innerText).toEqual('☆');
        });
    });
});

function getArrow<T>(pageObject: PageObject<T>): DebugElement | null {
    return pageObject.getByAutomationId('tui-multi-select__arrow');
}

function getInputTag<T>(pageObject: PageObject<T>): DebugElement {
    return pageObject.getByAutomationId('tui-multi-select__input')!;
}

function getDropdown<T>(pageObject: PageObject<T>): DebugElement | null {
    return pageObject.getByAutomationId('tui-multi-select__menu');
}
