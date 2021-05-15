<script>
export default {
  name: "MkEstadosMix",
  data() {
    return {
           lEstadosSol: [
        'Por Revisar',
        'Pendiente',
        'Asignado',
        'Realizado',
        'Verificado',
        'Autorizado',
        'Comercial',
        'Completado',
        'Anulado',
        'No se Atendio',
      ],
      lColorSol: [
        'red--text',
        'gray--text ',
        'green--text text--lighten-1',
        'green--text',
        'green--text text--darken-2',
        'green--text text--darken-4',
        'green--text text--darken-4',
        'green--text text--darken-4',
        'gray--text text--lighten-3',
        'red--text',
      ],

    };
  },
};
</script>
