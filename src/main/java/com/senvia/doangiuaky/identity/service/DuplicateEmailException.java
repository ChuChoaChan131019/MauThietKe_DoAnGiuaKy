package com.senvia.doangiuaky.identity.service;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException() {
        super("Email đã được sử dụng.");
    }
}
