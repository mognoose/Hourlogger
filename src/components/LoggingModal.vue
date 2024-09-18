<template>
    <div class="background" :class="{activated}" @click="onBackdropClick" id="modal-background">
        <div class="modal" :class="{activated}" >
            <div class="search-field" :class="{activated}" @click="onOpen()">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="icon search-icon">
                    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>
                </svg>
                <input ref="promptRef" v-model="prompt" :placeholder="placeholder[step]" autofocus @input="filterResults()" />
                <span class="suggestion" v-if="step === 1">
                    <span>{{prompt}}</span>
                    <span>{{prompt ? `- ${results[0]?.description}` : ''}}</span>
                </span>
                <span class="suggestion" v-if="step === 2">
                    <span>{{prompt}}</span>
                    <span>{{prompt ? `- ${useProjectsStore().getProjectInfo(useHoursStore().newHour.project)?.jiracode}-${prompt}` : ''}}</span>
                    <span>{{prompt ? ` - ${useProjectsStore().getProjectInfo(useHoursStore().newHour.project)?.description}` : ''}}</span>
                </span>
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="icon x-circle-icon">
                    <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
                </svg>
            </div>
            <div class="results" v-if="activated && step === 1">
                <div class="result" v-for="(result, index) in results" :key="index">
                    <span style="font-weight: bold;">{{result.description}}</span>
                    <span v-if="result.jiracode">{{result.jiracode}}</span>
                    <span>{{result.workorder}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useHoursStore } from '@/stores/hours';
import { useProjectsStore } from '../stores/projects';
import { ref } from 'vue';

const props = defineProps({
    activated: {
        type: Boolean,
        default: false,
        Required: false,
    },
});

const emits = defineEmits(['open', 'close', 'submit']);

const prompt = ref('');
const promptRef = ref();
const projects = useProjectsStore().projects;
const results = ref(projects);
const step = ref(1);

const placeholder = [
    '',
    'Search by description, jiracode, workorder or jobtype',
    'Enter task code',
    'Enter description',
    'How much time you spent on it (hours)',
]

const onOpen = () => {
    if (!props.activated) emits('open');
}

const onBackdropClick = event => {
    if (event.target.id === 'modal-background') {
        reset();
        emits('close');
    }
}

const filterResults = () => {
    emits('open');
    results.value = projects.filter(p =>
        includes(p.description, prompt.value) ||
        includes(p.jiracode, prompt.value) ||
        includes(p.type, prompt.value) ||
        includes(p.workorder, prompt.value)
    );
}

const includes = (prop, prompt) => {
    return prop.toUpperCase().includes(prompt.toUpperCase())
}

const onFocus = () => {
    promptRef.value.focus();
}

const onSubmit = () => {
    if (step.value === 1) useHoursStore().logProject(results.value[0]);
    if (step.value === 2) useHoursStore().logTaskCode(prompt.value);
    if (step.value === 3) useHoursStore().logTaskDescription(prompt.value);
    if (step.value === 4) useHoursStore().logTaskMinutes(parseHours(prompt.value));

    prompt.value = '';
    step.value = step.value+1;

    if (step.value > 4) {
        useHoursStore().submitEntry()
        reset();
        emits('close');
    }
}

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

const reset = () => {
    step.value = 1
    results.value = projects;
}

defineExpose({
    onSubmit,
    reset,
    onFocus
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
}

.search-field {
    display: grid;
    grid-template-columns: 32px auto 32px;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
    margin: -1rem -1rem 0 -1rem;
    pointer-events: auto;
    position: relative;

    :last-child {
        justify-self: end;
    }

    &.activated {
        pointer-events: auto;
        padding: 1rem;
    }
}

input {
    background: #333;
    border: none;
    color: #eee;
    font-size: 1.5rem;
}

.suggestion {
    grid-column-start: 2;
    position: absolute;
    top: .95rem;
    left: 1rem;
    font-size: 1.3rem;
    color: #777;

    :first-child {
        opacity: 0;
    }

}


textarea:focus, input:focus{
    outline: none;
}

.icon {
    fill: #eee;
    margin-right: 1rem;
}

.results {
    border-top: 1px solid #aaa;
    padding: 1rem 1rem 0 1rem;
    margin: 0 -1rem 0 -1rem;

    .result {
        span {
            margin-right: 1rem;
        }
    }
}
</style>