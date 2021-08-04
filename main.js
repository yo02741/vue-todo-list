Vue.createApp({
  data() {
    return {
      list: [
        { id: 1, describe: 'learn Vue3', done: true },
        { id: 2, describe: 'learn typescript', done: false },
        { id: 3, describe: 'learn bootstrap5', done: true },
        { id: 4, describe: 'learn graphQL', done: false },
      ],
      typeArea: '',
      filter: 'all', // all , notdone , done,

      toast: null,
      toastText: '',
      toastStatus: '',
    }
  },
  computed: {
    showlist() {
      switch (this.filter) {
        case 'notdone':
          return this.list.filter(item => item.done === false)
          break;
        case 'done':
          return this.list.filter(item => item.done === true)
          break;
        default:
          return this.list
          break;
      }
    },
    taskCountMsg() {
      switch (this.filter) {
        case 'notdone':
          return `未完成 共有 ${ this.list.filter(item => item.done === false).length } 筆任務`
          break;
        case 'done':
          return `已完成 共有 ${ this.list.filter(item => item.done === true).length } 筆任務`
          break;
        default:
          return `全部 共有 ${ this.list.length } 筆任務`
          break;
      }
    }
  },
  methods: {
    add() {
      if (this.typeArea === '') {
        this.toastText = '請輸入 準備要做的任務！'
        this.toastStatus = 'error'
        this.toastShow()
        return;
      }

      const sameCheck = this.list.findIndex(item => item.describe === this.typeArea)
      if (sameCheck !== -1) {
        this.toastText = '已有重複任務！'
        this.toastStatus = 'error'
        this.toastShow()
        return;
      }

      this.toastText = '已新增任務！'
      this.toastStatus = 'success'
      this.toastShow()
      const nextid =  Math.max(...this.list.map(item => item.id)) + 1
      this.list.push({
        id: nextid,
        describe: this.typeArea,
        done: false
      })
      this.typeArea = ''
      this.filter = 'all'
    },
    update() {
      console.log('up');
    },
    remove(id) {
      const index = this.list.findIndex(item => item.id === id)
      this.list.splice(index, 1)
    },
    removeAll() {
      this.list.length = 0
      this.filter = 'all'
    },
    switchFilter(type) {
      this.filter = type
    },
    toastShow() {
      if (this.toast !== null) clearTimeout(this.toast._timeout)
      const element = document.querySelector('#Toast')
      const option = {
        animation: true,
        delay: 3000
      }
      this.toast = new bootstrap.Toast(element, option)
      this.toast.show()
    },
  },
}).mount('#app');