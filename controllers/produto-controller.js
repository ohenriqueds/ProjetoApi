const mysql = require('../mysql');

exports.getprodutos = async (req, res, next) => {
    try {
        let name = '';
        if (req.query.name) {
            name = req.query.name;    
        }
    
        const query = `
            SELECT *
               FROM produtos
              WHERE categoryId = ?
                AND (
                    name LIKE '%${name}%'
                );
        `;
        const result = await mysql.execute(query, [
            req.query.categoryId
        ])
        const response = {
            length: result.length,
            produtos: result.map(prod => {
                return {
                    produtoId: prod.produtoId,
                    name: prod.name,
                    price: prod.price,
                    produtoImage: prod.produtoImage,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto específico',
                        url: process.env.URL_API + 'produtos/' + prod.produtoId
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postproduto = async (req, res, next) => {
    try {
        const query = 'INSERT INTO produtos (name, price, produtoImage, categoryId) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.file.path,
            req.body.categoryId,
        ]);

        const response = {
            message: 'Produto inserido com sucesso',
            createdproduto: {
                produtoId: result.insertId,
                name: req.body.name,
                price: req.body.price,
                produtoImage: req.file.path,
                categoryId: req.body.categoryId,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getprodutoDetail = async (req, res, next)=> {
    try {
        const query = 'SELECT * FROM produtos WHERE produtoId = ?;';
        const result = await mysql.execute(query, [req.params.produtoId]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado produto com este ID'
            })
        }
        const response = {
            produto: {
                produtoId: result[0].produtoId,
                name: result[0].name,
                price: result[0].price,
                produtoImage: result[0].produtoImage,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateproduto = async (req, res, next) => {

    try {
        const query = ` UPDATE produtos
                           SET name         = ?,
                               price        = ?
                         WHERE produtoId    = ?`;
        await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.params.produtoId
        ]);
        const response = {
            message: 'Produto atualizado com sucesso',
            upatedproduto: {
                produtoId: req.params.produtoId,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um produto específico',
                    url: process.env.URL_API + 'produtos/' + req.params.produtoId
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteproduto = async (req, res, next) => {
    try {
        const query = `DELETE FROM produtos WHERE produtoId = ?`;
        await mysql.execute(query, [req.params.produtoId]);

        const response = {
            message: 'Produto removido com sucesso',
            request: {
                type: 'POST',
                description: 'Insere um produto',
                url: process.env.URL_API + 'produtos',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }
        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postImage = async (req, res, next) => {
    try {
        const query = 'INSERT INTO produtoImages (produtoId, path) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.params.produtoId,
            req.file.path
        ]);

        const response = {
            message: 'Imagem inserida com sucesso',
            createdImage: {
                produtoId: parseInt(req.params.produtoId),
                imageId: result.insertId,
                path: req.file.path,
                request: {
                    type: 'GET',
                    description: 'Retorna todos as imagens',
                    url: process.env.URL_API + 'produtos/' + req.params.produtoId + '/imagens'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getImages = async (req, res, next) => {
    try {
        const query  = "SELECT * FROM produtoImages WHERE produtoId = ?;"
        const result = await mysql.execute(query, [req.params.produtoId])
        const response = {
            length: result.length,
            images: result.map(img => {
                return {
                    produtoId: parseInt(req.params.produtoId),
                    imageId: img.imageId,
                    path: process.env.URL_API + img.path
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};