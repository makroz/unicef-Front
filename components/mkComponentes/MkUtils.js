export function c(msg,tipo='',accion=''){
  if (tipo!=''){
    tipo=' '+tipo.trim()+' ';
  }
  if (accion!=''){
    accion=' '+accion.trim()+' ';
  }
  console.log('%c'+tipo+'%c'+accion+'%c',
  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  'background:transparent',
  msg);
  return true;
}

