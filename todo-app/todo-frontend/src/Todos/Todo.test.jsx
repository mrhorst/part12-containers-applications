import { render, screen } from '@testing-library/react'
import Todo from './Todo'

describe('when passing a todo directly to the Todo component...', () => {
  const todoComponent = (todo) => (
    <Todo todo={todo} onClickDelete={() => {}} onClickComplete={() => {}} />
  )

  test('renders todo text', () => {
    const todo = { _id: '1', text: 'Testing renders todo text', done: false }
    render(todoComponent(todo))

    expect(screen.getByText('Testing renders todo text')).toBeInTheDocument()
  })
})
