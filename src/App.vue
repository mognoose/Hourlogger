<template>
  <header>
      <Header msg="HourLogger" />
  </header>

  <main class="container">
    <LoggedHours @edit="id => onEdit(id)" />
  </main>
  <LoggingModal
    ref="loggingModal"
    :activated="newHour"
    @open="newHour = true"
    @close="newHour = false"
    @submit="submit()"
  />
  <KeyboardEvents @keydown="keyboardEvent" />

</template>

<script setup>
import Header from './components/Header.vue'
import LoggedHours from './components/LoggedHours.vue'
import LoggingModal from './components/LoggingModal.vue'
import KeyboardEvents from './components/KeyboardEvents.vue'
import { ref, onMounted } from 'vue';
import { useHoursStore } from './stores/hours';

const newHour = ref(false);
const loggingModal = ref();


onMounted(() => {
    useHoursStore().loadFromLocal();
});

const keyboardEvent = e => {
  if(e.which === 13) {
    newHour.value ? loggingModal.value.onSubmit() : newHour.value = true;
    loggingModal.value.onFocus();
  }
  if(e.which === 27) {
    newHour.value = false
    loggingModal.value.reset();
  };
}

const onEdit = id => {
  console.log('edit', id);
}
</script>

<style>
header {
  height: 5rem;
}
.container {
  height: 80dvh;
  overflow: auto;

  scrollbar-color: #333 #222;
  scrollbar-width: thin;
}
</style>
