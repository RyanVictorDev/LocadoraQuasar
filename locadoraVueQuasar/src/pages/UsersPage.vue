<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="row items-center q-mx-auto text-h5">
        <div class="text-weight-bold q-mr-lg">
          Usuários
          <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm" @click="openRegisterDialog"/>
        </div>

        <q-form @submit="getRows(srch)" class="q-ml-sm col" input-style="min-width: 100%">
          <q-input v-model="srch" label="Pesquisar..." class="q-ml-sm col" input-style="min-width: 100%">
            <template v-slot:append>
              <q-icon v-if="srch !== ''" name="close" @click="srch = ''" class="cursor-pointer" />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="search" />
            </template>
          </q-input>
        </q-form>
      </div>

      <TableComponent
        :title="title"
        :rows="rows"
        :columns="columns"
        :icons="icons"
        @action="handleAction"
      />

      <q-dialog v-model="dialogs.register.visible" persistent>
        <q-card class="widhtModal">
          <q-card-section class="row items-center">
            <q-avatar icon="add" color="teal-10" text-color="white" />
            <span class="q-ml-sm">Cadastrar novo usuário</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit="registerAction(shape)" class="q-gutter-md q-my-auto">
              <q-input v-model="userToCreate.name" label="Nome do usuário" filled lazy-rules :rules="[val => val && val.length > 3 || 'É nescessário ter mais de três caracteres']"/>
              <q-input v-model="userToCreate.email" label="Email" filled lazy-rules :rules="[val => val && val.length > 0 || 'Adicione algo']"/>
              <q-input v-model="userToCreate.password" label="Senha" type="password" filled lazy-rules :rules="[val => val && val.length > 0 || 'Adicione algo']"/>

              <div class="q-gutter-sm q-px-auto">
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Editor" label="Editor" />
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Locatário" label="Locatário" />
              </div>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.register.visible = false" />
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

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
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';
import { api, authenticate } from 'src/boot/axios';

defineOptions({
  name: 'UsersPage',
});

const srch = ref('');

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

const dialogs = ref({
  register: {
    visible: false,
    row: {
      name: ''
    }
  },
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

const shape = ref('line')

const userToCreate = ref({
  name: '',
  email: '',
  password: '',
  role: ''
});

const openRegisterDialog = () => {
  dialogs.value.register.visible = true;
};

const registerAction = (shape) => {
  userToCreate.value.role = shape
  console.log(userToCreate);
};
</script>
