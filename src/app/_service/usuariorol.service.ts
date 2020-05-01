import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Usuario } from '../_model/usuario';
import { Injectable } from '@angular/core';
import { UsuarioListaRolDTO } from '../_dto/usuarioListaRolDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {

  menuCambio = new Subject<Usuario[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/usuarioroles`;

  constructor(private http: HttpClient) { }

  listarRolPorUsuario(idUsuario: number){
    return this.http.get<UsuarioListaRolDTO>(`${this.url}/${idUsuario}`);
  }

  eliminar(dataDTO: UsuarioListaRolDTO) {
    return this.http.post(`${this.url}/delete`, dataDTO);
  }

  registrar(dataDTO: UsuarioListaRolDTO) {
    return this.http.post(this.url, dataDTO);
  }
}
