<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Editoras
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
      :icon="icon"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';

defineOptions({
  name: 'PublishersPage',
});

const text = ref('');

const title = '';

const columns = [
  { name: 'publisher', required: true, label: 'Nome da Editora', align: 'center', field: row => row.name, format: val => `${val}` },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' },
];

const rows = [
  {
    name: 'Editorando',
    actions: '',
  },
  {
    name: 'Editora Show',
    actions: '',
  },
  {
    name: 'Saraijavas',
    actions: '',
  },
];

const icon = 'delete';
</script>
