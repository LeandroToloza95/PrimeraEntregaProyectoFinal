import { Router } from "express";
import { userManagerClass } from '../UserManager.js'

const router = Router();

router.get('/', async (req, res) => {
    try {

        const { limit } = req.query
        const { order } = req.query
        const usuarios = await userManagerClass.getUsers(req.query)

        if (!usuarios.length) {
            return res.status(200).json({ message: 'No users found' })
        }

        let mensajeLimite = 'without limit'
        if (limit && +limit > 0) {
            mensajeLimite = `limited to ${limit} elements`
        }

        let mensajeOrden = 'without order'
        if (order && (order == 'DESC' || order == 'ASC')) {
            mensajeOrden = `ordered to ${order}`
        }

        return res.status(200).json({ message: `users found ` + mensajeLimite + " " + mensajeOrden, "users": usuarios })
    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
})

router.get('/:iduser', async (req, res) => {
    try {
        const { iduser } = req.params
        const usuarios = await userManagerClass.getUsersbyID(+iduser)
        if (usuarios === -1) {
            return res.status(400).json({ message: 'User no found' })
        }
        return res.status(200).json({ message: `users with id ${iduser}`, users: usuarios })

    }
    catch (error) {
        return res.status(500).json({ message: error })
    }

})

router.post('/', async (req, res) => {
    //validacion del body de campos obligatorios
    const { first_name, last_name, email, password, isAdmin } = req.body

    if (!first_name || !last_name || !email || !password || !isAdmin) {
        return res.status(400).json({ message: 'Information sent is incompleted' })
    }
    try {
        const newUser = await userManagerClass.addUser(req.body)

        return res.status(200).json({ message: `New users created with id ${newUser.id}`, users: newUser })
    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
})

router.delete('/:iduser', async (req, res) => {
    try {
        // console.log(req.params);
        const { iduser } = req.params
        const UserDeleted = await userManagerClass.deleteUser(+iduser)

        if (UserDeleted === -1) {
            return res.status(400).json({ message: 'User no found' })
        }

        return res.status(200).json({ message: `User deleted with id ${UserDeleted[0].id}`, users: UserDeleted })

    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
})

router.put('/:iduser', async (req, res) => {
    try {
        // console.log(req.params);
        const { iduser } = req.params
        const obj = req.body
        const UserUpdated = await userManagerClass.updateUser(+iduser, obj)

        if (UserUpdated === -1) {
            return res.status(400).json({ message: 'User no found' })
        }

        return res.status(200).json({ message: `User updated with id ${UserUpdated.id}`, users: UserUpdated })

    }
    catch (error) {
        res.status(500).json({ message: error })
    }
})

export default router