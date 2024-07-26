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
    rows-per-page-label="Registros por página"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          v-for="icon in icons"
          :key="icon"
          flat
          round
          :icon="icon"
          @click="handleAction(props.row, icon)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineOptions({
  name: 'TableComponent'
});

const props = defineProps({
  title: String,
  rows: Array,
  columns: Array,
  icons: Array
});

const emit = defineEmits(['action']);

const handleAction = (row, icon) => {
  emit('action', { row, icon });
};
</script>
