import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../_model/usuario';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    usuarioCambio = new Subject<Usuario[]>();
    url: string = `${environment.HOST}/usuarios`;

    constructor(private http: HttpClient) { }

    listar(){
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.get<Usuario[]>(`${this.url}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    listarPorId(idUsuario: number) {
        return this.http.get<Usuario>(`${this.url}/${idUsuario}`);
      }

    listarPageable(p: number, s:number){
        return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
    }
}