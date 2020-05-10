export function c(msg, m1 = '', m2 = '', tipo = '') {
  // if (m1!=''){
  //   m1=' '+m1.trim()+' ';
  // }
  // if (m2!=''){
  //   m2=' '+m2.trim()+' ';
  // }
  let c1 = 'background:#35495e ; color: #fff'
  let c2 = 'background:#41b883 ; color: #fff'
  if (tipo.trim() == 'warning') {
    c1 = 'background:#FF5733 ; color: #fff'
  }
  if (tipo.trim() == 'warning') {
    c1 = 'background:#FF5733 ; color: #fff'
  }
  if (tipo.trim() == 'info') {
    c1 = 'background:#1C72E7 ; color: #fff'
    c2 = 'background:#000 ; color: #fff'
  }

  if (tipo.trim() == 'error') {
    c1 = 'background:#ff0808 ; color: #fff'
    c2 = 'background:#000 ; color: #fff'
    console.error(
      '%c ' + m1 + ' %c ' + m2 + ' %c',
      'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
      'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
      'background:transparent',
      msg
    )
  } else {
    console.log(
      '%c ' + m1 + ' %c ' + m2 + ' %c',
      'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
      'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
      'background:transparent',
      msg
    )
  }

  return true
}
