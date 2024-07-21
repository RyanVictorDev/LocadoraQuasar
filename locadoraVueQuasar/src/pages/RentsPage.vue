<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Aluguéis
        <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm"/>
      </div>

      <q-input v-model="text" label="Pesquisar..." class="q-ml-lg col-md-8">
        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-input>
    </div>

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
  name: 'RentsPage',
});

const title = ''

const columns = [
  { name: 'renter', required: true, label: 'Locatário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'title', align: 'center', label: 'Título', field: 'title'},
  { name: 'author', align: 'center', label: 'Autor', field: 'author'},
  { name: 'publisher', align: 'center', label: 'Editora', field: 'publisher'},
  { name: 'devolution', align: 'center', label: 'Devolução', field: 'devolution'},
  { name: 'status', align: 'center', label: 'Status', field: 'status'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = [
  {
    name: 'Luiz',
    title: 'Pica Pau',
    author: 'José da Fonseca',
    publisher: 'Editorando',
    devolution: 'dd/mm/aaaa',
    status: 'No prazo',
    actions: 'Ação',
  },
  {
    name: 'Pedro',
    title: 'Livro Java',
    author: 'Farias',
    publisher: 'Editorando',
    devolution: 'dd/mm/aaaa',
    status: 'No prazo',
    actions: 'Ação',
  },
  {
    name: 'Maria',
    title: 'História do Brasil',
    author: '	Yuri',
    publisher: 'Editorando',
    devolution: 'dd/mm/aaaa',
    status: 'No prazo',
    actions: 'Ação',
  },
]
</script>
