import { useState } from 'react'
import loginService from '../services/login'

const Login = ({ setConfig, setUser, handleNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      setUser(user)
      setConfig({
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setUsername('')
      setPassword('')
      handleNotification(`Welcome, ${user.name}!`, 'success')
    } catch (e) {
      handleNotification(e.response.data.error, 'error')
    }
  }

  const handleInput = (e) => {
    if (e.target.id === 'username-input') {
      setUsername(e.target.value)
    }
    if (e.target.id === 'password-input') {
      setPassword(e.target.value)
    }
  }
  return (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username-input'>username</label>
          <input id='username-input' onChange={handleInput} value={username} />
        </div>
        <div>
          <label htmlFor='password-input'>password</label>
          <input id='password-input' onChange={handleInput} value={password} />
        </div>
        <button>login</button>
      </form>
    </div>
  )
}

export default Login
