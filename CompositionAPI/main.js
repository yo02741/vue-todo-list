import {
  createApp,
  ref,
  reactive,
  computed,
  onMounted,
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.0-beta.8/vue.esm-browser.min.js'

createApp({
  setup() {
    const list = reactive([])
    const typeArea = ref('')
    const filter = ref('')
    const filterList = reactive([
      { key: 'all', value: '全部' },
      { key:'notdone', value: '未完成' },
      { key:'done', value: '已完成' }
    ])
    const oldValue = ref('')
    const newValue = ref('')
    const toast = ref(null)
    const toastText = ref('')
    const toastStatus = ref('')
    const modal = ref(null)
    const modalText = ref('')
    const deleteTarget = ref('')

    const showlist = computed(() => {
      switch (filter.value) {
        case 'notdone':
          return list.filter(item => item.done === false)
          break;
        case 'done':
          return list.filter(item => item.done === true)
          break;
        default:
          return list
          break;
      }
    })

    const taskCountMsg = computed(() => {
      switch (filter.value) {
        case 'notdone':
          return `未完成 共有 ${ list.filter(item => item.done === false).length } 筆任務`
          break;
        case 'done':
          return `已完成 共有 ${ list.filter(item => item.done === true).length } 筆任務`
          break;
        default:
          return `全部 共有 ${ list.length } 筆任務`
          break;
      }
    })

    const getLocalStorage = () => {
      if (window.localStorage.length === 0) return
      else Object.assign(list, JSON.parse(window.atob(window.localStorage.getItem('list'))))
    }

    const saveToLocalStorage = () => {
      window.localStorage.setItem('list', window.btoa(JSON.stringify(list)))
    }

    const add = () => {
      if (typeArea.value === '') {
        toastText.value = '請輸入 準備要做的任務！'
        toastStatus.value = 'error'
        toastShow()
        return;
      }

      const sameCheck = list.findIndex(item => item.describe === typeArea.value)
      if (sameCheck !== -1) {
        toastText.value = '已有重複任務！'
        toastStatus.value = 'error'
        toastShow()
        return;
      }

      toastText.value = '已新增任務！'
      toastStatus.value = 'success'
      toastShow()
      const nextid =  list.length === 0 ? 1 : Math.max(...list.map(item => item.id)) + 1
      list.push({
        id: (nextid === null) ? 1 : nextid,
        describe: typeArea.value,
        done: false,
        edit: false,
      })
      typeArea.value = ''
      filter.value = 'all'

      saveToLocalStorage()
    }

    const updateRequest = (index) => {
      list.forEach(item => item.edit = false)
      oldValue.value = list[index].describe
      newValue.value = list[index].describe
      list[index].edit = true
    }

    const update = (index) => {
      if (oldValue.value === newValue.value) {
        list[index].edit = false
        return
      } else {
        list[index].describe = newValue.value
        list[index].edit = false
        saveToLocalStorage()
      }
    }

    const remove = (id) => {
      const index = list.findIndex(item => item.id === id)
      list.splice(index, 1)
      modal.value.hide()
      saveToLocalStorage()
    }

    const removeAll = () => {
      list.length = 0
      filter.value = 'all'
      modal.value.hide()
      saveToLocalStorage()
    }

    const switchFilter = (type) => {
      filter.value = type
    }

    const toastShow = () => {
      if (toast.value !== null) clearTimeout(toast.value._timeout)
      const element = document.querySelector('#Toast')
      const option = {
        animation: true,
        delay: 3000
      }
      toast.value = new bootstrap.Toast(element, option)
      toast.value.show()
    }
    
    const modalShow = (target) => {
      deleteTarget.value = target

      if (target !== 'all') {
        const name = list.find(item => item.id === target).describe
        modalText.value = `是否移除待辦事項 ${ name } ？`
      } else modalText.value = '是否移除所有待辦事項？'
      const element = document.querySelector('#Modal')
      modal.value = new bootstrap.Modal(element)
      modal.value.show()
    }

    onMounted(() => {
      getLocalStorage()
    })

    return {
      list,
      typeArea,
      filter,
      filterList,
      oldValue,
      newValue,
      toast,
      toastText,
      toastStatus,
      modal,
      modalText,
      deleteTarget,
      showlist,
      taskCountMsg,
      getLocalStorage,
      saveToLocalStorage,
      add,
      updateRequest,
      update,
      remove,
      removeAll,
      switchFilter,
      toastShow,
      modalShow,
    }
  },
}).mount('#app');