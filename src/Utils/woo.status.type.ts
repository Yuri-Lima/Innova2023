const statusWoocommerce = {
    "processing": "Processando",
    // "pending": "Pagamento Pendente",
    "on-hold": "Aguardando",
    "produzindo" : "produzindo",
    // "entrega": "entrega",
    "completed": "concluido",
    // "cancelled": "cancelado",
    // "refunded": "reembolsado", 
    "failed": "malsucedido"
}

/**
 * Description: This function is used to get the status of the order in the correct language
 * @param {string} status - The status of the order
 */
function getWooStatusTranslated(statusOrder: string): void | string {
    let statusWoo = statusOrder;
    Object.entries(statusWoocommerce).forEach(([key, value]) => {
        if (key == statusOrder) {
            statusWoo = value;
        }
    });
    /**
     * If the status still has the same value, it means that it was not found in the object
     */
    if (statusWoo == statusOrder && statusOrder != "produzindo") {// statusOrder != "produzindo" Because the status "produzindo" has the same Key and Value in statusWoocommerce
        statusWoo = "Status not found";
        return statusWoo;
    }
    return statusWoo;
}

// console.log(getWooStatusTranslated("completed"));
export { getWooStatusTranslated };