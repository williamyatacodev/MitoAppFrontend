import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Menu } from '../_model/menu';
import { Injectable } from '@angular/core';
import { MenuListaRolDTO } from '../_dto/menuListaRolDTO';

@Injectable({
  providedIn: 'root'
})
export class MenuRolService {

  menuCambio = new Subject<Menu[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/menuroles`;
  //url: string = `${environment.HOST}/${environment.MICRO_CR}/menus`;

  constructor(private http: HttpClient) { }

  listarRolPorMenu(idMenu: number){
    return this.http.get<MenuListaRolDTO>(`${this.url}/${idMenu}`);
  }

  eliminar(dataDTO: MenuListaRolDTO) {
    return this.http.post(`${this.url}/delete`, dataDTO);
  }

  registrar(dataDTO: MenuListaRolDTO) {
    return this.http.post(this.url, dataDTO);
  }
}
