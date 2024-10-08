<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="row items-center q-mx-auto text-h5">
        <div class="text-weight-bold q-mr-lg">
          Editoras
          <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm" @click="openRegisterDialog"/>
        </div>

        <q-form @submit="getRows(srch)" class="q-ml-sm col" input-style="min-width: 100%">
          <q-input v-model="srch" label="Pesquisar..." class="q-ml-sm col" input-style="min-width: 100%">
            <template v-slot:append>
              <q-icon v-if="srch !== ''" name="close" @click="srch = '', getRows(srch)" class="cursor-pointer" />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="search" @click="getRows(srch)"/>
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
            <span class="q-ml-sm">Cadastrar Nova Editora</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md q-my-auto">
              <q-input v-model="publisherToCreate.name" label="Nome da Editora" filled lazy-rules :rules="[val => val && val.length > 3 || 'É nescessário ter mais de três caracteres']"/>
              <q-input v-model="publisherToCreate.email" label="Email" filled lazy-rules/>
              <q-input v-model="publisherToCreate.telephone" label="Telefone" filled lazy-rules/>
              <q-input v-model="publisherToCreate.site" label="Site" filled lazy-rules/>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.register.visible = false" />
                <q-btn flat label="Salvar" type="submit" color="primary" @click="registerAction"/>
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
              <span class="q-ml-sm text-h6">Detalhes da editora {{ dialogs.view.row.name }}</span>
            </div>

            <div class="q-ml-sm ">
              <div class="column q-mt-md">
                <span class="q-ml-sm col"><q-icon name="key"/> Id: {{ editoraInfor.id }}</span>
                <span class="q-ml-sm col"><q-icon name="edit"/> Nome: {{ editoraInfor.name }}</span>
                <span class="q-ml-sm col"><q-icon name="email"/> Email: {{ editoraInfor.email }}</span>
                <span class="q-ml-sm col"><q-icon name="phone"/> Telefone: {{ editoraInfor.telephone }}</span>
                <span class="q-ml-sm col"><q-icon name="language"/> Site: {{ editoraInfor.site }}</span>
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
            <span class="q-ml-sm">Você tem certeza que deseja editar a editora {{ dialogs.edit.row.name }}?</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md q-my-auto">
              <q-input v-model="editoraInfor.name" label="Nome da Editora" filled lazy-rules/>
              <q-input v-model="editoraInfor.email" label="Email" filled lazy-rules/>
              <q-input v-model="editoraInfor.telephone" label="Telefone" filled lazy-rules/>
              <q-input v-model="editoraInfor.site" label="Site" filled lazy-rules/>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false" />
                <q-btn flat label="Salvar" type="submit" color="primary" @click="performEditAction"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.delete.visible" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="red" text-color="white" />
            <span class="q-ml-sm">Você tem certeza que deseja excluir a editora {{ dialogs.delete.row.name }}?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" @click="dialogs.delete.visible = false"/>
            <q-btn flat label="Excluir" color="primary" @click="performDeleteAction"/>
          </q-card-actions>
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
  name: 'PublishersPage',
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
  { name: 'name', required: true, label: 'Nome da Editora', align: 'center', field: row => row.name, format: val => `${val}` },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' },
];

const rows = ref([]);

const srch = ref('');

const getRows = (srch = '') => {
  api.get('/publisher', { params: { search: srch } })
    .then(response => {
      if (Array.isArray(response.data)) {
        rows.value = response.data;
      } else {
        console.error('A resposta da API não é um array:', response.data);
        rows.value = [];
      }
      console.log('Resposta da API:', response.data);
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter dados!");
      console.error("Erro ao obter dados:", error);
    });
}

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

const icons = ['visibility', 'edit', 'delete'];

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

const publisherToCreate = ref({
  name: '',
  email: '',
  telephone: '',
  site: ''
});

const openRegisterDialog = () => {
  dialogs.value.register.visible = true;
};


const createRow = (publisherToCreate) => {
  api.post('/publisher', publisherToCreate)
  .then(response => {
    dialogs.value.register.visible = false;
    showNotification('positive', "Criado com sucesso!");
    getRows();
  })
  .catch(error => {
    showNotification('negative', "Algo deu errado!");
    console.log("Moio", error)
  })
};

const registerAction = () => {
  createRow(publisherToCreate.value);
};

const editoraInfor = ref([]);

const showMore = (id) => {
  api.get('/publisher/' + id)
    .then(response => {
      editoraInfor.value = response.data;
      showNotification('positive', "Dados obtidos com sucesso!");
      console.log(editoraInfor.value);
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter detalhes da editora...");
      console.error("Erro ao obter detalhes da editora:", error);
    });
}

const editRow = (editoraInfor) => {
  api.put('/publisher/' + editoraInfor.id, editoraInfor)
    .then(response => {
      showNotification('positive', "Editado com sucesso!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao editar...");
      console.log("deunao", error)
    })
};

const performEditAction = () => {
  editRow(editoraInfor.value);
  dialogs.value.edit.visible = false;
};

const deleteRow = (id) => {
  api.delete('/publisher/' + id)
    .then(() => {
      rows.value = rows.value.filter(row => row.id !== id);
      dialogs.value.delete.visible = false;
      showNotification('positive', "Excluído com sucesso!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao excluir...");
      console.error("Erro ao excluir editora:", error);
    });
};

const performDeleteAction = () => {
  const { row } = dialogs.value.delete;
  deleteRow(row.id);
};

const onSubmit = () => {
  console.log("Teste");
};
</script>


<style>
.whiteFont {
  color: aliceblue;
}
.bgPadrao {
  background-color: #2c3d47;
}
.q-item.q-router-link--active,
.q-item--active {
  color: #00c986;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.full-height {
  height: 100%;
}
.flex-grow {
  flex-grow: 1;
}
.logout {
  border-radius: 10px;
}
</style>
