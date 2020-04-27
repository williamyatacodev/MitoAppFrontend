import { Menu } from './../../_model/menu';
import { MenuService } from 'src/app/_service/menu.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idMenu', 'nombre', 'url', 'acciones'];
  dataSource: MatTableDataSource<Menu>
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private menuService: MenuService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.menuService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 5000
      });
    });

    this.menuService.menuCambio.subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.menuService.listarPageable(0, 10).subscribe(data => {
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
    this.menuService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(idMenu: number) {
    this.menuService.eliminar(idMenu).subscribe(() => {
      this.menuService.listar().subscribe(data => {
        this.menuService.menuCambio.next(data);
        this.menuService.mensajeCambio.next('SE ELIMINO');
      });
    });
  }

}
