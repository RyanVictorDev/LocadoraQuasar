<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bgPadrao">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="miniState = !miniState"
        />

        <q-toolbar-title>
          Locadora
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      dark
      v-model="drawer"
      show-if-above
      :mini="miniState"
      :width="250"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-teal-9' : 'bgPadrao'"
    >
      <div class="flex-column full-height">
        <q-list>
          <q-item-label
            header
            class="text-h5 whiteFont"
          >
            Admin
          </q-item-label>

          <SidebarComponent
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>

        <div class="flex-grow"></div>

        <q-item clickable exact class="q-mx-auto q-mb-sm logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SidebarComponent from 'src/components/SidebarComponent.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Relatório geral',
    caption: '',
    icon: 'moving',
    route: { name: 'home' }
  },
  {
    title: 'Controle de usuários',
    caption: '',
    icon: 'person',
    route: { name: 'users' }
  },
  {
    title: 'Controle de locatários',
    caption: '',
    icon: 'local_library',
    route: { name: 'renters' }
  },
  {
    title: 'Controle de editoras',
    caption: '',
    icon: 'create',
    route: { name: 'publishers' }
  },
  {
    title: 'Controle de livros',
    caption: '',
    icon: 'book',
    route: { name: 'books' }
  },
  {
    title: 'Controle de aluguéis',
    caption: '',
    icon: 'collections_bookmark',
    route: { name: 'rents' }
  },
]

const drawer = ref(false)
const miniState = ref(true)
</script>

<style>
  .whiteFont{
    color: aliceblue;
  }

  .bgPadrao{
    background-color: #2C3D47;
  }

  .q-item.q-router-link--active, .q-item--active {
    color: #00c986;
  }

  .flex-column {
  display: flex;
  flex-direction: column;
  }

  .full-height {
    height: 100%;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .logout{
    border-radius: 10px;
  }
</style>
