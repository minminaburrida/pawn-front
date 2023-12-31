import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { AbcService } from './abc.service';
import { QrScannerComponent } from 'src/app/templates/qr-scanner/qr-scanner.component';
import { ItemsService } from 'src/app/services/items.service';
// ABC MODAL

declare var $: any;
@Component({
  selector: 'app-abc-modal',
  template: `
    <div
      [ngClass]="{
        active: modal
      }"
      class="modal-container"
      [ngStyle]="{
        background: modo === 'dark' ? '#0008' : '#fff8',
        'z-index': !modal ? -2 : 1
      }"
    >
      <div
        [attr.data-bs-theme]="modo"
        class="modal-content"
        [ngStyle]="{
      background: modo === 'dark' ? '#000f' : '#ffff',
      'max-height': '80%',
      'max-width': '80%',

    }"
        style="overflow-y: auto"
        id="modal"
      >
        <div style="width:15px;height:15px">
          <button
            (click)="hideAlert()"
            class="rounded-circle btn-close "
          ></button>
        </div>
        <br><br>
        <ng-content></ng-content>
        <br><br>
        <button (click)="hideAlert()" class="btn" [attr.data-bs-theme]="modo">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./abc.component.css'],
})
export class AbcModalComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @Output() open = new EventEmitter<any>();
  modo!: string;
  modal: boolean = false;
  valid: boolean = false;
  title: string = '32';
  ngOnInit(): void {
    this.open.emit();
  }
  toggleModal() {
    this.modal = !this.modal;
    if (this.modal) {
      this.open.emit();
    }
    else this.close.emit()
  }
  openModal() {
    let item = document.getElementById('modal')
    if (item) { item.scrollTop = 0 }
    this.modal = true;
    this.open.emit();
  }
  closeModal() { this.modal = false; this.close.emit() }
  hideAlert() {
    this.modal = false;
    this.close.emit();
  }
  constructor(private darkModeService: DarkModeService) {
    this.darkModeService.isDarkModeEnabled().subscribe((isDarkMode) => {
      // Actualiza la variable modo en función del estado del modo oscuro
      this.modo = !isDarkMode ? 'light' : 'dark';
    });
  }
}

@Component({
  selector: 'app-abc',
  templateUrl: './abc.component.html',
  styleUrls: ['./abc.component.css'],
})
export class AbcComponent implements OnInit {
  // @ViewChild(AbcModalComponent) modalComponent!: AbcModalComponent;
  @ViewChild(AbcModalComponent) qrScannerModal!: AbcModalComponent;
  @ViewChild(QrScannerComponent) qrScanner!: QrScannerComponent;

  data: any = {};
  selectedMode: string = 'Selecciona un modo';

  modal!: AbcModalComponent;

  qr: boolean = false;
  filtro!:any

  instance!: any;
  scanning=false

  searchText: string = '';
  modo!: string;
  constructor(
    private abc: AbcService,
    private darkModeService: DarkModeService
  ) {
    this.darkModeService.isDarkModeEnabled().subscribe((isDarkMode) => {
      // Actualiza la variable modo en función del estado del modo oscuro
      this.modo = !isDarkMode ? 'light' : 'dark';
    });
  }
  onSave(event: any): void { }
  onNew() {
    if (!this.instance) return;
    this.instance.openNewModal();

  }
  async ngOnInit() {
    await this.instance.isInstanceReady
  }

  isInstanceReady: boolean = false;
  onActivate(component: any) {
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
    this.instance = component;
    if (this.instance) {
      this.isInstanceReady = true;
      // component.data.subscribe((data: any) => {
      this.data = component.data;
      // });
      console.log(this.data);
    }

    $.unblockUI();
  }
  onFilter(event:any){
    // En caso de cambiar de filtro
  }
  onModeChange() {
    this.instance.mode = this.selectedMode;
  }
  onSearchChange() {
  }
  onSearch() {
    if (
      !this.data.searchLength ||
      this.searchText.length === this.data.searchLength ||
      !this.searchText
    ) {
      this.abc
        .buscar(this.data.url + this.data.urls.search, this.searchText, this.filtro)
        .subscribe((data: any) => {
          console.log(data);
          this.instance.found = data[this.data.response];
        });
    }
  }
  onModalToggle(modal: any) {
    modal.toggleModal();
  }
  onScan(event: string) {
    console.log(event);
    this.closeScanner();
    this.searchText = event;
    this.onSearch();
  }
  openScanner() {
    this.scanning=true
    if (this.qrScannerModal) {
      this.qrScannerModal.openModal();
      this.qrScanner.initScanner();
    }
  }
  closeScanner() {
    if (this.qrScannerModal) {
      this.qrScannerModal.closeModal()
      this.scanning=false
    }
  }
}

@Component({
  selector: 'app-abc-card',
  template: `
    <div class="card">
    <div class="card-body">
          <img *ngIf="img" [src]="img"class="img-fluid square-img rounded"
          />
        </div>
        <div class="grid-item info text-center">
        <ng-content></ng-content>
        </div>
    </div>

  `,
  styleUrls: ['./abc.component.css'],
})
export class AbcCardComponent implements OnInit {
  @Input() btn: any = {};
  @Input() img!: any;
  @Input() botones!: any;

  modo!: string;
  constructor(private darkModeService: DarkModeService) {
    this.darkModeService.isDarkModeEnabled().subscribe((isDarkMode) => {
      // Actualiza la variable modo en función del estado del modo oscuro
      this.modo = !isDarkMode ? 'light' : 'dark';
    });
  }
  ngOnInit(): void { }
}
@Component({
  selector: 'app-abc-card-container',
  template: `
    <!-- <div class="container" [attr.data-bs-theme]="modo">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5">
          <ng-content></ng-content>
        </div>
      </div>
    </div> -->
    <div class="container-xl">
      <div class="row text-center">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./abc.component.css'],
})
export class AbcCardContainerComponent implements OnInit {
  modo!: string;
  constructor(private darkModeService: DarkModeService) {
    this.darkModeService.isDarkModeEnabled().subscribe((isDarkMode) => {
      // Actualiza la variable modo en función del estado del modo oscuro
      this.modo = !isDarkMode ? 'light' : 'dark';
    });
  }
  ngOnInit(): void { }
}
