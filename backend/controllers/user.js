import User from '../models/User.js'
import lodash from 'lodash'
import errorHandler from '../helpers/dbErrorHandler.js'
import formidable from 'formidable'
import fs from 'fs'


const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err) // was : "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined  // when it becomes undefined means to delete this key-value pair from the object
    req.profile.salt = undefined // when it becomes undefined means to delete this key-value pair from the object
    return res.json(req.profile)
}



const update = async (req, res) => {
    let user = req.profile
    user = lodash.extend(user, req.body.user)
    user.updated = Date.now()
    try {
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}*/


const isEducator = (req, res, next) => {
    const isEducator = req.profile && req.profile.educator
    if (!isEducator) {
        return res.status('403').json({
            error: "User is not an educator"
        })
    }
    next()
}



export default {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    isEducator
}