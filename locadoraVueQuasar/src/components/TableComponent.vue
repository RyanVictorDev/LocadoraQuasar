<template>
  <q-table
    flat bordered
    table-header-style="background-color: #105352; color: #fff"
    separator="cell"
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="name"
    color="primary"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round :icon="icon"/>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps } from 'vue';

defineOptions({
  name: 'TableComponent'
});

const props = defineProps({
  title: String,
  rows: Array,
  columns: Array,
  icon: String
});

const handleAction = (row) => {
  // Adicione a lógica para a ação aqui
  console.log('Ação na linha:', row);
};
</script>
