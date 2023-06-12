import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.param('word', (req, res, next, word) => {
    if (!word) req.word = null
    else req.params.word = word.toLowerCase()
    next()
})

app.get('/api/dictionary/add/:word([a-z%C3%A1%C3%A9%C3%B3]+)', (req, res) => {
    const word = req.params.word
    //TODO: lógica para agregar la palabra a la BD
    res.send(`Palabra [${word}] agregada con éxito!`)
})

// app.get('/api/dictionary/add/:word', (req, res) => {
//     const word = req.params.word
//     const regla = /a-z{1,}/
//     if (regla.test(word)) {
//         //TODO: lógica para agregar la palabra a la BD
//         return res.send(`Palabra [${word}] agregada con éxito!`)
//     }
//     res.json({ error: 'Error'})
// })

app.get('*', (req, res) => res.json({ message: 'endpoint no encontrado' }))

app.listen(8080, () => console.log('Server Up!'))