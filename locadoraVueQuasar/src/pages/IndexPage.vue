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
const rows = ref([]);
const srch = ref('');

const columns = [
  { name: 'renterName', required: true, label: 'Usuário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'totalLoans', align: 'center', label: 'Total de empréstimos', field: 'totalLoans' },
  { name: 'activeRentals', align: 'center', label: 'Aluguéis ativos', field: 'activeRentals' },
];

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
      getRents();
      console.log("Sucesso ao autenticar");
    })
    .catch(error => {
      console.error('Erro na autenticação:', error);
    });
});
</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
  max-height: 350px;
  flex-direction: row;
}
</style>
