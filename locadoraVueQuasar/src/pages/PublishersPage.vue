<template>
  <q-page padding>
    <div class="row items-center q-mx-auto text-h5">
      <div class="text-weight-bold">
        Editoras
        <q-btn push color="teal-10" label="Cadastrar" class="q-ml-sm"/>
      </div>

      <q-input v-model="text" label="Pesquisar..." class="q-ml-lg col-md-8">
        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="search" />
        </template>
      </q-input>
    </div>

    <TableComponent
      :title="title"
      :rows="filteredRows"
      :columns="columns"
      :icons="icons"
      @action="handleAction"
    />

    <q-dialog v-model="dialogs.delete.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja excluir a editora {{ dialogs.delete.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.delete.visible = false"/>
          <q-btn flat label="Excluir" color="primary" @click="performDeleteAction"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.view.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="visibility" color="blue" text-color="white" />
          <span class="q-ml-sm">Detalhes da editora {{ dialogs.view.row.name }}</span>
          <div class="">
            <div class="column q-mt-md">
              <span class="q-ml-sm col">Informações: {{ editoraInfor }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" @click="dialogs.view.visible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.edit.visible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="green" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja editar a editora {{ dialogs.edit.row.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="dialogs.edit.visible = false" />
          <q-btn flat label="Editar" color="primary" @click="performEditAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import TableComponent from 'src/components/TableComponent.vue';
import { api, authenticate } from 'src/boot/axios';

defineOptions({
  name: 'PublishersPage',
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

const text = ref('');

const dialogs = ref({
  delete: {
    visible: false,
    row: null
  },
  view: {
    visible: false,
    row: null
  },
  edit: {
    visible: false,
    row: null
  }
});

const columns = [
  { name: 'name', required: true, label: 'Nome da Editora', align: 'center', field: row => row.name, format: val => `${val}` },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' },
];

const rows = ref([]);

const getRows = () => {
  api.get('/publisher')
    .then(response => {
      if (Array.isArray(response.data.content)) {
        rows.value = response.data.content;
        console.log("Dados obtidos com sucesso");
      } else {
        console.error('A resposta da API não é um array:', response.data);
        rows.value = [];
      }
      console.log('Resposta da API:', response.data);
    })
    .catch(error => {
      console.error("Erro ao obter dados:", error);
    });
}

const deleteRow = (id) => {
  api.delete('/publisher/' + id)
    .then(() => {
      rows.value = rows.value.filter(row => row.id !== id);
      dialogs.value.delete.visible = false;
      console.log("Editora excluída com sucesso");
    })
    .catch(error => {
      console.error("Erro ao excluir editora:", error);
    });
}

const editoraInfor = ref([]);

const showMore = (id) => {
  api.get('/publisher/' + id)
    .then(response => {
      editoraInfor.value = response.data;
    })
    .catch(error => {
      console.error("Erro ao obter detalhes da editora:", error);
    });
}

// const editRow = () => {
//   api.put('/publisher/')
//     .then(response => {

//     })
//     .catch(error => {
//       console.error("Erro ao obter detalhes da editora:", error);
//     });
// }

const icons = ['visibility', 'edit', 'delete'];

const handleAction = ({ row, icon }) => {
  if (icon === 'delete') {
    dialogs.value.delete.row = row;
    dialogs.value.delete.visible = true;
  } else if (icon === 'visibility') {
    dialogs.value.view.row = row;
    dialogs.value.view.visible = true;
    showMore(row.id);
  } else if (icon === 'edit') {
    dialogs.value.edit.row = row;
    dialogs.value.edit.visible = true;
  }
};

const performDeleteAction = () => {
  const { row } = dialogs.value.delete;
  deleteRow(row.id);
};

const performEditAction = () => {
  const { row } = dialogs.value.edit;
  console.log(`Editando a editora:`, row);
  dialogs.value.edit.visible = false;
};

const filteredRows = computed(() => {
  const term = text.value.toLowerCase();
  return rows.value.filter(row => row.name.toLowerCase().includes(term));
});
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
