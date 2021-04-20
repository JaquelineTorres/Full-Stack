import { Component, OnInit } from '@angular/core';
import { Examen } from '../../../_model/examen';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ExamenService } from '../../../_service/examen.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {

  form!: FormGroup;
  examen!: Examen;
  id!: number;
  edicion: boolean = false;

  constructor(
    private route: ActivatedRoute,
    //Se crea un rauter para controlar la navegación
    private router: Router,
    private examenService: ExamenService
  ) { }

  ngOnInit() {

    this.examen = new Examen();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl(''),
    });


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  operar(){
    this.examen.idExamen = this.form.value['id'];
    this.examen.nombre = this.form.value['nombre'];
    this.examen.descripcion = this.form.value['descripcion'];

    if(this.examen != null && this.examen.idExamen > 0){
      //MODIFICAR
      this.examenService.modificar(this.examen).pipe(switchMap( ()=>{
        return this.examenService.listar();
      })).subscribe(data=>{
        this.examenService.setExamenCambio(data);
        this.examenService.setMensajeCambio('SE MODIFICÓ');
      });
    }else{
      //RESGISTRAR
      this.examenService.registrar(this.examen).pipe(switchMap( data=>{
        return this.examenService.listar();
      })).subscribe(data=>{
        this.examenService.setExamenCambio(data);
        this.examenService.setMensajeCambio('SE REGISTRÓ');
      });
    }

    this.router.navigate(['examen']);
  }

  initForm() {
    if (this.edicion) {
      this.examenService.listarPorId(this.id).subscribe(data => {
        let id = data.idExamen;
        let nombre = data.nombre;
        let descripcion = data.descripcion

        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        });
      });
    }
  }
}
