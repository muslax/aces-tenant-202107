const Billing = ({ user }) => {

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  )
}

export default Billing