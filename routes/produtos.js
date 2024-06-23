const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        Mensagem: retorno get produtos sucesso!
    });
});


router.post('/,' (res, res, next) => {
    res.status(201).send({
        Mensagem: retorno post produtos sucesso!
    });
});

module.exports = router;