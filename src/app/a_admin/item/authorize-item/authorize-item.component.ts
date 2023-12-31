import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ItemsService } from "src/app/services/items.service";
import { ToastrService } from "ngx-toastr";
declare var $: any;
@Component({
  selector: 'app-autorize-item',
  templateUrl: './authorize-item.component.html'
})
export class AuthorizeItemComponent implements OnInit {
  onReset() {

  }
  dias = [30, 90, 180, 360];
  selectedDays!: any
  image!: string;
  @Input() id!: any;
  @Input() _item: any = {
    cliente: '',
    articulo: '',
  };

  constructor(
    private itemService: ItemsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.itemService.get(this.id).subscribe((data: any) => {
      this._item = data.items[0];
      this.image = this._item.imagen;
    })
  }

  onDaysChange(event: any) { this._item.dias = parseInt(event.target.value) }
  onAuthorize() {
    $.blockUI({
      message: '<div style="display:grid;place-items:center"><img width="15%" src="assets/cagando.gif" style="position:relative;right:0%;top:30%"></div>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });
    this.itemService.pawn(
      {
        id: this._item.id,
        dias: this._item.dias
      }
    ).subscribe((response: any) => {
      // Manejo de la respuesta
      if (response.status === 'OK') {
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
    setTimeout(() => {
      $.unblockUI();
      location.reload()
    }, 3000);

  }

}
