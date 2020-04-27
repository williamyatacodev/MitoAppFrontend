import { Rol } from './../../_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idRol', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<Rol>
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private rolService: RolService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.rolService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 5000
      });
    });

    this.rolService.rolCambio.subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.rolService.listarPageable(0, 10).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  mostrarMas(e: any) {
    this.rolService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(idRol: number) {
    this.rolService.eliminar(idRol).subscribe(() => {
      this.rolService.listar().subscribe(data => {
        this.rolService.rolCambio.next(data);
        this.rolService.mensajeCambio.next('SE ELIMINO');
      });
    });
  }

}
