import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
//TABLA QUE SE MUESTRA EN LA PANTALLA
  displayedColumns = ['idPaciente', 'nombre', 'apellidos', 'editar', 'borrar'];
  dataSource!: MatTableDataSource<Paciente>;
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cantidad!: number;

  constructor(
    private pacienteService: PacienteService,
    private snackbar: MatSnackBar,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pacienteService.getPacienteCambio().subscribe(data =>{
      this.crearTabla(data);
    });
    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackbar.open(data, 'AVISO', { duration: 2000 });
    });
    /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/
    this.pacienteService.listarPageable(0,10).subscribe(data=>{
      //this.crearTabla(data.content);
      this.cantidad=data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Paciente[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number){
    this.pacienteService.eliminar(id).pipe(switchMap( ()=>{
      return this.pacienteService.listar();
    })).subscribe( data =>{
      //PARA REFRESCAR LA TABLA Y MENSAJES
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajeCambio('SE ENLIMINÓ');
    });
  }

  //PARA PAGINEITOR
  mostrarMas(e: any){
    //console.log(e);
    this.pacienteService.listarPageable(e.pageIndex,e.pageSize).subscribe(data=>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
  }
}
