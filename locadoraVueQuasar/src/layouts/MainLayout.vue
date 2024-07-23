<template>
  <q-layout v-if="!log">
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-img
        :key="mode"
        src="../assets/altislab_logo.png"
        style="height: 150px;"
        fit="scale-down"
      />
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-my-auto">
        <q-input
          filled
          v-model="name"
          label="Nome de usuário *"
          hint="Digite o seu nome de usuário"
          lazy-rules
          :rules="[val => val && val.length > 3 || 'Usuário precisa ter mais de três letras']"
        />
        <q-input
          filled
          type="password"
          v-model="password"
          label="Senha *"
          hint="Digite o sua senha"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Por favor, digite sua senha',
            val => val && val.length > 3 || 'A senha não pode ter menos que quatro caracteres'
          ]"
        />
        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-layout>

  <q-layout view="lHh Lpr lFf" v-else>
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
        <q-toolbar-title>Locadora</q-toolbar-title>
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
          <q-item-label header class="text-h5 whiteFont">Admin</q-item-label>
          <SidebarComponent v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>
        <div class="flex-grow"></div>
        <q-item clickable exact class="q-mx-auto q-mb-sm logout" @click="log = false">
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

const log = ref(false)
const name = ref(null)
const password = ref(null)

const onSubmit = () => {
  if (name.value == 'admin' && password.value == '12345678') {
    log.value = true
    name.value = null
    password.value = null
  } else {
    alert("Algo deu errado...");
  }
}

const onReset = () => {
  name.value = null
  password.value = null
}

const linksList = [
  { title: 'Relatório geral', caption: '', icon: 'moving', route: { name: 'home' } },
  { title: 'Controle de usuários', caption: '', icon: 'person', route: { name: 'users' } },
  { title: 'Controle de locatários', caption: '', icon: 'local_library', route: { name: 'renters' } },
  { title: 'Controle de editoras', caption: '', icon: 'create', route: { name: 'publishers' } },
  { title: 'Controle de livros', caption: '', icon: 'book', route: { name: 'books' } },
  { title: 'Controle de aluguéis', caption: '', icon: 'collections_bookmark', route: { name: 'rents' } },
]

const drawer = ref(false)
const miniState = ref(true)
</script>

<style>
.whiteFont {
  color: aliceblue;
}
.bgPadrao {
  background-color: #2c3d47;
}
.q-item.q-router-link--active,
.q-item--active {
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
.logout {
  border-radius: 10px;
}
</style>
