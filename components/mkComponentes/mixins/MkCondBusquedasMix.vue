<script>
export default {
  name: 'MkCondBusquedasMix',
  data() {
    return {
      condiciones: {
        text: [
          { value: '11', text: 'contiene' },
          { value: '12', text: 'no contiene' },
          { value: '0', text: 'igual a' },
          { value: '1', text: 'diferente de' },
          { value: '13', text: 'empieza por' },
          { value: '14', text: 'no empieza por' },
          { value: '15', text: 'termina por' },
          { value: '16', text: 'no termina por' }
        ],
        num: [
          { value: '20', text: 'igual a' },
          { value: '21', text: 'diferente de' },
          { value: '22', text: 'mayor que' },
          { value: '23', text: 'menor que' },
          { value: '24', text: 'mayor o igual que' },
          { value: '25', text: 'menor o igual que' }
        ],
        lista: [
          { value: '20', text: 'igual a' },
          { value: '21', text: 'diferente de' }
        ],

        date: [
          { value: '40', text: 'igual a' },
          { value: '41', text: 'diferente de' },
          { value: '42', text: 'mayor que' },
          { value: '43', text: 'menor que' },
          { value: '44', text: 'mayor o igual que' },
          { value: '45', text: 'menor o igual que' }
        ]
      }
    }
  }
}
</script>
