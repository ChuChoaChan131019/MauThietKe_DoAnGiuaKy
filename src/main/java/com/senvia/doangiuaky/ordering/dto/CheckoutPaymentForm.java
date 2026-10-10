package com.senvia.doangiuaky.ordering.dto;

import com.senvia.doangiuaky.ordering.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class CheckoutPaymentForm {
    @NotNull(message = "Vui lòng chọn phương thức thanh toán.")
    private PaymentMethod paymentMethod;

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
