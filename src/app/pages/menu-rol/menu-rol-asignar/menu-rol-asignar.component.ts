import { Menu } from './../../../_model/menu';
import { Rol } from 'src/app/_model/rol';
import { MenuService } from 'src/app/_service/menu.service';
import { RolService } from 'src/app/_service/rol.service';
import { MenuListaRolDTO } from 'src/app/_dto/menuListaRolDTO';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuRolService } from 'src/app/_service/menurol.service';


@Component({
  selector: 'app-menu-rol-asignar',
  templateUrl: './menu-rol-asignar.component.html',
  styleUrls: ['./menu-rol-asignar.component.css']
})
export class MenuRolAsignarComponent implements OnInit {

  form: FormGroup;
  id: number;
  roles: Rol[];
  rolesNuevos: Rol[] = [];
  rolesActuales: MenuListaRolDTO;
  idRolSeleccionado: number;
  mensaje: string;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private menuService : MenuService,
    private menurolService : MenuRolService,
    private rolService : RolService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl(''),
    });

    this.route.params.subscribe((params : Params) => {
      this.id = params['id'];
      this.initForm();
    });
    
    this.listarRoles();
    this.listarRolesPorMenu();
  }

  initForm(){
      this.menuService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre)
        });
      });    
  }

  grabar(){

    if(this.rolesNuevos.length > 0){


      if(this.rolesActuales[0] != null){
        //Eliminar actuales roles asignados
        let menuDelete = new Menu();
        menuDelete.idMenu = this.id;

        let menuListaRolDTODelete = new MenuListaRolDTO();
        menuListaRolDTODelete.menu = menuDelete;
        menuListaRolDTODelete.lstRol = this.rolesActuales[0].menu.roles;

        this.menurolService.eliminar(menuListaRolDTODelete).subscribe( () => {
            console.log('menu rol eliminado');
            this.registrar();
            
        });
      }else{
        this.registrar();
      }
        
    }else{
      this.mensaje = 'Debe seleccionar un rol';
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }   
  }

  registrar(){
    //Asignar nuevos roles
    let menu = new Menu();
    menu.idMenu = this.id;

    let menuListaRolDTO = new MenuListaRolDTO();
    menuListaRolDTO.menu = menu;
    menuListaRolDTO.lstRol = this.rolesNuevos;

    this.menurolService.registrar(menuListaRolDTO).subscribe( data => {
      this.snackBar.open("Se asigno Roles", "Aviso", { duration: 2000 });
    });

    this.router.navigate(['menurol']);
  }

  agregar(){
    console.log(this.idRolSeleccionado);

    if (this.idRolSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.rolesNuevos.length; i++) {
        let rol = this.rolesNuevos[i];
        if (rol.idRol === this.idRolSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        this.mensaje = 'El rol se encuentra en la lista';
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        let rol = new Rol();
        rol.idRol = this.idRolSeleccionado;

        this.rolService.listarPorId(this.idRolSeleccionado).subscribe(data => {
          rol.nombre = data.nombre;
          this.rolesNuevos.push(rol);
        });
      }
    } else {
      this.mensaje = 'Debe seleccionar un rol';
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  listarRoles(){
    console.log('listarRoles');
    this.rolService.listar().subscribe(data => {
      this.roles = data;
    });
  }

  listarRolesPorMenu(){
    console.log('listarRolesPorMenu');
    this.menurolService.listarRolPorMenu(this.id).subscribe(data => {  
      this.rolesActuales = data;
      console.log(this.rolesActuales);
    });
  }

  removerRol(index: number) {
    this.rolesNuevos.splice(index, 1);
  }

  limpiar() {
    this.rolesNuevos = [];
    this.idRolSeleccionado = 0;
    this.mensaje = '';
  }

}
