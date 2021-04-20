import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Especialidad } from '../../../_model/especialidad';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EspecialidadService } from '../../../_service/especialidad.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  form!: FormGroup;
  especialidad!: Especialidad;
  id!: number;
  edicion: boolean = false;


  constructor(
    private route: ActivatedRoute,
    //Se crea un rauter para controlar la navegación
    private router: Router,
    private especialidadService: EspecialidadService
  ) { }

  ngOnInit() {

    this.especialidad = new Especialidad();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl('')
    });


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  operar(){
    this.especialidad.idEspecialidad = this.form.value['id'];
    this.especialidad.nombre = this.form.value['nombre'];
    this.especialidad.descripcion = this.form.value['descripcion'];

    if(this.especialidad != null && this.especialidad.idEspecialidad > 0){
      //MODIFICAR
      this.especialidadService.modificar(this.especialidad).pipe(switchMap( ()=>{
        return this.especialidadService.listar();
      })).subscribe(data=>{
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio('SE MODIFICÓ');
      });
    }else{
      //RESGISTRAR
      this.especialidadService.registrar(this.especialidad).pipe(switchMap( data=>{
        return this.especialidadService.listar();
      })).subscribe(data=>{
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio('SE REGISTRÓ');
      });
    }

    this.router.navigate(['especialidad']);
  }

  initForm() {
    if (this.edicion) {
      this.especialidadService.listarPorId(this.id).subscribe(data => {
        let id = data.idEspecialidad;
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
