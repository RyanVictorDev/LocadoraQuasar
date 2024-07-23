<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
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
      :icons="icons"
      @action="handleAction"
    />

    <q-dialog v-model="dialogs.delete.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja excluir o usuário {{ dialogs.delete.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.delete.visible = false" />
          <q-btn flat label="Excluir" color="primary" @click="performDeleteAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.edit.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="green" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja editar o usuário {{ dialogs.edit.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false" />
          <q-btn flat label="Editar" color="primary" @click="performEditAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';
import { api, authenticate } from 'src/boot/axios';

defineOptions({
  name: 'UsersPage',
});

const text = ref('');

const dialogs = ref({
  delete: {
    visible: false,
    row: null
  },
  view: {
    visible: false,
    row: null
  },
  edit: {
    visible: false,
    row: null
  }
});

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
    actions: '',
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
    actions: '',
  },

  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
  {
    name: 'Ednaldo Pereira',
    permission: 'Locatário',
    email: 'reidanet@gmail.com',
    actions: '',
  },
]

const icons = ['edit', 'delete'];

const handleAction = ({ row, icon }) => {
  if (icon === 'delete') {
    dialogs.value.delete.row = row;
    dialogs.value.delete.visible = true;
  } else if (icon === 'edit') {
    dialogs.value.edit.row = row;
    dialogs.value.edit.visible = true;
  }
};
</script>
