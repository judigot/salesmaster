export default function rawQuery(condition?: string) {
  const sql: string = /*sql*/ `
        SELECT "order"."order_id",
            customer.customer_id,
            CONCAT(customer.first_name, ' ', customer.last_name) AS customer,
            (
                SELECT json_agg(products)
                FROM (
                        SELECT id,
                            order_id,
                            product.product_name,
                            quantity,
                            order_product.product_cost,
                            order_product.product_price,
                            discount
                        FROM order_product
                            JOIN product USING (product_id)
                        WHERE order_product.order_id = "order"."order_id"
                        ORDER BY id DESC
                    ) AS products
            ) AS order_product,
            order_date
        FROM "order"
            JOIN order_product USING (order_id)
            JOIN customer USING (customer_id)
        -- Condition
        ${condition || ""}
        GROUP BY order_id,
            customer.customer_id,
            customer
        ORDER BY order_id DESC
    `;
  return sql;
}
