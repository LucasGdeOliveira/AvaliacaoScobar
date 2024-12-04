class ProdutosController {
    constructor(produtosService) {
        this.produtosService = produtosService;
    }

    // Criar um novo produto
    async createProduto(req, res) {
        try {
            const { nome, descricao, preco, estoque } = req.body; // Garantir que o nome do usuário seja passado aqui
            const produtoData = { nome, descricao, preco, estoque }; // Adicionando o campo 'usuario'

            const newProduto = await this.produtosService.create(produtoData); // Cria o produto com o nome do usuário
            res.status(201).json(newProduto);
        } catch (error) {
            console.error('Erro ao criar o produto:', error);
            res.status(500).json({ error: 'Ocorreu um erro ao criar o produto.' });
        }
    }

    // Listar todos os produtos
    async listProdutos(req, res) {
        try {
            const produtos = await this.produtosService.findAll();
            res.status(200).json(produtos);
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({ error: 'Erro ao listar produtos.' });
        }
    }

    // Atualizar um produto existente
    async updateProduto(req, res) {
        const { id } = req.params;
        try {
            const produtoAtualizado = await this.produtosService.update(id, req.body);
            if (!produtoAtualizado) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            res.status(500).json({ error: 'Erro ao atualizar o produto.' });
        }
    }

    // Deletar um produto existente
    async deleteProduto(req, res) {
        const { id } = req.params;
        try {
            const produtoDeletado = await this.produtosService.delete(id);
            if (!produtoDeletado) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao excluir o produto:', error);
            res.status(500).json({ error: 'Erro ao excluir o produto.' });
        }
    }
}

module.exports = ProdutosController;
