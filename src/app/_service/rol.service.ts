import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Rol } from '../_model/rol';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  rolCambio = new Subject<Rol[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/roles`;

  constructor(private http: HttpClient) { }

  listar(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.get<Rol[]>(`${this.url}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  listarPorId(idRol: number) {
    return this.http.get<Rol>(`${this.url}/${idRol}`);
  }

  registrar(rol: Rol) {
    return this.http.post(this.url, rol);
  }

  modificar(rol: Rol) {
    return this.http.put(this.url, rol);
  }

  eliminar(idRol: number) {
    return this.http.delete(`${this.url}/${idRol}`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
