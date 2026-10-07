package com.senvia.doangiuaky.common.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class CommonErrorController {

    @GetMapping("/error/403")
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public String forbidden() {
        return "error/403";
    }
}
