const router = require('express').Router()
const db = require("../models")
console.log(router, 'router')

const { Place, Comment, User } = db

router.post('/', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed'})
    }
})


router.get('/', async (req, res) => {
    const places = await Place.findAll()
    res.json(places)
})


router.get('/:placeId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: { placeId: placeId },
            include: {
                association: 'comments',
                include: 'author'
            }
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            res.json(place)
        }
    }
})

router.put('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed'})
    }
})

router.delete('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed'})
    }
})

router.post('/:placeId/comments', async (req, res) => {
    const placeId = Number(req.params.placeId)

    req.body.rant = req.body.rant ? true : false

    const place = await Place.findOne({
        where: { placeId: placeId }
    })

    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` })
    }

    const author = await User.findOne({
        where: { userId: req.body.authorId }
    })

    if (!author) {
        res.status(404).json({ message: `Could not find author with id "${req.body.authorId}"` })
    }

    const comment = await Comment.create({
        ...req.body,
        authorId: req.currentUser.userId,
        placeId: placeId
    })

    res.send({
        ...comment.toJSON(),
        author: req.currentUser
    })
})

router.delete('/:placeId/comments/:commentId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    let commentId = Number(req.params.commentId)

    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else if (isNaN(commentId)) {
        res.status(404).json({ message: `Invalid id "${commentId}"` })
    } else  {
        const comment = await Comment.findOne({
            where: { commentId: commentId, placeId: placeId }
        })
        if (!comment) {
            res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` })
        } else {
            await comment.destroy()
            res.json(comment)
        }
    }
})


module.exports = router