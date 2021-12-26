class NotImplementedException extends Error{
  constructor(){
    super('Function not implemented');
  }
}

class InterfaceCrud extends NotImplementedException{
  isConnected(){
    throw new NotImplementedException();
  }
  connect(){
    throw new NotImplementedException();
  }
  create(){
    throw new NotImplementedException();
  }
  read(){
    throw new NotImplementedException();
  }
  update(){
    throw new NotImplementedException();
  }
  delete(){
    throw new NotImplementedException();
  }
}

module.exports = InterfaceCrud;
