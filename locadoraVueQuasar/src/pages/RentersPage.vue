<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Locatários
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
  name: 'RentersPage',
});

const title = ''

const columns = [
  { name: 'name', required: true, label: 'Nome do locatário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'email', align: 'center', label: 'Email', field: 'email'},
  { name: 'phone', align: 'center', label: 'Telefone', field: 'phone'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'}
]

const rows = [
  {
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(xx) xxxxxxxxx',
    actions: 'Ação',
  },
  {
    name: 'Maria Souza',
    email: '	maria.souza@example.com',
    phone: '(xx) xxxxxxxxx',
    actions: 'Ação',
  },
  {
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    phone: '(xx) xxxxxxxxx',
    actions: 'Ação',
  },
]
</script>
