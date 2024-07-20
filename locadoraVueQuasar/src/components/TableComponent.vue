<template>
  <q-table
        flat bordered
        table-header-style="background-color: #105352; color: #fff"
        separator="cell"
        :title="Testando"
        :rows="rows"
        :columns="columns"
        row-key="name"
        color="primary"
      />
</template>

<script setup>
  defineOptions({
    name: 'TableComponent'
  })

</script>
