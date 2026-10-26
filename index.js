import express from 'express'
import pg from 'pg'
import joi from 'joi'

const app = express()
const port = 3000
const  { Pool } = pg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mahasiswa',
  password: 'fazasukamieayam',
    port: 5432,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        })
           
     })
        next()
})

function successResponse(res, data, message = 'Success', status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data,
        error: null,
    })
}

function errorResponse(res, message,status, details = null) {
    return res.status(status).json({
        success: false,
        message,
        details,
    })
}

const biodataSchema = joi.object({
    id: joi.number().integer().required(),
    nama: joi.string().required(),
    nim: joi.string().required(),
    kelas: joi.string().required(),
})

const idSchema = joi.object({
    id: joi.number().integer().positive().required(),
})

function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
        })
        if (error) {
            return errorResponse(
                res,
                 'Validasi input gagal',
                  400,
                   error.details.map(item => ({
                    field: item.path.join('.'),
                     message: item.message})))
        }
        req.body = value
        next()
    }
}

function validateParams(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.params,)
        if (error) {
            return errorResponse(
                res,
                'parameter tidak valid',
                400,
                error.details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message
                }))
            )
        }
        req.params = value
        next()
    }
}

