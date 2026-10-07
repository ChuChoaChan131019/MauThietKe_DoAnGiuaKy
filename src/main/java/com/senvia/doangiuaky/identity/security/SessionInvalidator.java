package com.senvia.doangiuaky.identity.security;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Component;

@Component
public class SessionInvalidator {

    private final SessionRegistry sessionRegistry;

    public SessionInvalidator(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    public void invalidate(Long userId) {
        for (Object principal : sessionRegistry.getAllPrincipals()) {
            if (principal instanceof IdentityPrincipal identityPrincipal
                    && identityPrincipal.getUserId().equals(userId)) {
                for (SessionInformation session : sessionRegistry.getAllSessions(principal, false)) {
                    session.expireNow();
                }
            }
        }
    }
}
