document.addEventListener("DOMContentLoaded", function () {

    const paymentRadios = document.querySelectorAll(
        'input[name="paymentMethod"]'
    );

    const bankTransferNote = document.getElementById(
        "bank-transfer-note"
    );

    if (!bankTransferNote) {
        return;
    }

    function updatePaymentUI() {
        const selected = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        const isBankTransfer =
            selected?.value === "BANK_TRANSFER";

        bankTransferNote.hidden = !isBankTransfer;
    }

    paymentRadios.forEach(function (radio) {
        radio.addEventListener("change", updatePaymentUI);
    });

    updatePaymentUI();
});