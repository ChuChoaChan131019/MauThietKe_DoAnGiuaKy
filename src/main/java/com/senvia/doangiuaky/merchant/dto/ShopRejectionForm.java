package com.senvia.doangiuaky.merchant.dto;

import jakarta.validation.constraints.NotBlank;

/** Form submitted by an Admin who rejects a pending shop request. */
public class ShopRejectionForm {

    @NotBlank(message = "Vui lòng nhập lý do từ chối.")
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
