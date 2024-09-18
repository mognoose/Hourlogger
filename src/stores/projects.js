import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        newProject: {
            id: '',
            project: '',
            task: '',
            description: '',
            minutes: 60,
            date: ''
        },
        projects: demo,
    }),
    actions: {
      getProjectInfo(project) {
        return this.projects.find(p => p.id === project)
      },
    }
})


const demo = [
    {
      "id": 1713523206655,
      "timecode": 101,
      "workorder": '20310009-65',
      "project": 20310009,
      "description": "St1 Magento Rampdown eCommerce",
      "jiracode": "MRE",
      "type": "IMP",
    },
    {
      "id": 1713523206656,
      "timecode": 101,
      "workorder": '20310253-11',
      "project": 20310253,
      "jiracode": "",
      "description": "Other planning and admin work",
      "type": "SPDE",
    },
]