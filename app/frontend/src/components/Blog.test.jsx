import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { AddBlog } from './Blog'

const blog = {
  id: 1,
  author: 'Test1 author',
  title: 'Test1 title',
  url: 'Test1 url',
  user: '123',
}

const loggedUser = {
  token: 'dummy',
  name: 'dummy user',
  id: '123',
}

test('blog renders only author and title by default', () => {
  render(<Blog blogs={[blog]} user={loggedUser} />)

  const element = screen.getByText('Test1 author', { exact: false })
  const element2 = screen.getByText('Test1 title', { exact: false })
  const element3 = screen.queryByText('Test1 url', { exact: false })
  const element4 = screen.queryByText('likes', { exact: false })
  expect(element).toBeDefined()
  expect(element2).toBeDefined()
  expect(element3).toBeNull()
  expect(element4).toBeNull()
})

test('url and likes are shown when clicking the button..', async () => {
  render(<Blog blogs={[blog]} user={loggedUser} />)

  const user = userEvent.setup()

  const button = screen.getByText('show info')
  await user.click(button)

  const element = screen.getByText('url', { exact: false })
  const element2 = screen.getByText('likes', { exact: false })

  expect(element).toBeDefined()
  expect(element2).toBeDefined()
})

test('if like button is clicked twice, event handler is called twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blogs={[blog]} user={loggedUser} handleLike={mockHandler} />)

  const user = userEvent.setup()

  const showInfoBtn = screen.getByText('show info')
  await user.click(showInfoBtn)

  const likeBtn = screen.getByText('like')

  await user.click(likeBtn)
  await user.click(likeBtn)

  expect(mockHandler.mock.calls).toHaveLength(2)
  expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('new blog form calls the handler function with the right details', async () => {
  const mockHandleCreateBlog = vi.fn()
  const { container } = render(
    <AddBlog handleCreateBlog={mockHandleCreateBlog} />
  )

  const user = userEvent.setup()

  const newBlog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
  }
  const titleInput = container.querySelector('#titleInput')
  const authorInput = container.querySelector('#authorInput')
  const urlInput = container.querySelector('#urlInput')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)

  const addBlogBtn = screen.getByText('add blog')

  await user.click(addBlogBtn)

  expect(mockHandleCreateBlog).toHaveBeenCalledWith(
    'test title',
    'test author',
    'test url'
  )
})
