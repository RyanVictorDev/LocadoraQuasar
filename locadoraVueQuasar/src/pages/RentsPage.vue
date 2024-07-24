<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Aluguéis
        <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm"/>
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

    <q-dialog v-model="dialogs.rent.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="bookmark_border" color="blue" text-color="white" />
          <span class="q-ml-sm">Devolver o livro "{{ dialogs.rent.row.bookName }}" alugado por {{ dialogs.rent.row.renterName }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" @click="dialogs.rent.visible = false" />
          <q-btn flat label="Devolver" color="primary" @click="performRentAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.edit.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="green" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja editar o aluguel do livro "{{ dialogs.edit.row.bookName }}"?</span>
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
  name: 'RentsPage',
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

const text = ref('');

const dialogs = ref({
  rent: {
    visible: false,
    row: null
  },
  edit: {
    visible: false,
    row: null
  }
});

const columns = [
  { name: 'renterName', align: 'center', label: 'Locatário', field: 'renterName' },
  { name: 'bookName', align: 'center', label: 'Livro', field: 'bookName' },
  { name: 'rentDate', align: 'center', label: 'Alugado', field: 'rentDate' },
  { name: 'deadLineDate', align: 'center', label: 'Devolução', field: 'deadLineDate' },
  { name: 'status', align: 'center', label: 'Status', field: 'status' },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' },
];

const rows = ref([]);

const getRows = () => {
  api.get('/rent')
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

const icons = ['bookmark_border', 'edit'];

const handleAction = ({ row, icon }) => {
  if (icon === 'bookmark_border') {
    dialogs.value.rent.row = row;
    dialogs.value.rent.visible = true;
  } else if (icon === 'edit') {
    dialogs.value.edit.row = row;
    dialogs.value.edit.visible = true;
  }
};

// const performRentAction = () => {
//   const { row } = dialogs.value.rent;
//   dialogs.value.rent.visible = false;
// };

// const performEditAction = () => {
//   const { row } = dialogs.value.edit;
//   dialogs.value.edit.visible = false;
// };
</script>
