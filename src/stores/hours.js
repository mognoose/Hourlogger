import { defineStore } from 'pinia'

export const useHoursStore = defineStore('hours', {
    state: () => ({
        newHour: {
            id: '',
            project: '',
            task: '',
            description: '',
            minutes: 60,
            date: ''
        },
        hours: [],
    }),
    actions: {
        loadFromLocal() {
            if(!window.localStorage.getItem('hours')) return;
            this.hours = JSON.parse(window.localStorage.getItem('hours'));
        },
        saveToLocal() {
            localStorage.setItem('hours', JSON.stringify(this.hours));
        },
        logProject(project) {
            this.newHour.id = Date.now();
            this.newHour.project = project.id;
            this.newHour.date = new Date(Date.now()).toISOString().slice(0,10);
        },
        setProp(prop, value) {
            this.newHour[prop] = value;
        },
        submitEntry() {
            this.hours.push(this.newHour);
            this.newHour = {
                id: '',
                project: '',
                task: '',
                description: '',
                minutes: 60,
                date: ''
            }
            this.saveToLocal();
        },
        updateEntry(entryId, data) {
            this.hours.map(entry => {
                if (entry.id === entryId){

                    return data;
                }
            })
            this.saveToLocal();
        },
        deleteEntry(entryId) {
            this.hours = this.hours.filter(entry => entry.id !== entryId);
            this.saveToLocal();
        },
        getHoursInfo(id) {
            return this.hours.find(h=>h.id === parseInt(id));
        },
    }
})