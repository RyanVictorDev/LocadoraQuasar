<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div>
        Usuários
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
