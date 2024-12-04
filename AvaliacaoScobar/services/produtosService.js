class ProdutosService {
    constructor(produtoModel) {
        this.produtoModel = produtoModel;
    }

    // Criar produto
    async create(produtoData) {
        return await this.produtoModel.create(produtoData); // Criação do produto com o nome do usuário
    }

    // Listar todos os produtos
    async findAll() {
        return await this.produtoModel.findAll();
    }

    // Atualizar um produto
    async update(id, data) {
        const produto = await this.produtoModel.findByPk(id);
        if (!produto) {
            throw new Error('Produto não encontrado.');
        }
        return await produto.update(data);
    }

    // Deletar um produto
    async delete(id) {
        const produto = await this.produtoModel.findByPk(id);
        if (!produto) {
            throw new Error('Produto não encontrado.');
        }
        return await produto.destroy();
    }
}

module.exports = ProdutosService;
