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
  name: 'PublishersPage',
});

const title = ''

const columns = [
  { name: 'publisher', required: true, label: 'Nome da Editora', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = [
  {
    name: 'Editorando',
    actions: 'Ação',
  },
  {
    name: 'Editora Show',
    actions: 'Ação',
  },
  {
    name: 'Saraijavas',
    actions: 'Ação',
  },
]
</script>
