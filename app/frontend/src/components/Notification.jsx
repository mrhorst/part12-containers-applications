const Notification = ({ message, type }) => {
  return (
    <div className={`${type} notification`}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
