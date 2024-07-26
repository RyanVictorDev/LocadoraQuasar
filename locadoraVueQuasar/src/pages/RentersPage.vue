<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Locatários
        <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm" @click="registerAction"/>
      </div>

      <q-input v-model="srch" label="Pesquisar..." class="q-ml-lg col-md-8">
        <template v-slot:append>
          <q-icon v-if="srch !== ''" name="close" @click="srch = '', getRows(srch)" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="search" @click="getRows(srch)"/>
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

    <q-dialog v-model="dialogs.register.visible" persistent>
      <q-card class="widhtModal">
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="teal-10" text-color="white" />
          <span class="q-ml-sm">Cadastrar Novo locatário</span>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md q-my-auto">
            <q-input v-model="renterToCreate.name" label="Nome do locatário" filled lazy-rules :rules="[val => val && val.length > 3 || 'É nescessário ter mais de três caracteres']"/>
            <q-input v-model="renterToCreate.email" label="Email" filled lazy-rules/>
            <q-input v-model="renterToCreate.telephone" label="Telefone" mask="(##) #####-####" fill-mask filled lazy-rules/>
            <q-input v-model="renterToCreate.address" label="Endereço" filled lazy-rules/>
            <q-input v-model="renterToCreate.cpf" label="Cpf" mask="###.###.###-##" fill-mask filled lazy-rules/>

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
            <span class="q-ml-sm text-h6">Detalhes do locatário {{ dialogs.view.row.name }}</span>
          </div>

          <div class="q-ml-sm ">
            <div class="column q-mt-md">
              <span class="q-ml-sm col"><q-icon name="key"/> Id: {{ renterInfor.id }}</span>
              <span class="q-ml-sm col"><q-icon name="person"/> Nome: {{ renterInfor.name }}</span>
              <span class="q-ml-sm col"><q-icon name="email"/> Email: {{ renterInfor.email }}</span>
              <span class="q-ml-sm col"><q-icon name="phone"/> Telefone: {{ renterInfor.telephone }}</span>
              <span class="q-ml-sm col"><q-icon name="home"/> Endereço: {{ renterInfor.address }}</span>
              <span class="q-ml-sm col"><q-icon name="insert_drive_file"/> cpf: {{ renterInfor.cpf }}</span>
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
          <span class="q-ml-sm">Você tem certeza que deseja editar o locatário {{ dialogs.edit.row.name }}?</span>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md q-my-auto">
            <q-input v-model="renterInfor.name" label="Nome do locatário" filled lazy-rules/>
            <q-input v-model="renterInfor.email" label="Email" filled lazy-rules/>
            <q-input v-model="renterInfor.telephone" label="Telefone" mask="(##) #####-####" fill-mask filled lazy-rules/>
            <q-input v-model="renterInfor.address" label="Endereço" filled lazy-rules/>
            <q-input v-model="renterInfor.cpf" label="CPF" mask="###.###.###-##" fill-mask filled lazy-rules/>

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
          <span class="q-ml-sm">Você tem certeza que deseja excluir o locatário {{ dialogs.delete.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.delete.visible = false"/>
          <q-btn flat label="Excluir" color="primary" @click="performDeleteAction"/>
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
  name: 'RentersPage',
});

onMounted(() => {
  authenticate()
    .then(() => {
      getRows();
    })
    .catch(error => {
      console.error('Erro na autenticação:', error);
    });
});

const srch = ref('');

const columns = [
  { name: 'name', required: true, label: 'Nome do locatário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'email', align: 'center', label: 'Email', field: 'email'},
  { name: 'telephone', align: 'center', label: 'Telefone', field: 'telephone'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'}
]

const rows = ref([]);

const getRows = (srch = '') => {
  api.get('/renter', { params: { search: srch } })
    .then(response => {
      if (Array.isArray(response.data.content)) {
        rows.value = response.data.content;
        console.log("Dados obtidos com sucesso");
      } else {
        console.error('A resposta da API não é um array:', response.data);
        rows.value = [];
      }
      console.log('Resposta da API:', response.data);
    })
    .catch(error => {
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

const renterToCreate = ref({
  name: '',
  email: '',
  telephone: '',
  address: '',
  cpf: ''
});

const registerAction = () => {
  dialogs.value.register.visible = true;
  createRow(renterToCreate.value);
};

const createRow = (renterToCreate) => {
  api.post('/renter', renterToCreate)
  .then(response => {
    console.log("Sucesso ao criar novo locatário", response);
    dialogs.value.register.visible = false;
    getRows();
  })
  .catch(error => {
    console.log("Erro ao criar locatário", error)
  })
};

const renterInfor = ref([]);

const showMore = (id) => {
  api.get('/renter/' + id)
    .then(response => {
      renterInfor.value = response.data;
      console.log(renterInfor.value);
    })
    .catch(error => {
      console.error("Erro ao obter detalhes do locatário:", error);
    });
};

const editRow = (renterInfor) => {
  api.put('/renter', renterInfor)
    .then(response => {
      console.log("Sucesso ao editar", response);
      getRows();
    })
    .catch(error => {
      console.log("Erro ao editar", error)
    })
};

const performEditAction = () => {
  editRow(renterInfor.value);
  dialogs.value.edit.visible = false;
};

const deleteRow = (id) => {
  api.delete('/renter/' + id)
    .then(() => {
      rows.value = rows.value.filter(row => row.id !== id);
      dialogs.value.delete.visible = false;
      console.log("Locatário excluído com sucesso");
      getRows();
    })
    .catch(error => {
      console.error("Erro ao excluir locatário:", error);
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

