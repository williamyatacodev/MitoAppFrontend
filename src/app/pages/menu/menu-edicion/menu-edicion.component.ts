import { Menu } from './../../../_model/menu';
import { MenuService } from 'src/app/_service/menu.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-menu-edicion',
  templateUrl: './menu-edicion.component.html',
  styleUrls: ['./menu-edicion.component.css']
})
export class MenuEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private menuService : MenuService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.required, Validators. minLength(3)]),
      'icono' : new FormControl(''),
      'url': new FormControl('',[Validators.required, Validators. minLength(3)])
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

    let menu = new Menu();
    menu.idMenu = this.form.value['id'];
    menu.nombre = this.form.value['nombre'];
    menu.icono = this.form.value['icono'];
    menu.url = this.form.value['url'];

    if(this.edicion){
      this.menuService.modificar(menu).subscribe( ()=> {
        this.menuService.listar().subscribe(data => {
          this.menuService.menuCambio.next(data);
          this.menuService.mensajeCambio.next('SE MODIFICO');
        });
      });
    }else{
      this.menuService.registrar(menu).subscribe( () => {
        this.menuService.listar().subscribe(data => {
          this.menuService.menuCambio.next(data);
          this.menuService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    
    this.router.navigate(['menu']);
  }

  initForm(){
    if(this.edicion){
      this.menuService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre),
          'icono': new FormControl(data.icono),
          'url': new FormControl(data.url)
        });
      });
    }
  }

}
