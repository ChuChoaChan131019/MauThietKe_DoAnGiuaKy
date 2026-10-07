package com.senvia.doangiuaky.identity.security;

import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public IdentityUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(User.normalizeEmail(email))
                .orElseThrow(() -> new UsernameNotFoundException("Thông tin đăng nhập không chính xác."));
        return new IdentityPrincipal(user);
    }
}
