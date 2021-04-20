package com.mitocode.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mitocode.model.Signos;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.ISignosRepo;
import com.mitocode.service.ISignosService;

@Service
public class SignosServiceImpl extends CRUDImpl<Signos, Integer> implements ISignosService{
	
	@Autowired
	private ISignosRepo repo;

	@Override
	protected IGenericRepo<Signos, Integer> getRepo() {
		// TODO Auto-generated method stub
		return repo;
	}

	/*@Override
	public Signos registar(Signos p) throws Exception {
		// TODO Auto-generated method stub
		return repo.save(p);
	}

	@Override
	public Signos modificar(Signos p) throws Exception {
		// TODO Auto-generated method stub
		return repo.save(p);
	}

	@Override
	public List<Signos> listar() throws Exception {
		// TODO Auto-generated method stub
		return repo.findAll();
	}

	@Override
	public Signos listarPorId(Integer id) throws Exception {
		// TODO Auto-generated method stub
		Optional<Signos> op = repo.findById(id);
		return op.isPresent() ? op.get() : new Signos();
	}

	@Override
	public void eliminar(Integer id) throws Exception {
		// TODO Auto-generated method stub
		
	}*/

}
