<template>
  <q-layout v-if="!log" class="bgLayoutLogin flex">
    <div class="q-pa-lg q-mx-auto card" style="max-width: 400px;">
      <div class="form">
          <q-img
          src="../assets/altislab_logo.png"
          style="height: 150px;"
          fit="scale-down"
          class="q-my-auto"
        />
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-my-auto spacer">
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
            hint="Digite a sua senha"
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
import { useQuasar } from 'quasar';
import { ref } from 'vue'
import axios from 'axios'
import SidebarComponent from 'src/components/SidebarComponent.vue'

defineOptions({
  name: 'MainLayout'
})

const $q = useQuasar();

const showNotification = (type, msg) => {
  $q.notify({
    type: type,
    message: msg,
    position: 'bottom-right',
    timeout: 3000
  });
};

const log = ref(false)
const name = ref(null)
const password = ref(null)

const onSubmit = () => {
  if (name.value && password.value) {
    axios.post("https://livraria-api.altislabtech.com.br/auth/login", {
      username: name.value,
      password: password.value
    })
    .then(response => {
      log.value = true
      name.value = null
      password.value = null
    })
    .catch(error => {
      showNotification('negative', "Algo deu errado!");
    })
  } else {
    showNotification('negative', "Por favor, preencha todos os campos corretamente");
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
.bgLayoutLogin{
  background: linear-gradient(to right, #b3b3b3 8%, #f1fdf7 100%);
}

.form{
  width: 100%;
}

.card{
  width: 40%;
  margin-top: auto;
  margin-bottom: auto;
  padding: 2rem;
  border-radius: 5px;
  background-color: rgb(240, 240, 240);
  box-shadow: 2px 2px 5px 1px rgba(97, 97, 97, 0.58);
}

.flex{
  display: flex;
}

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

@media (max-width: 600px) {
  .card{
    box-shadow: none;
  }

  .bgLayoutLogin {
    background: rgb(240, 240, 240);
  }
}

</style>
