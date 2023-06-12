import { Router } from 'express'
import jwt from 'jsonwebtoken'

export default class MyRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    init() {}

    getRouter() {
        return this.router
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map(item => async(...params) => {
            try {
                await item.apply(this, params)
            } catch(err) {
                console.log(err)
                params[1].status(500).send(err)
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: 'success', payload })
        res.sendUserError = payload => res.send({ status: 'error', payload })
        res.sendNoAuthenticatedError = payload => res.send({ status: 'error', payload })
        res.sendNoAuthorizatedError = payload => res.send({ status: 'error', payload })
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies.includes('PUBLIC')) return next()
        if (policies.length > 0) {
            const authHeaders = req.headers.authorization

            if (!authHeaders) return res.sendNoAuthenticatedError('No authenticated!')
            const tokenArray = authHeaders.split(' ')
            const token = (tokenArray.length > 1) ? tokenArray[1] : tokenArray[0]

            const user = jwt.verify(token, 'secret')

            if (!policies.includes(user.role.toUpperCase())) {
                return res.sendNoAuthorizatedError('No Authorizated!')
            }

            req.user = user
        }
        next()
    }
}