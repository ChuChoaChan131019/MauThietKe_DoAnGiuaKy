package com.senvia.doangiuaky.identity.api;

import java.util.List;
import java.util.Optional;

public interface IdentityApi {

    Optional<UserSummary> findUser(Long userId);

    boolean userExists(Long userId);

    boolean isUserActive(Long userId);

    List<UserSummary> findActiveAdmins();
}
