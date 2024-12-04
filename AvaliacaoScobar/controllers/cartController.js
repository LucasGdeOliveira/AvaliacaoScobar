const cartService = require('../services/CartService');

class CartController {
    // Adiciona um produto ao carrinho
    async addProduct(req, res) {
        const { productId, quantidade } = req.body;
        const userId = req.userId; // O userId vem do middleware de autenticação

        if (!userId || !productId || isNaN(quantidade) || quantidade <= 0) {
            return res.status(400).json({ message: 'Dados inválidos. Certifique-se de que userId, productId e quantidade sejam válidos.' });
        }

        try {
            const updatedCart = await cartService.addProductToCart(userId, productId, quantidade);
            return res.status(200).json({ message: 'Produto adicionado ao carrinho.', cart: updatedCart });
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    // Remove um produto do carrinho
    async removeProduct(req, res) {
        const { productId } = req.params;
        const userId = req.userId; // Obtém o userId do token

        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId e productId são obrigatórios.' });
        }

        try {
            const updatedCart = await cartService.removeProductFromCart(userId, productId); // Chama a função do CartService
            return res.status(200).json({
                message: 'Produto removido do carrinho com sucesso.',
                cart: updatedCart
            });
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    // Visualiza o carrinho
    async viewCart(req, res) {
        const userId = req.userId; // O userId vem do middleware de autenticação

        if (!userId) {
            return res.status(400).json({ message: 'userId é obrigatório.' });
        }

        try {
            const cart = await cartService.getCart(userId);
            return res.status(200).json({ cart });
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CartController();
