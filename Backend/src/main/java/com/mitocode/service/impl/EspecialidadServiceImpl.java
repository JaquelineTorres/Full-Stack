package com.mitocode.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mitocode.model.Especialidad;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.IEspecialidadRepo;
import com.mitocode.service.IEspecialidadService;

@Service
public class EspecialidadServiceImpl extends CRUDImpl<Especialidad, Integer> implements IEspecialidadService{
	
	@Autowired
	private IEspecialidadRepo repo;

	@Override
	protected IGenericRepo<Especialidad, Integer> getRepo() {
		// TODO Auto-generated method stub
		return repo;
	}

	/*@Override
	public Especialidad registar(Especialidad p) throws Exception {
		// TODO Auto-generated method stub
		return repo.save(p);
	}

	@Override
	public Especialidad modificar(Especialidad p) throws Exception {
		// TODO Auto-generated method stub
		return repo.save(p);
	}

	@Override
	public List<Especialidad> listar() throws Exception {
		// TODO Auto-generated method stub
		return repo.findAll();
	}

	@Override
	public Especialidad listarPorId(Integer id) throws Exception {
		// TODO Auto-generated method stub
		Optional<Especialidad> op = repo.findById(id);
		return op.isPresent() ? op.get() : new Especialidad();
	}

	@Override
	public void eliminar(Integer id) throws Exception {
		// TODO Auto-generated method stub
		
	}*/

}
