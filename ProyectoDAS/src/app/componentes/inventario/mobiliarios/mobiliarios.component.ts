import { Component } from '@angular/core';
import { MobiliariosService } from '../../../services/mobiliarios.service';
import { AreaMobiliarioService } from '../../../services/area.mobiliario.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncargadosService } from '../../../services/encargados.service';



@Component({
  selector: 'app-mobiliarios',
  templateUrl: './mobiliarios.component.html',
  styleUrl: './mobiliarios.component.css'
})
export class MobiliariosComponent {

  mobiliarios: any = [];
  muebles: any[] | undefined;
  encargados: any[] = [];
  areas: any[] = [];
  selectedCity: any;
  selectEncargado: any;
  selectArea: any;

  tooltipVisible: boolean = false;
  visible: boolean = false;
  nombreBuscado: string = '';
  esEdicion: boolean = false;

  id: string = '';
  bld_bca = '';
  nombre = '';
  marca = '';
  modelo = '';
  num_serie = '';
  material = '';
  color = '';
  fecha_adquisicion = '';
  estado = '';
  localizacion = '';
  codigoUTA = '';
  valor_contable = '';
  selectEncargados: any = null;
  selectAreas: any = null;

  constructor(private confirmationService: ConfirmationService, private mobiliariosService: MobiliariosService, private encargadosService: EncargadosService, private areasService: AreaMobiliarioService
    , private messageService: MessageService) {
    this.listarMobiliario()
  }

  id_bien_mob = '';
  id_encargado_per = '';
  id_area_per = '';

  ngOnInit() {
    this.listarMobiliario();
    this.listarEncargadosPorNombre();
    this.listarAreas();

    this.muebles = [
      { name: 'Archivador', code: 'CO' },
      { name: 'Sillas', code: 'CO' },
      { name: 'Mesas de Computadora', code: 'CA' },
      { name: 'Pizarrones', code: 'AI' },
      { name: 'Bancas', code: 'IM' },
      { name: 'Lockers', code: 'IM' },
    ]


  }
  listarEncargadosPorNombre(): void {
    this.encargadosService.obtenerEncargados().subscribe(
      (response: any) => {
        if (response && response.encargados) {
          this.encargados = response.encargados;
        } else {
          this.encargados = [];
        }
      },
      (error) => {
        console.error('Error al obtener encargado:', error);
      }
    );
  }
  listarAreas(): void {
    console.log("ok");
    this.areasService.obtenerAreas().subscribe(
      (response: any) => {

        if (response ) {
          this.areas = response;
        } else {
          this.areas = [];
        }
        console.log(this.areas);
      },
      
      (error) => {
        console.error('Error al obtener areas:', error);
      }
    );
  }



  listarMobiliario(): void {
    this.mobiliariosService.obtenerMobiliarios().subscribe(
      (response: any) => {
        if (response && response.mobiliarios) {
          this.mobiliarios = response.mobiliarios;
        } else {
          this.mobiliarios = [];
        }
      },
      (error) => {
        console.error('Error al obtener mobiliarios:', error);
      }
    )
  }

  cargarMobiliario(nombre: string): void {
    this.mobiliariosService.obtenerUsuarioPorNombre(nombre).subscribe(
      (response: any) => {
        if (response && response.mobiliarios) {
          this.mobiliarios = response.mobiliarios;
        } else {
          this.mobiliarios = [];
        }
      },
      (error) => {
        console.error('Usuario no encontrado:', error);
      }
    );
  }
  buscarMobiliario() {
    this.cargarMobiliario(this.nombreBuscado);
  }


  registrarMobiliario() {
    if (this.bld_bca == '' || this.nombre == '' || this.marca == '' || this.modelo == '' ||
      this.num_serie == '' || this.material == '' || this.color == '' || this.fecha_adquisicion == '' || this.estado == '' || this.localizacion == '' ||
      this.codigoUTA == '' || this.valor_contable == '' || this.selectEncargado == '' || this.selectArea == '') {
      this.mostrarMensaje("Complete todos los campos", false);
    } else {
      const valorContableInt = parseFloat(this.valor_contable);
      const fechaAdquisicionDate = new Date(this.fecha_adquisicion);

      if (isNaN(valorContableInt) || isNaN(fechaAdquisicionDate.getTime())) {
        this.mostrarMensaje("Datos numéricos o de fecha inválidos", false);
        return;
      }

      this.mobiliariosService.insertarMobiliaria(this.bld_bca, this.nombre, this.marca, this.modelo,
        this.num_serie, this.material, this.color, fechaAdquisicionDate, this.estado, this.localizacion,
        this.codigoUTA, valorContableInt, this.selectEncargado.id_encargado, this.selectArea.id_area).subscribe(
          (response) => {
            this.mostrarMensaje("Bien registrado con éxito", true);
            this.limpiarFormulario();
            this.visible = false;
            this.listarMobiliario();
          },
          (error) => {
            this.mostrarMensaje("Error al registrar el mobiliario", false);
          }
        );
    }
  }


  showTooltip() {
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }
  showDialog() {
    this.visible = true;
    this.listarMobiliario()
  }

  eliminarMobiliario(id: string) {
    this.mobiliariosService.eliminarMobiliario(id).subscribe(
      (response) => {
        this.mostrarMensaje("Bien eliminado con éxito", true);
        this.listarMobiliario();
      },
      (error) => {
        this.mostrarMensaje("Error al eliminar el Bien", false);
      }
    );
  }

  editarMobiliario() {
    if (this.bld_bca == '' || this.nombre == '' || this.marca == '' || this.modelo == '' ||
      this.num_serie == '' || this.material == '' || this.color == '' || this.fecha_adquisicion == '' || this.estado == '' || this.localizacion == '' ||
      this.codigoUTA == '' || this.valor_contable == '' || this.selectEncargado == '' || this.selectArea == '') {
      this.mostrarMensaje("Complete todos los campos", false);
    } else {
      const valorContableInt = parseFloat(this.valor_contable);
      const fechaAdquisicionDate = new Date(this.fecha_adquisicion);

      // Verifica que las conversiones sean válidas
      if (isNaN(valorContableInt) || isNaN(fechaAdquisicionDate.getTime())) {
        this.mostrarMensaje("Datos numéricos o de fecha inválidos", false);
        return;
      }


      this.mobiliariosService.actualizarMobiliarios(this.id, this.bld_bca, this.nombre, this.marca, this.modelo, this.num_serie, this.material,
        this.color, fechaAdquisicionDate, this.estado, this.localizacion, this.codigoUTA, valorContableInt, this.selectEncargado.id_encargado, this.selectArea.id_area).subscribe(
          (response) => {
            this.mostrarMensaje("Bien actualizo con éxito", true);
            //this.limpiarFormulario();
            this.visible = false;
            this.listarMobiliario();
          },
          (error) => {
            this.mostrarMensaje("Error al actualizar el mobiliario", false);
          }
        );
    };
  }

  showDialogAgregar() {
    this.esEdicion = false;
    this.visible = true;
    this.limpiarFormulario();
  }


  showDialogEditar(mobiliario: any) {
    this.esEdicion = true;
    this.bld_bca = mobiliario.bld_bca;
    this.nombre = mobiliario.nombre;
    this.marca = mobiliario.marca;
    this.modelo = mobiliario.modelo;
    this.num_serie = mobiliario.num_serie;
    this.material = mobiliario.material;
    this.color = mobiliario.color;
    this.fecha_adquisicion = mobiliario.fecha_adquisicion;
    this.estado = mobiliario.estado;
    this.localizacion = mobiliario.localizacion;
    this.codigoUTA = mobiliario.codigoUTA;
    this.valor_contable = mobiliario.valor_contable;
    this.selectEncargado = this.encargados.find(encargado => encargado.id_encargado === mobiliario.id_encargado_per);
    this.selectArea = this.areas.find(area => area.id_area === mobiliario.id_area_per);
    this.id = mobiliario.id_bien_mob;
    this.visible = true;
  }



  async mostrarMensaje(mensaje: string, exito: boolean) {
    this.messageService.add(
      {
        severity: exito ? 'success' : 'error',
        summary: exito ? 'Éxito' : 'Error', detail: mensaje
      });
  }

  confirm(id: string) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea eliminar el Bien Mobiliario?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarMobiliario(id);
        this.listarMobiliario();
      },
      reject: () => {
        console.log("rechazado");
      }
    });
  }

  limpiarFormulario() {
    this.id_bien_mob = '';
    this.bld_bca = '';
    this.nombre = '';
    this.marca = '';
    this.modelo = '';
    this.num_serie = '';
    this.material = '';
    this.color = '';
    this.fecha_adquisicion = '';
    this.estado = '';
    this.localizacion = '';
    this.codigoUTA = '';
    this.valor_contable = '';
    this.selectEncargado = null;
    this.selectArea = null;
  }

}



