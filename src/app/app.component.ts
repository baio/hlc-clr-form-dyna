import { Component, forwardRef } from '@angular/core';
import { ClrFormLayouts } from '@ng-holistic/clr-forms';
import { FormFields, FormRebuidProvider, HLC_FORM_REBUILD_PROVIDER } from '@ng-holistic/forms';
import * as R from 'ramda';
import { TextMask } from '@ng-holistic/clr-controls';
import { map } from 'rxjs/operators';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';


const rebuildGroup = (
  { tabsCount, groupsCount, fieldsCount }: { tabsCount: number; fieldsCount: number; groupsCount: number },
  _: any
) => (__: FormGroup): ClrFormLayouts.ClrFormLayout => {
  return {
    kind: 'tabs',
    $content: R.range(0, tabsCount).map(t => ({
      kind: 'tab',
      title: `Tab ${t}`,
      $content: R.range(0, groupsCount).map(i => ({
        kind: 'group',
        title: `Group ${i}`,
        $content: [
          {
            kind: 'fields',
            fields: R.range(0, fieldsCount).map(
              k =>
                ({
                  id: `${t}.${i}.$text.${k}`,
                  kind: 'TextField' as 'TextField',
                  label: `Field ${t} ${i} ${k}`,
                  validators: [Validators.required]
                } as FormFields.Field)
            )
          }
        ]
      }))
    }))
  } as any;
};

@Component({
  selector: 'my-app',
  template: `
      <button (click)="onAddTab()">add tab</button> <button (click)="onAddGroup()">add group</button>
    <button (click)="onAddField()">add field</button>

    <hlc-clr-form [definition]="definition"></hlc-clr-form>`,
  providers: [
    {
      provide: HLC_FORM_REBUILD_PROVIDER,
      useExisting: forwardRef(() => AppComponent)
    }
  ]

})
export class AppComponent implements FormRebuidProvider {
  rebuildForm$ = new Subject<any>();

  tabsCount = 1;
  groupsCount = 1;
  fieldsCount = 1;

  definition = rebuildGroup(
    { tabsCount: this.tabsCount, groupsCount: this.groupsCount, fieldsCount: this.fieldsCount },
    null
  );

  constructor() { }

  rebuildFormLayoutConfig(data: any, val: any) {
    return rebuildGroup(data, val);
  }

  onAddTab() {
    this.rebuildForm$.next({
      tabsCount: ++this.tabsCount,
      fieldsCount: this.fieldsCount,
      groupsCount: this.groupsCount
    });
  }

  onAddGroup() {
    this.rebuildForm$.next({
      tabsCount: this.tabsCount,
      fieldsCount: this.fieldsCount,
      groupsCount: ++this.groupsCount
    });
  }

  onAddField() {
    this.rebuildForm$.next({
      tabsCount: this.tabsCount,
      fieldsCount: ++this.fieldsCount,
      groupsCount: this.groupsCount
    });
  }

}
