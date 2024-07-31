<template>
  <q-page padding class="backStyle">
    <div class="main">
      <div class="flex justify-evenly">
        <div>
          <chartBarComponent/>
        </div>
        <div>
          <chartPieComponent/>
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

defineOptions({
  name: 'IndexPage',
});

onMounted(() => {
  authenticate()
    .then(() => {
      console.log("Sucesso ao autenticar");
    })
    .catch(error => {
      console.error('Erro na autenticação:', error);
    });
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
  { name: 'user', required: true, label: 'Usuário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'totalLoans', align: 'center', label: 'Total de empréstimos', field: 'totalLoans'},
  { name: 'activeRentals', align: 'center', label: 'Aluguéis ativos', field: 'activeRentals'},
];

const rows = ref([]);

const getRents = () => {
  api.get('/rent')
    .then(response => {
      if (Array.isArray(response.data.content)) {
        // rows.value = response.data.content;
        const teste = response.data.content.length;
        console.log(teste);
        showNotification('positive', "Dados obtidos com sucesso");
        showNotification('positive', teste);
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

</script>

<style scoped>
.flex{
  display: flex;
  width: 100%;
  max-height: 350px;
  flex-direction: row;
}
</style>
