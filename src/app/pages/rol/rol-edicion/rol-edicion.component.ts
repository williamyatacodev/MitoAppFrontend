import { Rol } from './../../../_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-rol-edicion',
  templateUrl: './rol-edicion.component.html',
  styleUrls: ['./rol-edicion.component.css']
})
export class RolEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private rolService : RolService
  ) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.required, Validators. minLength(3)])
    });

    this.route.params.subscribe((params : Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  get f() { return this.form.controls; }

  grabar(){

    if(this.form.invalid){
      return;
    }

    let rol = new Rol();
    rol.idRol = this.form.value['id'];
    rol.nombre = this.form.value['nombre'];

    if(this.edicion){
      this.rolService.modificar(rol).subscribe( ()=> {
        this.rolService.listar().subscribe(data => {
          this.rolService.rolCambio.next(data);
          this.rolService.mensajeCambio.next('SE MODIFICO');
        });
      });
    }else{
      this.rolService.registrar(rol).subscribe( () => {
        this.rolService.listar().subscribe(data => {
          this.rolService.rolCambio.next(data);
          this.rolService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    
    this.router.navigate(['rol']);
  }

  initForm(){
    if(this.edicion){
      this.rolService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idRol),
          'nombre': new FormControl(data.nombre)
        });
      });
    }
  }

}
