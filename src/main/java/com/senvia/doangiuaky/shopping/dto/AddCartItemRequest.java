package com.senvia.doangiuaky.shopping.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AddCartItemRequest {

    @NotNull(message = "Vui lòng chọn sản phẩm.")
    private Long productId;

    @NotNull(message = "Số lượng là bắt buộc.")
    @Positive(message = "Số lượng phải lớn hơn 0.")
    private Integer quantity;

    public AddCartItemRequest() {
    }

    public AddCartItemRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
