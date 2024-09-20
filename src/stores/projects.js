import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        newProject: {
            id: '',
            timecode: '',
            workorder: '',
            project: '',
            description: '',
            jiracode: '',
            type: ''
        },
        projects: examples,
    }),
    actions: {
      setProp(prop, value) {
        this.newProject[prop] = value;
      },
      submitProject() {
        this.newProject.id = Date.now();
        this.newProject.project = this.newProject.workorder.split('-')[0];
        this.newProject.jiracode = this.newProject.jiracode.toUpperCase();
        this.newProject.type = this.newProject.type.toUpperCase();
        this.projects.push(this.newProject);
        this.saveToLocal();
      },
      loadFromLocal() {
        if(!window.localStorage.getItem('projects')) return;
        this.projects = JSON.parse(window.localStorage.getItem('projects'));
      },
      saveToLocal() {
          localStorage.setItem('projects', JSON.stringify(this.projects));
      },
      getProjectInfo(project) {
        return this.projects.find(p => p.id === project);
      },
      getProjects() {
        this.loadFromLocal();
        return this.projects;
      },
    }
})


const examples = [
    {
      "id": 1713523206655,
      "timecode": 111,
      "workorder": '123123-12',
      "project": 123123,
      "description": "Example Project",
      "jiracode": "EXP",
      "type": "IMP",
    },
    {
      "id": 1713523206656,
      "timecode": 111,
      "workorder": '321321-32',
      "project": 321321,
      "jiracode": "",
      "description": "Other planning and admin work",
      "type": "SPDE",
    },
]