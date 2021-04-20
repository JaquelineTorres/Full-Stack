import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from '../../_model/medico';
import { MedicoService } from '../../_service/medico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
//TABLA QUE SE MUESTRA EN LA PANTALLA
  displayedColumns = ['idmedico', 'nombres', 'apellidos', 'cmp','acciones'];
  dataSource!: MatTableDataSource<Medico>;
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private medicoService: MedicoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.medicoService.getMedicoCambio().subscribe(data =>{
      this.crearTabla(data);
    });
    this.medicoService.getMensajeCambio().subscribe(data =>{
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });
    this.medicoService.listar().subscribe(data=>{
      this.crearTabla(data);
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  // "?" INDICA PARACMETRO 'OPCIONAL'
  abrirDialogo(medico?: Medico){
    this.dialog.open(MedicoDialogoComponent, {
      data: medico,
      width: '250 px'
    });

  }

  eliminar(medico: Medico){

  }

  crearTabla(data: Medico[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
