import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/_model/usuario';

@Component({
  selector: 'app-usuario-rol',
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.css']
})
export class UsuarioRolComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idUsuario', 'nombre', 'asignar'];
  dataSource: MatTableDataSource<Usuario>
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private usuarioService : UsuarioService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.usuarioService.usuarioCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.usuarioService.listarPageable(0, 5).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  mostrarMas(e: any) {
    this.usuarioService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}
