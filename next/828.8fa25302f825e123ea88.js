(window.webpackJsonp=window.webpackJsonp||[]).push([[828],{WWWb:function(n,o,t){"use strict";t.r(o),o.default="import {Component, Inject, Injector} from '@angular/core';\nimport {Router} from '@angular/router';\nimport {changeDetection} from '@demo/emulate/change-detection';\nimport {encapsulation} from '@demo/emulate/encapsulation';\nimport {TuiNotification, TuiNotificationsService} from '@taiga-ui/core';\nimport {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';\nimport {Observable} from 'rxjs';\nimport {takeUntil} from 'rxjs/operators';\n\nimport {AlertExampleWithCustomLabelComponent} from './alert-example-with-custom-label/alert-example-with-custom-label.component';\nimport {CustomLabelComponent} from './custom-label/custom-label.component';\n\n@Component({\n    selector: 'tui-notifications-example-5',\n    templateUrl: './index.html',\n    changeDetection,\n    encapsulation,\n})\nexport class TuiNotificationsExampleComponent5 {\n    readonly notification: Observable<void>;\n    readonly notificationWithCustomLabel: Observable<void>;\n\n    constructor(\n        @Inject(TuiNotificationsService) notificationsService: TuiNotificationsService,\n        @Inject(Router) router: Router,\n        @Inject(Injector) private readonly injector: Injector,\n    ) {\n        this.notification = notificationsService\n            .show<undefined>(\n                new PolymorpheusComponent(\n                    AlertExampleWithCustomLabelComponent,\n                    this.injector,\n                ),\n                {\n                    label: ({$implicit}: any) =>\n                        $implicit === TuiNotification.Error\n                            ? 'Error label from function'\n                            : 'Info label from function',\n                    status: TuiNotification.Info,\n                    autoClose: false,\n                },\n            )\n            .pipe(takeUntil(router.events));\n\n        this.notificationWithCustomLabel = notificationsService\n            .show<undefined>(\n                new PolymorpheusComponent(\n                    AlertExampleWithCustomLabelComponent,\n                    this.injector,\n                ),\n                {\n                    label: new PolymorpheusComponent(CustomLabelComponent, this.injector),\n                    status: TuiNotification.Warning,\n                    autoClose: false,\n                },\n            )\n            .pipe(takeUntil(router.events));\n    }\n\n    showNotification() {\n        this.notification.subscribe();\n    }\n\n    showNotificationWithCustomLabel() {\n        this.notificationWithCustomLabel.subscribe();\n    }\n}\n"}}]);