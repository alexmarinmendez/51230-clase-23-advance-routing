import MyRouter from "./myRouter.js"
import jwt from 'jsonwebtoken'

export default class UserRouter extends MyRouter {
    init() {
        this.get('/', ['PUBLIC'], (req, res) => {
            const user = {
                email: 'coder@coder.com',
                role: 'admin'
            }
            const token = jwt.sign(user, 'secret')
            res.sendSuccess(token)
        })

        this.post('/:word', ['USER', 'ADMIN', 'PUBLIC'], (req, res) => {
            if (req.params.word === 'x') res.sendUserError('No puede enviar esta palabra')
            else res.sendSuccess('Word added!')
        })
    }
}