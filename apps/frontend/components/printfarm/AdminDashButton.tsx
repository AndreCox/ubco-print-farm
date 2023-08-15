import { Button } from '@material-tailwind/react'
import { observer } from 'mobx-react-lite'
import { store } from '../../stores/Store'
const AdminDashButton = observer(() => {
  return (
    store.admin && (
      <Button
        onClick={() => {
          window.location.href = '/printfarm/admin/admindash'
        }}
      >
        Admin Dashboard
      </Button>
    )
  )
})

export default AdminDashButton
