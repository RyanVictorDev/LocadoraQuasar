import { boot } from 'quasar/wrappers'
import axios from 'axios'

let api;

axios.post("https://livraria-api.altislabtech.com.br/auth/login", {
    username: "admin",
    password: "12345678"
})
.then(response => {
    const token = response.data.token;

    api = axios.create({
      baseURL: 'https://livraria-api.altislabtech.com.br',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
})
.catch(error => {
    console.error('Erro ao fazer login e obter o token:', error);
});

export default boot(({ app }) => {
  // Usar dentro de arquivos Vue (Options API) através de this.$axios e this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ Isso permitirá o uso de this.$axios (para a API de opções Vue)
  //       para que não seja necessário importar axios em cada arquivo Vue

  app.config.globalProperties.$api = api
  // ^ ^ ^ Isso permitirá o uso de this.$api (para a API de opções Vue)
  //       para que você possa facilmente realizar solicitações à API do seu app
});

export { api };
