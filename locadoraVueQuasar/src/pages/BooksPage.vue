<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Livros
        <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm" @click="registerAction"/>
      </div>

      <q-input v-model="text" label="Pesquisar..." class="q-ml-lg col-md-8">
        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="search" />
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

    <q-dialog v-model="dialogs.register.visible" persistent class="q-pa-lg">
      <q-card class="widhtModal">
        <q-card-section class="row items-center text-h5">
          <q-avatar icon="add" color="teal-10" text-color="white"/>
          <span class="q-ml-sm">Cadastrar Novo Livro</span>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-none q-my-auto">
            <q-input v-model="bookToCreate.name" label="Titulo do livro" filled lazy-rules :rules="[val => val && val.length > 4 || 'É nescessário ter mais de quatro caracteres']"/>
            <q-input v-model="bookToCreate.author" label="Autor" filled lazy-rules :rules="[val => val && val.length > 3 || 'É nescessário ter mais de três caracteres']"/>
            <q-input v-model="bookToCreate.totalQuantity" label="Quantidade" type="number" filled lazy-rules :rules="[val => val > 0 || 'É nescessário ter pelo menos 1']"/>
            <q-input v-model="bookToCreate.launchDate" label="Data de lançamento" mask="####-##-##" fill-mask filled lazy-rules :rules="[val => val && val.length >= 6 || 'Adicione uma data valida']"/>
            <q-input v-model="bookToCreate.publisherId" label="ID da editora" type="number" filled lazy-rules :rules="[val => val && val.length > 0 || 'É nescessário um id real']"/>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" @click="dialogs.register.visible = false" />
              <q-btn flat label="Salvar" type="submit" color="primary" @click="registerAction"/>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.rent.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="bookmark" color="blue" text-color="white" />
          <span class="q-ml-sm">Alugar o livro {{ dialogs.rent.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" @click="dialogs.rent.visible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.edit.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="green" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja editar o livro {{ dialogs.edit.row.name }}?</span>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md q-my-auto">
            <q-input v-model="bookInfor.name" label="Título do livro" filled lazy-rules/>
            <q-input v-model="bookInfor.author" label="Autor" filled lazy-rules/>
            <q-input v-model="bookInfor.totalQuantity" label="Estoque" filled lazy-rules/>
            <q-input v-model="bookInfor.launchDate" label="Data de lançamento" filled lazy-rules/>
            <q-input v-model="bookInfor.publisherName" label="Editora" filled lazy-rules/>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false" />
              <q-btn flat label="Salvar" type="submit" color="primary" @click="performEditAction"/>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <q-dialog v-model="dialogs.delete.visible" persistent>
      <q-card class="">
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja excluir o livro {{ dialogs.delete.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.delete.visible = false" />
          <q-btn flat label="Excluir" color="primary" @click="performDeleteAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';
import { api, authenticate } from 'src/boot/axios';

defineOptions({
  name: 'BooksPage',
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

const text = ref('')

const columns = [
  { name: 'title', required: true, label: 'Título', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'author', align: 'center', label: 'Autor', field: 'author'},
  { name: 'availableQuantity', align: 'center', label: 'Disponíveis', field: 'availableQuantity'},
  { name: 'inUseQuantity', align: 'center', label: 'Alugados', field: 'inUseQuantity'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
]

const rows = ref([])

const getRows = () => {
  api.get('/book')
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
  rent: {
    visible: false,
    row: null
  },
  edit: {
    visible: false,
    row: null
  }
});

const icons = ['bookmark', 'edit', 'delete'];

const handleAction = ({ row, icon }) => {
  if (icon === 'delete') {
    dialogs.value.delete.row = row;
    dialogs.value.delete.visible = true;
  } else if (icon === 'bookmark') {
    dialogs.value.rent.row = row;
    dialogs.value.rent.visible = true;
    showMore(row.id);
  } else if (icon === 'edit') {
    dialogs.value.edit.row = row;
    dialogs.value.edit.visible = true;
    showMore(row.id);
  }
};

const bookToCreate = ref({
  name: '',
  author: '',
  totalQuantity: '',
  launchDate: '',
  publisherId: ''
});

const registerAction = () => {
  dialogs.value.register.visible = true;
  createRow(bookToCreate.value);
};

const createRow = (bookToCreate) => {
  api.post('/book', bookToCreate)
  .then(response => {
    console.log("Sucesso ao criar novo livro", response);
    dialogs.value.register.visible = false;
    getRows();
  })
  .catch(error => {
    console.log("Erro ao criar livro", error)
  })
};

const bookInfor = ref([]);

const showMore = (id) => {
  api.get('/book/' + id)
    .then(response => {
      bookInfor.value = response.data;
      console.log(bookInfor.value);
    })
    .catch(error => {
      console.error("Erro ao obter detalhes do locatário:", error);
    });
};

const editRow = (bookInfor) => {
  api.put('/book', bookInfor)
    .then(response => {
      console.log("Sucesso ao editar", response);
      getRows();
    })
    .catch(error => {
      console.log("Erro ao editar", error)
      console.log(bookInfor);
    })
};

const performEditAction = () => {
  editRow(bookInfor.value);
  dialogs.value.edit.visible = false;
};

const deleteRow = (id) => {
  api.delete('/book/' + id)
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

<style>

</style>
