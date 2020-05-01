import { Rol } from '../_model/rol';
import { Usuario } from '../_model/usuario';

export class UsuarioListaRolDTO{
    usuario: Usuario;
    lstRol: Rol[];
}