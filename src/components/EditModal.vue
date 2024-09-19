<template>
    <div v-if="id" class="background" :class="{activated: id.length}" @click="onBackdropClick" id="modal-background">
        <div class="modal" :class="{activated: id.length}" >
            <div class="edit-modal-header">
                <span v-if="project" style="font-weight: bold;">{{`${project?.jiracode || ''}-${hourLog.task} ${hourLog.description}`}}</span>
            </div>
            <div class="edit-modal-body">
                <div class="edit-form">
                    <div>Project</div>
                    <div v-if="project">{{project.description}} ({{ project.jiracode }})</div>
                    <div v-else>Project not found</div>
                    <div>Task</div>
                    <input v-model="hourLog.task">
                    <div>Description</div>
                    <input v-model="hourLog.description">
                    <div>Time</div>
                    <input v-model="hourLog.minutes" />
                    <div>Date</div>
                    <input v-model="hourLog.date" />
                </div>
            </div>
            <div class="edit-modal-footer">
                <button @click="onDelete()" class="btn btn-danger">Delete</button>
                <button @click="emits('close')" class="btn btn-secondary">Cancel</button>
                <button @click="onSubmit()" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useHoursStore } from '@/stores/hours';
import { useProjectsStore } from '../stores/projects';
import { ref, computed } from 'vue';

const props = defineProps({
    id: {
        type: String,
        default: '',
        Required: false,
    },
});

const hourLog = computed(() => useHoursStore().getHoursInfo(props.id));
const project = computed(() => useProjectsStore().getProjectInfo(hourLog.value.project));

const emits = defineEmits(['open', 'close', 'submit']);

const onBackdropClick = event => {
    if (event.target.id === 'modal-background') {
        emits('close');
    }
}

const onSubmit = () => {
    hourLog.value.minutes = parseHours(hourLog.value.minutes);
    useHoursStore().updateEntry(hourLog.value.id, hourLog.value)
    emits('close');
}
const onDelete = () => {
    useHoursStore().deleteEntry(hourLog.value.id);
    emits('close');
}

// TODO: make reusable
const parseHours = value => {
    if(value.includes(',')) value = value.replace(',', '.');
    if(value.includes('.')) {
        return value[0] === '.' ? parseFloat(0+value) * 60 : parseFloat(value) * 60;
    }
    if(value.includes('h')) {
        const hours = parseInt(value.split('h')[0] * 60);
        const mins = parseInt((value.split('h')[1]).split('m')[0]);
        return hours + mins;
    }
    if(value.includes('m')) return parseInt(value.split('m')[0])
    return parseInt(value) * 60;
}

// TODO: make reusable
const parseTime = mins => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    m = m < 10 ? '0' + m : m;

    return `${h > 0 ? `${h}h` : ''} ${m > 0 ? `${m}m` : ''}`;
};

defineExpose({
    onSubmit,
});


</script>

<style scoped>
.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    background: rgba(0,0,0,0);
    backdrop-filter: none;
    display: grid;
    pointer-events: none;
    transition: 300ms;
    padding-top: 1.5rem;
    
    &.activated {
        background: rgba(0,0,0,.5);
        backdrop-filter: blur(5px);
        pointer-events: auto;
        height: 100dvh;
    }
}

.modal {
    display: grid;
    grid-template-rows: auto auto 1fr;
    border: 1px solid #aaa;
    width: 60dvw;
    background: #333;
    margin: auto;
    border-radius: .5rem;
    padding: 1rem;
    transition: 300ms;
    
    &.activated {
        width: 80dvw;
        height: 80dvh;
        box-shadow: 0 0 1rem rgba(0,0,0,.75);
    }

    .edit-modal-footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-self: end;
    }
}

.edit-form {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-items: start;
    align-items: center;
    gap: 0 1rem;

    div {
        align-self: center;
    }
}

input {
    background: #333;
    border: none;
    color: #eee;
    font-size: 1.25rem;
    padding: .25rem;
    border-bottom: 2px solid #111;
    background: #222;
    margin: .25rem;
}

textarea:focus, input:focus{
    outline: none;
}

.icon {
    fill: #eee;
    margin-right: 1rem;
}

</style>