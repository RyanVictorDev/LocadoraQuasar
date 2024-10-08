<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="row items-center q-mx-auto text-h5">
        <div class="text-weight-bold q-mr-lg">
          Livros
          <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm" @click="openRegisterDialog"/>
        </div>

        <q-form @submit="getRows(srch)" class="q-ml-sm col" input-style="min-width: 100%">
          <q-input v-model="srch" label="Pesquisar..." class="q-ml-sm col" input-style="min-width: 100%">
            <template v-slot:append>
              <q-icon v-if="srch !== ''" name="close" @click="srch = '', getRows(srch)" class="cursor-pointer"/>
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

      <q-dialog v-model="dialogs.register.visible" persistent class="q-pa-lg">
        <q-card class="widhtModal">
          <q-card-section class="row items-center text-h5">
            <q-avatar icon="add" color="teal-10" text-color="white"/>
            <span class="q-ml-sm">Cadastrar Novo Livro</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="registerAction" class="q-gutter-none q-my-auto">
              <q-input v-model="bookToCreate.name" label="Título do livro" filled lazy-rules :rules="[val => val && val.length > 4 || 'É necessário ter mais de quatro caracteres']"/>
              <q-input v-model="bookToCreate.author" label="Autor" filled lazy-rules :rules="[val => val && val.length > 3 || 'É necessário ter mais de três caracteres']"/>
              <q-input v-model="bookToCreate.totalQuantity" label="Quantidade" type="number" filled lazy-rules :rules="[val => val > 0 || 'É necessário ter pelo menos 1']"/>
              <q-input v-model="bookToCreate.launchDate" label="Data de lançamento" type="date" mask="####-##-##" fill-mask filled lazy-rules :rules="[val => val && val.length >= 6 || 'Adicione uma data válida']"/>
              <q-input v-model="bookToCreate.publisherId" label="ID da editora" type="number" filled lazy-rules/>

              <q-btn-dropdown color="primary" label="Escolha a editora" class="q-mt-md">
                <q-list v-for="publisherItem in publishers" :key="publisherItem.name">
                  <q-item clickable v-close-popup @click="onItemClickRegister(publisherItem, bookToCreate)">
                    <q-item-section>
                      <q-item-label>{{publisherItem.name}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.register.visible = false"/>
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.rent.visible" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="bookmark" color="blue" text-color="white"/>
            <span class="q-ml-sm">Alugar o livro {{ dialogs.rent.row.name }}?</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="rentAction(dialogs.rent.row.id)" class="q-gutter-md q-my-auto">
              <q-input v-model="dialogs.rent.row.name" label="Título do livro" filled lazy-rules/>
              <q-input v-model="idRenter" label="ID do locatário" filled lazy-rules/>
              <q-input v-model="bookToRent.deadline" label="Devolução" type="date" mask="####-##-##" fill-mask filled lazy-rules/>

              <q-btn-dropdown color="primary" label="Escolha o locatário" class="q-mt-md">
                <q-list v-for="renterItem in renters" :key="renterItem.name">
                  <q-item clickable v-close-popup @click="onItemClickRent(renterItem)">
                    <q-item-section>
                      <q-item-label>{{renterItem.name}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.rent.visible = false"/>
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.edit.visible" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="edit" color="green" text-color="white"/>
            <span class="q-ml-sm">Você tem certeza que deseja editar o livro {{ dialogs.edit.row.name }}?</span>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="performEditAction(bookInforEdit), showMore(dialogs.edit.row.id)" class="q-gutter-md q-my-auto">
              <q-input v-model="bookInforEdit.name" label="Título do livro" filled lazy-rules/>
              <q-input v-model="bookInforEdit.author" label="Autor" filled lazy-rules/>
              <q-input v-model="bookInforEdit.totalQuantity" label="Estoque" filled lazy-rules/>
              <q-input v-model="bookInforEdit.launchDate" label="Data de lançamento" type="date" filled lazy-rules/>
              <q-input v-model="bookInforEdit.publisherId" label="Id da editora" filled lazy-rules/>

              <q-btn-dropdown color="primary" label="Escolha a editora" class="q-mt-md">
                <q-list v-for="publisherItem in publishers" :key="publisherItem.name">
                  <q-item clickable v-close-popup @click="onItemClick(publisherItem)">
                    <q-item-section>
                      <q-item-label>{{publisherItem.name}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false"/>
                <q-btn flat label="Salvar" type="submit" color="primary"/>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogs.delete.visible" persistent>
        <q-card class="">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="red" text-color="white"/>
            <span class="q-ml-sm">Você tem certeza que deseja excluir o livro {{ dialogs.delete.row.name }}?</span>
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
  name: 'BooksPage',
});

onMounted(() => {
    getRows();
    getPublishers();
    getRents();
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
  { name: 'id', align: 'center', label: 'Id', field: 'id'},
  { name: 'title', required: true, label: 'Título', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'author', align: 'center', label: 'Autor', field: 'author'},
  { name: 'totalQuantity', align: 'center', label: 'Disponíveis', field: 'totalQuantity'},
  { name: 'inUseQuantity', align: 'center', label: 'Alugados', field: 'inUseQuantity'},
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions'},
];

const rows = ref([]);

const srch = ref('');

const getRows = (srch = '') => {
  api.get('/book', { params: { search: srch } })
    .then(response => {
      if (Array.isArray(response.data)) {
        rows.value = response.data;
      } else {
        console.error('A resposta da API não é um array:', response.data);
        rows.value = [];
      }
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter dados!");
      console.error("Erro ao obter dados:", error);
    });
};

const dialogs = ref({
  register: {
    visible: false,
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

const onItemClickRegister = (publisherItem, bookToCreate) => {
  bookToCreate.publisherId = publisherItem.id;
}

const openRegisterDialog = () => {
  dialogs.value.register.visible = true;
};

const createRow = (bookToCreate) => {
  api.post('/book', bookToCreate)
    .then(response => {
      console.log("Sucesso ao criar novo livro", response);
      dialogs.value.register.visible = false;
      showNotification('positive', "Livro criado com sucesso!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao criar livro!");
      console.log("Erro ao criar livro", error);
    });
};

const registerAction = () => {
  createRow(bookToCreate.value);
};

const bookInforEdit = ref([]);

const showMore = (id) => {
  api.get('/book/' + id)
    .then(response => {
      const filteredData = {
      id: response.data.id,
      name: response.data.name,
      author: response.data.author,
      totalQuantity: response.data.totalQuantity,
      launchDate: response.data.launchDate,
      publisherId: response.data.publisher.id
    }

    bookInforEdit.value = filteredData;
    console.log(response.data.publisher.id)
    showNotification('positive', "Dados obtidos com sucesso!");
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter detalhes do livro!");
      console.error("Erro ao obter detalhes do livro:", error);
    });
};

const renters = ref([])
const idRenter = ref('')

const getRents = () => {
  api.get('/renter')
  .then(response => {
    renters.value = response.data
    console.log("SHOW", renters, response)
  })
  .catch(error => {
    console.log(error)
  })
}

const bookToRent = ref({
  renterId: idRenter,
  bookId: '',
  deadline: '',
});

const onItemClickRent = (rentItem) => {
  idRenter.value = rentItem.id;
}

const rentBook = () => {
  api.post('/rent', bookToRent.value)
    .then(response => {
      console.log("Sucesso ao alugar livro", response);
      dialogs.value.rent.visible = false;
      showNotification('positive', "Sucesso ao alugar livro!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Falha ao alugar livro");
      console.log("Erro ao alugar livro", error);
    });
};

const rentAction = (id) => {
  dialogs.value.rent.visible = false;
  bookToRent.value.bookId = id;
  rentBook(bookToRent.value);
};

const publishers = ref([])
const publisherId = ref('')

const getPublishers = () => {
  api.get('/publisher')
  .then(response => {
    publishers.value = response.data
    console.log("SHOW", publishers, response)
  })
  .catch(error => {
    console.log(error)
  })
}

const editRow = (bookInfor) => {
  api.put('/book/'+ bookInfor.id, bookInfor)
    .then(response => {
      console.log("Sucesso ao editar", response);
      showNotification('positive', "Sucesso ao editar livro!");
      getRows();
    })
    .catch(error => {
      console.log("Erro ao editar", error);
      showNotification('negative', "erro ao editar livro!");
      console.log(bookInfor);
    });
};

const onItemClick = (publisherItem) => {
  bookInforEdit.value.publisherId = publisherItem.id;
}

const performEditAction = (bookInforEdit) => {
  editRow(bookInforEdit);
  dialogs.value.edit.visible = false;
};

const deleteRow = (id) => {
  api.delete('/book/' + id)
    .then(() => {
      rows.value = rows.value.filter(row => row.id !== id);
      dialogs.value.delete.visible = false;
      console.log("Livro excluído com sucesso");
      showNotification('positive', "Livro excluído com sucesso!");
      getRows();
    })
    .catch(error => {
      showNotification('negative', "Erro ao excluir livro!");
      console.error("Erro ao excluir livro:", error);
    });
};

const performDeleteAction = () => {
  const { row } = dialogs.value.delete;
  deleteRow(row.id);
};

const onSubmit = () => {
  console.log("Formulário enviado");
};
</script>

<style>
</style>
