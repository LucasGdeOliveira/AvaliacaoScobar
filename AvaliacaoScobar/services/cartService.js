const { Cart, Produtos, CartProdutos } = require('../models');

class CartService {
    // Função para criar o carrinho se não existir
    async createCartIfNotExists(userId) {
        let cart = await Cart.findOne({ where: { userId, status: 'aberto' } });

        if (!cart) {
            cart = await Cart.create({ userId, status: 'aberto' });
        }

        return cart;
    }

    // Adiciona um produto ao carrinho
    async addProductToCart(userId, productId, quantidade) {
        let cart = await Cart.findOne({ where: { userId, status: 'aberto' } });

        if (!cart) {
            cart = await Cart.create({ userId, status: 'aberto' });
        }

        const produto = await Produtos.findByPk(productId);
        if (!produto) throw new Error('Produto não encontrado.');

        if (produto.estoque < quantidade) throw new Error('Estoque insuficiente.');

        produto.estoque -= quantidade;
        await produto.save();

        let cartProduto = await CartProdutos.findOne({
            where: { cartId: cart.id, produtoId: productId }
        });

        if (cartProduto) {
            cartProduto.quantidade += quantidade;
            cartProduto.totalPrice = cartProduto.quantidade * parseFloat(produto.preco);
            await cartProduto.save();
        } else {
            await CartProdutos.create({
                cartId: cart.id,
                produtoId: productId,
                nome: produto.nome,
                quantidade: quantidade,
                totalPrice: produto.preco * quantidade
            });
        }

        return cart;
    }

    // Função de remoção de produto do carrinho
    async removeProductFromCart(userId, productId) {
        const cart = await Cart.findOne({ where: { userId, status: 'aberto' } });
        if (!cart) throw new Error('Carrinho não encontrado ou está fechado.');

        // Procura o produto dentro dos itens do carrinho
        const cartProduto = await CartProdutos.findOne({
            where: { cartId: cart.id, produtoId: productId }
        });
        
        if (!cartProduto) throw new Error('Produto não encontrado no carrinho.');

        // Atualiza o estoque do produto removido
        const produto = await Produtos.findByPk(productId);
        if (produto) {
            produto.estoque += cartProduto.quantidade; // Adiciona a quantidade de volta ao estoque
            await produto.save();
        }

        // Remove o produto do carrinho
        await cartProduto.destroy();

        return cart; // Retorna o carrinho atualizado
    }

    // Recupera o carrinho do usuário
    async getCart(userId) {
        let cart = await this.createCartIfNotExists(userId);
        const cartItems = await CartProdutos.findAll({ where: { cartId: cart.id } });

        return {
            id: cart.id,
            userId: cart.userId,
            status: cart.status,
            items: cartItems.map(item => ({
                id: item.id,
                produtoId: item.produtoId,
                nome: item.nome,
                quantidade: item.quantidade,
                totalPrice: item.totalPrice
            }))
        };
    }
}

module.exports = new CartService();
