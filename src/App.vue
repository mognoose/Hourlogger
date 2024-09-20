<template>
  <header>
      <Header msg="HourLogger" />
      <LoggingModal
        ref="loggingModal"
        :activated="newHour"
        @open="newHour = true"
        @close="newHour = false"
        @submit="submit()"
      />
  </header>

  <main class="container">
    <LoggedHours @edit="id => onEdit(id)" />
  </main>

  <EditModal
    ref="editModal"
    :id="editEntryId"
    @close="editEntryId = ''"
  />
  <KeyboardEvents @keydown="keyboardEvent" />

</template>

<script setup>
import Header from './components/Header.vue'
import LoggedHours from './components/LoggedHours.vue'
import LoggingModal from './components/LoggingModal.vue'
import EditModal from './components/EditModal.vue'
import KeyboardEvents from './components/KeyboardEvents.vue'
import { ref, onMounted } from 'vue';
import { useHoursStore } from './stores/hours';
import { useProjectsStore } from './stores/projects';

const newHour = ref(false);
const loggingModal = ref();
const editModal = ref();
const editEntryId = ref('');


onMounted(() => {
    useHoursStore().loadFromLocal();
    useProjectsStore().loadFromLocal();
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
  editEntryId.value = id.toString();
  console.log('editEntryId', editEntryId.value);
}
</script>

<style>
header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0 1rem;
  margin-bottom: 1.75rem;
  height: 5rem;
}

@media only screen and (max-width: 800px) {
  header {
    grid-template-columns: 1fr;
    text-align: center;
    height: 7rem;
  }
}

.container {
  height: 80dvh;
  overflow: auto;
  scrollbar-color: #333 #222;
  scrollbar-width: thin;
}


.btn {
    margin: 0 1rem ;
    background-color: #555;
    color: #eee;
    border: 1px solid #111;
    border-radius: .25rem;
    padding: 1rem .25rem;
    text-align: center;
    font-size: 1rem;
    cursor: pointer;
}

.btn-primary {
    background-color: #4e9d4e;
    color: #eee;
}

.btn-secondary {
    background-color: #62686d;
    color: #eee;
}

.btn-danger {
    background-color: #be4c49;
    color: #eee;
}
</style>
