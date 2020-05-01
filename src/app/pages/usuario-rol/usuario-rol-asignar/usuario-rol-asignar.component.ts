import { Usuario } from './../../../_model/usuario';
import { UsuarioListaRolDTO } from 'src/app/_dto/usuarioListaRolDTO';
import { Rol } from 'src/app/_model/rol';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { UsuarioRolService } from 'src/app/_service/usuariorol.service';
import { RolService } from 'src/app/_service/rol.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-usuario-rol-asignar',
  templateUrl: './usuario-rol-asignar.component.html',
  styleUrls: ['./usuario-rol-asignar.component.css']
})
export class UsuarioRolAsignarComponent implements OnInit {

  form: FormGroup;
  id: number;
  roles: Rol[];
  rolesNuevos: Rol[] = [];
  rolesActuales: UsuarioListaRolDTO;
  idRolSeleccionado: number;
  mensaje: string;

  constructor(private route: ActivatedRoute,
    private router : Router,
    private usuarioService : UsuarioService,
    private usuariorolService : UsuarioRolService,
    private rolService : RolService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl(''),
    });

    this.route.params.subscribe((params : Params) => {
      this.id = params['id'];
      this.initForm();
    });
    
    this.listarRoles();
    this.listarRolesPorUsuario();
  }

  initForm(){
    this.usuarioService.listarPorId(this.id).subscribe(data => {
      this.form = new FormGroup({
        'id': new FormControl(data.idUsuario),
        'nombre': new FormControl(data.username)
      });
    });    
}

  listarRoles(){
    console.log('listarRoles');
    this.rolService.listar().subscribe(data => {
      this.roles = data;
    });
  }

  listarRolesPorUsuario(){
    this.usuariorolService.listarRolPorUsuario(this.id).subscribe(data => {  
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

  agregar(){

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

  grabar(){
    if(this.rolesNuevos.length > 0){

      if(this.rolesActuales[0] != null){
        //Eliminar actuales roles asignados
        let usuarioDelete = new Usuario();
        usuarioDelete.idUsuario = this.id;

        let usuarioListaRolDTODelete = new UsuarioListaRolDTO();
        usuarioListaRolDTODelete.usuario = usuarioDelete;
        usuarioListaRolDTODelete.lstRol = this.rolesActuales[0].usuario.roles;

        this.usuariorolService.eliminar(usuarioListaRolDTODelete).subscribe( () => {
            console.log('usuario rol eliminado');
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
    let usuario = new Usuario();
    usuario.idUsuario = this.id;

    let usuarioListaRolDTO = new UsuarioListaRolDTO();
    usuarioListaRolDTO.usuario = usuario;
    usuarioListaRolDTO.lstRol = this.rolesNuevos;

    this.usuariorolService.registrar(usuarioListaRolDTO).subscribe( data => {
      this.snackBar.open("Se asigno Roles", "Aviso", { duration: 2000 });
    });

    this.router.navigate(['usuariorol']);
  }

}
