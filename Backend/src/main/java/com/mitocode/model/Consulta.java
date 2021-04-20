package com.mitocode.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table (name = "consulta")
public class Consulta {
	
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idConsuta;
	
	@ManyToOne
	@JoinColumn(name = "id_paciente", nullable = false, foreignKey = @ForeignKey(name = "FK_consulta_paciente"))
	private Paciente paciente; 
	
	@Column(name = "num_consutorio", length = 3, nullable = true)
	private String numConsutorio;
	
	@Column(name = "fecha", nullable = false)
	private LocalDateTime fecha;
	
	@OneToMany(mappedBy = "consulta", cascade = {CascadeType.ALL}, orphanRemoval = true)
	private List <DetalleConsulta> detalleConsulta;

	public Integer getIdConsuta() {
		return idConsuta;
	}

	public void setIdConsuta(Integer idConsuta) {
		this.idConsuta = idConsuta;
	}

	public Paciente getPaciente() {
		return paciente;
	}

	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}

	public String getNumConsutorio() {
		return numConsutorio;
	}

	public void setNumConsutorio(String numConsutorio) {
		this.numConsutorio = numConsutorio;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public List<DetalleConsulta> getDetalleConsulta() {
		return detalleConsulta;
	}

	public void setDetalleConsulta(List<DetalleConsulta> detalleConsulta) {
		this.detalleConsulta = detalleConsulta;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idConsuta == null) ? 0 : idConsuta.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Consulta other = (Consulta) obj;
		if (idConsuta == null) {
			if (other.idConsuta != null)
				return false;
		} else if (!idConsuta.equals(other.idConsuta))
			return false;
		return true;
	}
	
	
	
	

}
