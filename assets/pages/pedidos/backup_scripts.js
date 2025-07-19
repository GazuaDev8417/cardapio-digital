flavorsByProduct = async (
    productId: string,
    step: number,
    client: string // precisa vir do frontend
): Promise<{ flavors: FlavorModel[], maxStep: number, total_quantity: number }> => {
    try {
        // Retornar os sabores com as quantidades do carrinho
        const flavors = await Connexion.con(`${this.FLAVORS_TABLE} as f`)
            .leftJoin(`${this.CART_TABLE} as c`, function () {
                this.on('c.flavor', '=', 'f.flavor')
                    .andOn('c.step', '=', Connexion.raw('?', [step]))
                    .andOn('c.client', '=', Connexion.raw('?', [client]))
                    .andOn('c.product_id', '=', 'f.product_id')
            })
            .where('f.product_id', productId)
            .andWhere('f.step', step)
            .orderBy('f.flavor', 'asc')
            .select(
                'f.flavor',
                'f.price',
                'f.ingredients',
                'f.step',
                'f.max_quantity',
                Connexion.raw('COALESCE(c.quantity, 0) as quantity'),
                'f.product_id'
            );

        // Retornar o maior step
        const [{ maxStep }] = await Connexion.con(this.FLAVORS_TABLE)
            .where({ product_id: productId })
            .max({ maxStep: 'step' });

        // Soma total das quantidades definidas na tabela flavors (pode ser removido se for irrelevante)
        const [{ total_quantity }] = await Connexion.con(this.FLAVORS_TABLE)
            .where({ product_id: productId })
            .sum({ total_quantity: 'quantity' });

        return {
            flavors,
            maxStep: Number(maxStep) || 0,
            total_quantity: Number(total_quantity) || 0
        };
    } catch (e: any) {
        throw new Error(`Erro ao buscar sabores: ${e.message || e}`);
    }
}
