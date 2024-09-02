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
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="ADMIN" label="Editor" />
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="VISITOR" label="Locatário" />
              </div>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.register.visible = false" />
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.view.visible" persistent>
        <q-card>
          <q-card-section class="row items-center column">
            <div>
              <q-avatar icon="visibility" color="blue" text-color="white" />
              <span class="q-ml-sm text-h6">Detalhes do usuário {{ dialogs.view.row.name }}</span>
            </div>

            <div class="q-ml-sm ">
              <div class="column q-mt-md">
                <span class="q-ml-sm col"><q-icon name="key"/> Id: {{ userInfor.id }}</span>
                <span class="q-ml-sm col"><q-icon name="person"/> Nome: {{ userInfor.name }}</span>
                <span class="q-ml-sm col"><q-icon name="insert_drive_file"/> Cargo: {{ userInfor.role }}</span>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Fechar" color="primary" @click="dialogs.view.visible = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.edit.visible" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="edit" color="green" text-color="white" />
            <span class="q-ml-sm">Você tem certeza que deseja editar o usuário {{ dialogs.edit.row.name }}?</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit="performEditAction(shape)" class="q-gutter-md q-my-auto">
              <q-input v-model="userInfor.name" label="Nome do usuário" filled lazy-rules :rules="[val => val && val.length > 3 || 'É nescessário ter mais de três caracteres']"/>
              <q-input v-model="userInfor.email" label="Email" filled lazy-rules :rules="[val => val && val.length > 0 || 'Adicione algo']"/>
              <q-input v-model="userInfor.password" label="Senha" type="password" filled lazy-rules :rules="[val => val && val.length > 0 || 'Adicione algo']"/>

              <div class="q-gutter-sm q-px-auto">
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="ADMIN" label="Editor" />
                <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="VISITOR" label="Locatário" />
              </div>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false" />
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';
import { api, authenticate } from 'src/boot/axios';

defineOptions({
  name: 'UsersPage',
});

onMounted(() => {
  getRows();
});

const $q = useQuasar();

const showNotification = (type, msg) => {
  $q.notify({
    type: type,
    message: msg,
    position: 'bottom-right',
    timeout: 3000
  });
};

const columns = [
  { name: 'name', required: true, label: 'Nome do usuário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'role', align: 'center', label: 'Permissão', field: 'role'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = ref([]);

const srch = ref('');

const getRows = (srch = '') => {
  api.get('/user', { params: { search: srch } })
    .then(response => {
      rows.value = response.data;
      console.log(response)
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter dados!");
      console.error("Erro ao obter dados:", error);
    });
};

const dialogs = ref({
  register: {
    visible: false,
    row: {
      name: ''
    }
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

const icons = ['visibility', 'edit'];

const handleAction = ({ row, icon }) => {
  if (icon === 'delete') {
    dialogs.value.delete.row = row;
    dialogs.value.delete.visible = true;
  } else if (icon === 'visibility') {
    dialogs.value.view.row = row;
    dialogs.value.view.visible = true;
    showMore(row.id);
  } else if (icon === 'edit') {
    dialogs.value.edit.row = row;
    dialogs.value.edit.visible = true;
    showMore(row.id);
  }
};

const openRegisterDialog = () => {
  dialogs.value.register.visible = true;
};

const userToCreate = ref({
  name: '',
  email: '',
  password: '',
  role: ''
});

const createRow = (userToCreate) => {
  api.post('/user', userToCreate)
    .then(response => {
      console.log("Sucesso ao criar novo usuário", response);
      dialogs.value.register.visible = false;
      showNotification('positive', "Usuário criado com sucesso!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao criar usuário!");
      console.log("Erro ao criar usuário", error);
    });
};

const registerAction = (shape) => {
  userToCreate.value.role = shape
  createRow(userToCreate.value);
  console.log(userToCreate);
};

const userInfor = ref([]);

const showMore = (id) => {
  api.get('/user/' + id)
    .then(response => {
      userInfor.value = response.data;
      console.log(userInfor.value);
      showNotification('positive', "Detalhes obtidos com sucesso!");
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter detalhes do usuario!");
      console.error("Erro ao obter detalhes do usuario:", error);
    });
};

/* NAO FUNCIONAL */

const editRow = (userInfor) => {
  api.put('/user', userInfor)
    .then(response => {
      console.log("Sucesso ao editar", response);
      showNotification('positive', "Sucesso ao editar!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao editar!");
      console.log("Erro ao editar", error)
    })
};

const performEditAction = (shape) => {
  renterInfor.value.role = shape;
  editRow(renterInfor.value);
  dialogs.value.edit.visible = false;
};
</script>
