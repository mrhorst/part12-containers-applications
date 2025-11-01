import Todo from './Todo'

//eslint-disable-next-line
const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => {
    completeTodo(todo)
  }
  return (
    <div>
      {todos
        .map((todo) => (
          <Todo
            key={todo._id}
            todo={todo}
            onClickDelete={() => onClickDelete(todo)}
            onClickComplete={() => onClickComplete(todo)}
          />
        ))
        .reduce((acc, cur, i) => [...acc, <hr key={`hr${i}`} />, cur], [])}
    </div>
  )
}

export default TodoList
