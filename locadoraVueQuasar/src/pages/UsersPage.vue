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
  name: 'UsersPage',
});

const title = ''

const columns = [
  { name: 'userName', required: true, label: 'Nome do usuário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'permission', align: 'center', label: 'Permissão', field: 'permission'},
  { name: 'email', align: 'center', label: 'Email', field: 'email'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = [
  {
    name: 'Fulano',
    permission: 'Editor',
    email: 'fulano@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Siclano',
    permission: 'Locatário',
    email: 'siclano@hotmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },

  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: 'Ação',
  },

]
</script>
