<template>
  <q-page padding>
    <div class="q-pa-md example-row-equal-width flex justify-evenly">
      <div class="row">
        <chartBarComponent/>
      </div>
      <div class="row">
        <chartPieComponent/>
      </div>
    </div>
    aaa
  </q-page>
</template>

<script setup>
import chartBarComponent from 'src/components/chartBarComponent.vue';
import chartPieComponent from 'src/components/chartPieComponent.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

<style scoped>
.flex{
  display: flex;
  width: 100%;
  max-height: 350px;
  flex-direction: row;
}
</style>
