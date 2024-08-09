<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="flex justify-evenly">
        <div>
          <chartBarComponent />
        </div>
        <div>
          <chartPieComponent />
        </div>
      </div>

      <TableComponent
        :rows="rows"
        :columns="columns"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { api, authenticate } from 'src/boot/axios';
import chartBarComponent from 'src/components/chartBarComponent.vue';
import chartPieComponent from 'src/components/chartPieComponent.vue';
import TableComponent from 'src/components/TableComponent.vue';

const $q = useQuasar();
const srch = ref('');

const columns = [
  { name: 'name', required: true, label: 'Locatário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'totalRents', align: 'center', label: 'Total de empréstimos', field: 'totalRents' },
  { name: 'activeRents', align: 'center', label: 'Aluguéis ativos', field: 'activeRents' },
];

const rows = ref([]);

const showNotification = (type, msg) => {
  $q.notify({
    type: type,
    message: msg,
    position: 'bottom-right',
    timeout: 3000
  });
};

onMounted(() => {
  authenticate()
    .then(() => {
      getRows();
      console.log("Sucesso ao autenticar");
    })
    .catch(error => {
      console.error('Erro na autenticação:', error);
    });
});

const getRows = (srch = '') => {
  api.get('/rent/renters')
    .then(response => {
      if (Array.isArray(response.data.content)) {
        rows.value = response.data.content;
        showNotification('positive', "Dados obtidos com sucesso!");
        console.log("Dados obtidos com sucesso");
      } else {
        console.error('A resposta da API não é um array:', response.data);
        rows.value = [];
      }
      console.log('Resposta da API:', response.data);
    })
    .catch(error => {
      showNotification('negative', "Socorro!");
      console.error("Erro ao obter dados:", error);
    });
};


</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
  /* max-height: 350px; */
  flex-direction: row;
  margin-bottom: 1rem;
}

@media (max-width: 900px) {
  .flex {
    margin-inline: auto;
    flex-direction: column;
    gap: 5rem;
  }
}
</style>
