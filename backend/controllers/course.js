import Course from '../models/Course.js'
import lodash from 'lodash'
import fs from 'fs'
import errorHandler from '../helpers/dbErrorHandler.js'
import formidable from 'formidable'

const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let course = new Course(fields)
        course.instructor = req.profile
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.mimetype
        }
        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

/**
 * Load course and append to req.
 */
const courseByID = async (req, res, next, id) => {
    try {
        let course = await Course.findById(id).populate('instructor', '_id name')
        if (!course) {
            return res.status('400').json({
                error: "Course not found"
            })
        }
        req.course = course
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve course"
        })
    }
}

const read = (req, res) => {
    req.course.image.data = undefined
    return res.json(req.course)
}

const list = async (req, res) => {
    try {
        let courses = await Course.find().select('name email updated created')
        res.json(courses)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const update = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        let course = req.course
        course = lodash.extend(course, fields)
        if (fields.lessons) {
            course.lessons = JSON.parse(fields.lessons)
        }
        course.updated = Date.now()
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.mimetype
        }
        try {
            await course.save()
            res.json(course)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const newLesson = async (req, res) => {
    try {
        let lesson = req.body.lesson
        let result = await Course.findByIdAndUpdate(req.course._id, { $push: { lessons: lesson }, updated: Date.now() }, { new: true })
            .populate('instructor', '_id name')
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let course = req.course
        let deleteCourse = await course.remove()
        res.json(deleteCourse)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.course && req.auth && req.course.instructor._id == req.auth._id
    if (!isInstructor) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

const listByInstructor = (req, res) => {
    Course.find({ instructor: req.profile._id }, (err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(courses)
    }).populate('instructor', '_id name')
}

const listPublished = (req, res) => {
    Course.find({ published: true }, (err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(courses)
    }).populate('instructor', '_id name')
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.course.image.contentType)
    return res.send(req.course.image.data)
}



export default {
    create,
    courseByID,
    read,
    list,
    remove,
    update,
    isInstructor,
    listByInstructor,
    photo,
    newLesson,
    listPublished
}
