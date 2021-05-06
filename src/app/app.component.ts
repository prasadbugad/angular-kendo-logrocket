import { Component, ViewEncapsulation } from "@angular/core";

import { tap, switchMap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import { OrdersService } from "./northwind.service";
import { SelectableSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import * as LogRocket from "logrocket";

@Component({
  selector: "my-app",
  providers: [OrdersService],
  /*
   * Set a fixed row height of 36px (20px line height, 2 * 8px padding)
   *
   * [row height] = [line height] + [padding] + [border]
   *
   * Note: If using the Kendo UI Material theme, add 1px to the row height
   * to account for the bottom border width.
   */
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .k-grid tr.disabled  {
        pointer-events: none;
      }
      .k-grid tbody td {
        white-space: nowrap;
        line-height: 20px;
        padding: 8px 12px;
      }
    `
  ],
  template: `
  <kendo-grid [data]="query | async" scrollable="virtual" [loading]="loading" [pageSize]="state.take"
      [skip]="state.skip" (pageChange)="pageChange($event)" [rowHeight]="36" [height]="500"
       (selectionChange)="selectionChange($event)"
       kendoGridSelectBy="OrderID"
            [selectedKeys]="mySelection"
            [rowClass]="rowClass"
            >
      <kendo-grid-column
        field="OrderID"
        [width]="80"
        title="ID"
      ></kendo-grid-column>
     <kendo-grid-checkbox-column [width]="80" showSelectAll="true"></kendo-grid-checkbox-column>
      <kendo-grid-column
        field="ShipName"
        title="Ship Name"
        [width]="200"
      ></kendo-grid-column>
      <kendo-grid-column
        field="ShipAddress"
        title="Ship Address"
        [width]="200"
      ></kendo-grid-column>
      <kendo-grid-column
        field="ShipCity"
        title="Ship City"
        [width]="100"
      ></kendo-grid-column>
      <kendo-grid-column
        field="ShipCountry"
        title="Ship Country"
        [width]="100"
      ></kendo-grid-column>
    </kendo-grid>
  `
})
export class AppComponent {
  public loading: boolean;
  public mySelection: String[] = ['10248'];
  public isBoxEnabled = false;
  public state: any = {
    skip: 0,
    take: 100
  };
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public query: any;
  private stateChange = new BehaviorSubject<any>(this.state);

  constructor(private service: OrdersService) {
    this.service.setRocketLog('fshaikh@ces-ltd.com')
    this.query = this.stateChange.pipe(
      tap(state => {
        this.state = state;
        this.loading = true;
      }),
      switchMap(state => service.fetch(state)),
      tap(() => {

        this.loading = false;
      })
    );
  }

  public pageChange(state: any): void {
    console.log(this.mySelection);
    this.stateChange.next(state);
  }

  public selectionChange(e) {

    /* $(".k-state-disabled").removeClass("k-state-selected");
    $(".k-state-disabled").find(".k-checkbox").prop("checked", false); */
    const selectedRowIndices = e.selectedRows.map(row => row.dataItem.OrderID)
    const deselectedRowIndices = e.deselectedRows.map(row => row.dataItem.OrderID)
    //this.mySelection = this.mySelection.concat(selectedRowIndices)
    //this.mySelection = this.mySelection.filter(selection => !deselectedRowIndices.includes(selection))
    //this.isBoxEnabled = this.mySelection.length > 0

    console.log("mysel: ", this.mySelection)
  }
  public rowClass(item) {

    return item.dataItem.ShipCity == "Lyon" ? "disabled" : "";
  }

  ngOnInit(): void {
    LogRocket.init('faqm6j/mocapp-nm9yu', {
      release: 'DEV',
      dom: {
        isEnabled: false,
      },
    });
  }


}