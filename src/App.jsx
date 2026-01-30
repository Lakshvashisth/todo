
import { useState, useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Navbar from './components/Navbar'

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showfinished, setshowfinished] = useState(true)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8080/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.log("Backend error", err))
  }, [])

 
  const handleChange = (e) => {
    setTodo(e.target.value)
  }

 
  const handleAdd = async () => {
    if (todo.length <= 3) return

    const url = editId
      ? `http://localhost:8080/api/todos/${editId}`
      : `http://localhost:8080/api/todos`

    const method = editId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: todo,
        completed: false
      })
    })

    const data = await res.json()

    if (editId) {
      setTodos(todos.map(t => t.id === data.id ? data : t))
      setEditId(null)
    } else {
      setTodos([...todos, data])
    }

    setTodo("")
  }

  
  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "DELETE"
    })
    setTodos(todos.filter(item => item.id !== id))
  }

  
  const handleEdit = (id) => {
    const t = todos.find(item => item.id === id)
    setTodo(t.todo)
    setEditId(id)
  }

  
  const handleCheckbox = async (id) => {
    const t = todos.find(item => item.id === id)

    const res = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: t.todo,
        completed: !t.completed
      })
    })

    const updated = await res.json()

    setTodos(
      todos.map(item =>
        item.id === updated.id ? updated : item
      )
    )
  }

  const togglefinished = () => {
    setshowfinished(!showfinished)
  }

 
  return (
    <>
      <Navbar />

      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">

        <h1 className='font-bold text-center text-3xl'>
          iTask-Manage your todos at one place
        </h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>Add a Todo</h2>

          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className='w-full rounded-full px-5 py-1'
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-700 p-4 py-2 text-sm font-bold text-white'>
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        <input
          className='my-4'
          id='show'
          onChange={togglefinished}
          type="checkbox"
          checked={showfinished}
        />
        <label className='mx-2' htmlFor="show">Show Finished</label>

        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>

        <h2 className='text-lg font-bold'>Your Todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}

          {todos.map(item => {
            return (showfinished || !item.completed) && (
              <div key={item.id} className="todo flex my-3 justify-between">

                <div className='flex gap-5'>
                  <input
                    onChange={() => handleCheckbox(item.id)}
                    type="checkbox"
                    checked={item.completed}
                  />
                  <div className={item.completed ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>

                <div className="buttons flex h-full">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-3 py-1 text-sm font-bold text-white rounded-md mx-2'>
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-3 py-1 text-sm font-bold text-white rounded-md mx-2'>
                    <AiFillDelete />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
