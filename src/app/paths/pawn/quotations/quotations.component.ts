import { Component, EventEmitter, Output } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { Item } from 'src/app/model/item.model';
import { ToastrService } from 'ngx-toastr';
import { PawnService } from 'src/app/services/pawn.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent {
  @Output() form = new EventEmitter<any>();
  dias = days;
  newItem: Item = {
    curp: '',
    item: '',
    specs: '',
    extras: '',
    dias: 0,
    cotizacion: '',
    imagen: '',
  };
  image!: any;
  cliente!: any;

  items: any;
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemsService,
    private clientService: ClientService,
    private toastr: ToastrService,
    private pawn: PawnService,
    public darkModeService: DarkModeService,
  ) {
    this.pawn.tiposItem().subscribe((items: any) => {
      this.items = items['tipos_item'];
      console.log(items);
    })
    this.route.queryParams.subscribe((data: any) => {
      if (data.curp) {
        this.newItem.curp = data.curp
        this.onSearch()
      }
    })
  }
  si() {
    console.log(this.cliente.nombre)
  }
  createNewItem(): void {
    const item = this.newItem
    let valid = this.onSearch()
    if (this.cliente) {
      if (this.image) item.imagen = this.image
      console.log(item)
      valid = true;
    }
    if (valid) {
      this.itemService.createItem(this.newItem)
        .subscribe((Response: any) => {
          if (Response.status === 'OK') {
            this.toastr.success(Response.message);
          }
          else {
            this.toastr.error(Response.message);
          }
          setTimeout(() => { location.reload() }, 2000)
        });
    }



  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const strValue = event.target.value
    if (charCode === 46) return !strValue.includes('.')
    if (!(charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46))
      return (strValue.includes('.')) ? (!(strValue.split('.')[1].length >= 2)) : true
    return false
  }
  onSearch(): boolean {
    if (this.newItem.curp.length === 18)
      this.clientService.get(this.newItem.curp).subscribe((data: any) => {
        if (data.clientes.length !== 1) {
          if (confirm("Cliente no registrado. ¿Deseas registrarte ahora mismo?")) {
            location.href = '/web/newclient?t=1&w=1&curp=' + this.newItem.curp
          }
        }
        this.cliente = data.clientes[0]; return true
      });
    else this.toastr.warning("CURP no valida, intente de nuevo");

    return false
  }
  onClear() {
    this.cliente = null

  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // Aquí puedes manejar el archivo, por ejemplo, leerlo o prepararlo para subir
      // Por ejemplo, para leer el archivo como un DataURL (útil para previsualizar la imagen):
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result as string);  // Aquí tienes el DataURL del archivo
        this.image = reader.result as string // Aquí tienes el DataURL del archivo
        // Puedes asignar esto a una variable si deseas mostrar la imagen en tu plantilla
      };

      // Si necesitas subir el archivo a un servidor, aquí iría esa lógica
    }
  }
}

export const days = [30, 90, 180, 360]

