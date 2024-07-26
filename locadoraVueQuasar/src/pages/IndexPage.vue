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

const columns = [
  { name: 'user', required: true, label: 'Usuário', align: 'center', field: row => row.name, format: val => `${val}`},
  { name: 'totalLoans', align: 'center', label: 'Total de empréstimos', field: 'totalLoans'},
  { name: 'activeRentals', align: 'center', label: 'Aluguéis ativos', field: 'activeRentals'},
];

const rows = ref([
  {name: 'fulano', totalLoans: '10', activeRentals: '2'},
  {name: 'Ciclano', totalLoans: '5', activeRentals: '2'}
]);

</script>

<style scoped>
.flex{
  display: flex;
  width: 100%;
  max-height: 350px;
  flex-direction: row;
}
</style>
