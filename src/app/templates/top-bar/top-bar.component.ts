import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

declare var $: any;
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: [
    './top-bar.component.css',
    '../../../styles.css'
  ],
})
export class TopBarComponent implements OnInit {
  @Input() modo!: string

  @Input() admin: boolean = false
  @Input() isAuth!: boolean
  constructor(
    private auth: AuthService,
    public darkModeService: DarkModeService) {
    this.darkModeService.isDarkModeEnabled().subscribe((isDarkMode) => {
      // Actualiza la variable modo en función del estado del modo oscuro
      this.modo = !isDarkMode ? 'light' : 'dark';
    });
  }

  isMobile: boolean = false;
  isDesktop: boolean = true;
  isMenuOpen: boolean = false; // Variable para controlar el estado del menú

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Hay una X?', this.isMenuOpen)
  }


  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit() {
    this.detectScreenWidth();
    window.addEventListener('resize', () => this.detectScreenWidth());
    // Retrasar la apertura de la barra lateral para la animación
    setTimeout(() => {
      this.openSidebar();
    }, 400); // Cambia el valor según tus necesidades
    console.log('en la topbar dice que es' + this.isAuth)
  }

  detectScreenWidth() {
    this.isMobile = window.innerWidth <= 1000; // Ajusta el ancho según tus necesidades
    this.isDesktop = !this.isMobile;
    if (this.isDesktop) {
      this.closeMenu();
    }
  }
  getAdminItems() { return adminItems }
  getItems() { return Items }
  openSidebar() {
    // Obtener el elemento de la barra lateral
    let x: HTMLElement | null = document.querySelector('.sidebar');

    // Verificar si x no es nulo antes de intentar agregar una clase
    if (x !== null) {
      x.classList.add('sidebar-open');
    }
  }
  onLogout() {
    if (this.admin && this.isAuth)
      $.blockUI({
        message: '<div class="text-center">Cerrando sesion</div><br><div style="display:grid;place-items:center"><img width="15%" src="assets/cagando.gif" style="position:relative;right:0%;top:30%"></div>',
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
    this.auth.logout().subscribe((data: any) => {
      if (data.status === 'OK') {
        location.reload();
      }
    });
  }
  onLogin() {
    if (this.admin && !this.isAuth)
      location.href = 'admin/login';
  }
}


export let adminItems = [
  {
    name: 'Clientes',
    href: 'clients',
  },
  {
    name: 'Pertenencias',
    href: 'abc/items',
  },
  {
    name: 'Empleados',
    href: 'abc/employee',
  },
  {
    name: 'Abonos',
    href: 'abc/items',
  },
  {
    name: 'Cotizaciones',
    href: 'quotations',
  },
  {
    name: 'Ventas',
    href: 'sellings',
  },
];
export let Items = [
  {
    name: 'Empeños',
    href: 'pawn',
  },
  {
    name: 'Calcular Empeño',
    href: 'pawn/calc',
  },
  {
    name: 'Cotizar Ahora',
    href: 'pawn/quotations',
  },
  // {
  //   name: 'Abonar',
  //   href: 'pay',
  // },
  {
    name: 'Inversiones',
    href: 'invest',
  },
];
