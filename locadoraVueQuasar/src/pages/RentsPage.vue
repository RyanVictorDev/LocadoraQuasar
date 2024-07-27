<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="row items-center q-mx-auto text-h5">
        <div class="text-weight-bold q-mr-lg">
          Aluguéis
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

      <q-dialog v-model="dialogs.rent.visible" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="bookmark_border" color="blue" text-color="white" />
            <span class="q-ml-sm">Devolver o livro "{{ dialogs.rent.row.bookName }}" alugado por {{ dialogs.rent.row.renterName }}?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Fechar" color="primary" @click="dialogs.rent.visible = false" />
            <q-btn flat label="Devolver" color="primary" @click="performDeliveryAction(dialogs.rent.row.id)" />
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

const srch = ref('');

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
  { name: 'renterName', align: 'center', label: 'Locatário', field: 'renterName' },
  { name: 'bookName', align: 'center', label: 'Livro', field: 'bookName' },
  { name: 'rentDate', align: 'center', label: 'Alugado', field: 'rentDate' },
  { name: 'deadLineDate', align: 'center', label: 'Devolução', field: 'deadLineDate' },
  { name: 'status', align: 'center', label: 'Status', field: 'status' },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' },
];

const rows = ref([]);

const getRows = (srch = '') => {
  api.get('/rent', { params: { search: srch } })
    .then(response => {
      if (Array.isArray(response.data.content)) {
        rows.value = response.data.content;
        console.log("Dados obtidos com sucesso");
        showNotification('positive', "Dados obtidos com sucesso!");
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
};

const dialogs = ref({
  rent: {
    visible: false,
    row: null
  }
});

const icons = ['bookmark_border'];

const handleAction = ({ row, icon }) => {
  if (icon === 'bookmark_border') {
    dialogs.value.rent.row = row;
    dialogs.value.rent.visible = true;
    showMore(row.id);
  }
};

const rentInfor = ref([]);

const showMore = () => {
  api.get('/rent')
    .then(response => {
      rentInfor.value = response.data;
      showNotification('positive', "Detalhes obtidos com sucesso!");
      console.log(rentInfor.value);
    })
    .catch(error => {
      showNotification('negative', "Erro ao obter detalhes do locatário!");
      console.error("Erro ao obter detalhes do locatário:", error);
    });
};

const editRow = (id) => {
  api.put('/rent/' + id)
    .then(response => {
      console.log("Sucesso ao editar", response);
      showNotification('positive', "Sucesso ao devolver!");
      getRows();
    })
    .catch(error => {
      console.log("Erro ao editar", error)
      showNotification('negative', "Erro ao devolver!");
      console.log(rentInfor);
    })
};

const performDeliveryAction = (teste) => {
  editRow(teste);
  console.log(teste);
  dialogs.value.rent.visible = false;
};
</script>
