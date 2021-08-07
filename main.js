Vue.createApp({
  data() {
    return {
      list: [],
      typeArea: '',
      filter: 'all',
      filterList: [
        { key: 'all', value: '全部' },
        { key:'notdone', value: '未完成' },
        { key:'done', value: '已完成' }
      ],

      oldValue: '',
      newValue: '',

      toast: null,
      toastText: '',
      toastStatus: '',

      modal:null,
      modalText: '',
      deleteTarget: '',
    }
  },
  mounted() {
    this.getLocalStorage()
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
    getLocalStorage() {
      if (window.localStorage.length === 0) return
      else this.list = JSON.parse(window.atob(window.localStorage.getItem('list')))
    },
    saveToLocalStorage() {
      window.localStorage.setItem('list', window.btoa(JSON.stringify(this.list)))
    },
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
      const nextid =  this.list.length === 0 ? 1 : Math.max(...this.list.map(item => item.id)) + 1
      this.list.push({
        id: (nextid === null) ? 1 : nextid,
        describe: this.typeArea,
        done: false,
        edit: false,
      })
      this.typeArea = ''
      this.filter = 'all'

      this.saveToLocalStorage()
    },
    updateRequest(index) {
      this.oldValue = this.list[index].describe
      this.newValue = this.list[index].describe
      this.list[index].edit = true
    },
    update(index) {
      if (this.oldValue === this.newValue) {
        this.list[index].edit = false
        return
      } else {
        this.list[index].describe = this.newValue
        this.list[index].edit = false
        this.saveToLocalStorage()
      }
    },
    remove(id) {
      const index = this.list.findIndex(item => item.id === id)
      this.list.splice(index, 1)
      this.modal.hide()
      this.saveToLocalStorage()
    },
    removeAll() {
      this.list.length = 0
      this.filter = 'all'
      this.modal.hide()
      this.saveToLocalStorage()
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
    modalShow(target) {
      this.deleteTarget = target

      if (target !== 'all') {
        const name = this.list.find(item => item.id === target).describe
        this.modalText = `是否移除待辦事項 ${ name } ？`
      } else this.modalText = '是否移除所有待辦事項？'
      const element = document.querySelector('#Modal')
      this.modal = new bootstrap.Modal(element)
      this.modal.show()
    },
  },
}).mount('#app');