const Todo = ({ todo, onClickDelete, onClickComplete }) => {
  const doneInfo = (
    <>
      <span style={{ flex: 1 }}>This todo is done</span>
      <span data-testid='delete-btn' style={{ flex: 1 }}>
        <button onClick={onClickDelete}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span style={{ flex: 1 }}>This todo is not done</span>
      <span style={{ flex: 1 }}>
        <button data-testid='delete-btn' onClick={onClickDelete}>
          {' '}
          Delete{' '}
        </button>
        <button data-testid='complete-btn' onClick={onClickComplete}>
          {' '}
          Set as done{' '}
        </button>
      </span>
    </>
  )

  return (
    <div
      data-testid='todo'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '70%',
        margin: 'auto',
        alignItems: 'center',
      }}
    >
      <span style={{ flex: 1 }}>{todo.text}</span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}
export default Todo
