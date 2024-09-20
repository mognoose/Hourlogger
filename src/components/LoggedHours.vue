<template>
    <table>
        <thead>
            <tr>
            <th>Task</th>
            <th>Description</th>
            <th>Time</th>
            <th>Date</th>
            <th>Timecode</th>
            <th>Workorder</th>
            <th>Project</th>
            <th>Project description</th>
            </tr>
        </thead>
        <tbody>
            <tr @click="emits('edit', entry.id)" v-for="(entry, index) in useHoursStore().hours" :key="index">
                <td>{{useProjectsStore().getProjectInfo(entry.project)?.jiracode}}-{{entry.task}}</td>
                <td>{{entry.description}}</td>
                <td>{{parseTime(entry.minutes)}}</td>
                <td>{{entry.date}}</td>
                <td>{{useProjectsStore().getProjectInfo(entry.project)?.timecode}}</td>
                <td>{{useProjectsStore().getProjectInfo(entry.project)?.workorder}}</td>
                <td>{{useProjectsStore().getProjectInfo(entry.project)?.project}}</td>
                <td>{{useProjectsStore().getProjectInfo(entry.project)?.description}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { useHoursStore } from '@/stores/hours';
import { useProjectsStore } from '../stores/projects';

const parseTime = mins => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    m = m < 10 ? '0' + m : m;

    return `${h > 0 ? `${h}h` : ''} ${m > 0 ? `${m}m` : ''}`;
}

const emits = defineEmits(['edit'])
</script>

<style lang="css">
</style>