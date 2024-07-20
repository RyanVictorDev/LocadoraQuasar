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
  import TableComponent from 'src/components/TableComponent.vue';

defineOptions({
  name: 'BooksPage',
});

const title = ''

const columns = [
  { name: 'title', required: true, label: 'Título', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'author', align: 'center', label: 'Autor', field: 'author'},
  { name: 'publisher', align: 'center', label: 'Editora', field: 'publisher'},
  { name: 'available', align: 'center', label: 'Disponíveis', field: 'available'},
  { name: 'rented', align: 'center', label: 'Alugados', field: 'rented'},
  { name: 'launch', align: 'center', label: 'Lançamento', field: 'launch'},
  { name: 'status', align: 'center', label: 'Status', field: 'status'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = [
  {
    name: 'Pica pau',
    author: 'Carinha',
    publisher: 'Editorando',
    available: '50',
    rented: '20',
    launch: '10/10/2010',
    status: 'Disponível',
    actions: 'Ação',
  },
  {
    name: 'Harry Potter',
    author: 'Aquele cara',
    publisher: 'Editorando',
    available: '40',
    rented: '20',
    launch: '10/08/2000',
    status: 'Disponível',
    actions: 'Ação',
  },
  {
    name: 'Outro livro',
    author: 'Fulano',
    publisher: 'Editorando',
    available: '0',
    rented: '20',
    launch: '5/12/2010',
    status: 'Indisponível',
    actions: 'Ação',
  },
]
</script>
