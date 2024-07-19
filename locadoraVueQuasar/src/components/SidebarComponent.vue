<template>
  <q-item
    clickable
    :to="route"
    exact
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'HeaderAndSidebar'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  // caption: {
  //   type: String,
  //   default: ''
  // },

  route: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: ''
  }
})
</script>
