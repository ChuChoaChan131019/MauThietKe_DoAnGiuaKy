package com.senvia.doangiuaky.common.controller;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class MockModelInterceptor implements HandlerInterceptor {
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        if (modelAndView != null && !modelAndView.getViewName().startsWith("redirect:")) {
            // Role: USER or ADMIN
            String role = request.getParameter("role");
            if (role == null) role = "USER";
            modelAndView.addObject("role", role);

            // Shop status: null, PENDING, REJECTED, APPROVED, LOCKED
            String shopStatus = request.getParameter("shopStatus");
            if (shopStatus == null) shopStatus = "PENDING";
            modelAndView.addObject("shopStatus", shopStatus);

            // Notifications
            modelAndView.addObject("unreadNotifications", 3);
        }
    }
}
