//import bp from 'body-parser'
const bodyParser = require('body-parser')

// Expressアプリケーションインスタンスを受け取る関数をエクスポート
module.exports = app => {

  app.use(bodyParser.json())

  // ユーザ情報
  const users = {
    'foo@domain.com': {
      password: '12345678',
      userId: 1,
      token: '1234567890abcdef'
    }
  }

  let nextTaskListId = 1
  let nextTaskId = 1

  const generateTaskListId = () => nextTaskListId++
  const generateTaskId = () => nextTaskId++

  const createTask = listId => ({
    id: generateTaskId(),
    name: `タスク${nextTaskId - 1}`,
    description: `これはタスク${nextTaskId - 1}です。`,
    listId
  })

  const createTaskList = (name, num) => {
    const id = generateTaskListId()
    const list = {id, name, items: []}
    for (let i = 0; i < num; i++) {
      list.items.push(createTask(id))
    }
    return list
  }

  // ボード情報
  const board = {
    lists: [
      createTaskList('TODO', 2),
      createTaskList('WIP', 1),
      createTaskList('DONE', 1)
    ]
  }

  // ログインAPIのエンドポイント
  app.post('/auth/login', (req, res) => {
    const {email, password} = req.body
    const user = users[email]

    if (user) {
      if (user.password !== password) {
        res.status(401).json({message: 'ログインに失敗しました。'})
      } else {
        res.json({userId: user.userId, token: user.token})
      }
    } else {
      res.status(404).json({message: 'ユーザが登録されていません。'})
    }
  })

  // ボードタスクリストAPIのエンドポイント
  app.get('/lists', (req, res) => {
    const token = req.headers['x-kbn-token']
    if (!token) {
      return res.status(403).json({message: '許可されていません。'})
    }
    res.json({lists: board.lists})
  })

  // タスクを追加するヘルパー関数
  function addTask (board, name, listId) {
    let task = null
    for (let i = 0; i < board.lists.length; i++) {
      const list = board.lists[i]
      if (list.id === listId) {
        task = {
          id: generateTaskId(),
          name,
          description: '',
          listId
        }
        list.item.push(task)
        break
      }
    }
    return task
  }

  app.post('/task/add', (req, res) => {
    const token = req.headers['x-kbn-token']
    if (!token) {
      return res.status(403).json({message: '許可されていません。'})
    }
    const {name} = req.body
    const listId = parseInt(req.body.listId)
    const task = addTask(board, name, listId)
    if (task) {
      res.status(201).json(task)
    } else {
      res.status(500).json({message: '何らかの原因でタスクの追加に失敗しました。'})
    }
  })

  //　タスクを更新するヘルパー関数
  function updateTask (board, id, name, description, listId) {
    let ret = false
    for (let i = 0; i < board.lists.length; i++) {
      const list = board.lists[i]
      if (list.id !== listId) {
        continue
      }
      for (let j = 0; j < list.items.length; j++) {
        const item = list.items[j]
        if (item.id === id) {
          item.name = name
          item.description = description
          ret = true
          break
        }
      }
    }
    return ret
  }

  //　タスク更新APIのエンドポイント
  app.put('/tasks/:id/update', (req, res) => {
    console.log('in client put')
    const token = req.headers['x-kbn-token']
    if (!token) {
      return res.status(403).json({message: '許可されていません。'})
    }
    const { name, description } = req.body
    const id = parseInt(req.params.id)
    const listId = parseInt(req.body.listId)
    const ret = updateTask(board, id, name, description, listId)
    if(ret){
      // 基本的にレスポンスを返さないやつにはsendStatusを使うとレスポンス返す
      res.sendStatus(200)
    } else {
      res.status(500).json({ message: '何らかの原因でタスクの更新に失敗しました。'})
    }
  })

  function removeTask (board, id) {
    board.lists.forEach(list => {
      list.items = list.items.filter(item => item.id !== id)
    })
  }

  app.delete('/tasks/:id/remove', (req, res) => {
    const token = req.headers['x-kbn-token']
    if(!token) {
      return res.status(403).json({ message: '許可されていません' })
    }
    const id = parseInt(req.params.id)
    removeTask(board, id)
    res.sendStatus(204)
  })

  app.delete('/auth/logout', (req, res) => {
    const token = req.headers['x-kbn-token']
    if(!token) {
      return res.status(403).json({ message: '許可されていません' })
    }
    res.sendStatus(204)
  })
}
