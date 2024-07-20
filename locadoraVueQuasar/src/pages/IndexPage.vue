<template>
  <q-page padding>
    <TableComponent
    :title="title"
    :rows="rows"
    :columns="columns"
    />
  </q-page>
</template>

<script setup>
import { ref} from 'vue'
import TableComponent from 'src/components/TableComponent.vue'

defineOptions({
  name: 'IndexPage',
});

const title = 'Teste'

const columns = [
  {
    name: 'name', required: true, label: 'Nome da Editora', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true},
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
]

const rows = [
  {
    name: 'Editorando',
    acoes: 159,
  },
  {
    name: 'Editora Massa',
    acoes: 237,
  },
  {
    name: 'Editora paia',
    acoes: 237,
  },

]
</script>

<style scoped lang="sass">

</style>
