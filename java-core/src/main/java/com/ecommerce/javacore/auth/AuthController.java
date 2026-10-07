package com.ecommerce.javacore.auth;

import com.ecommerce.javacore.auth.dto.RegisterRequest;
import com.ecommerce.javacore.auth.dto.RegisterResponse;
import com.ecommerce.javacore.config.AppConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/java/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private UserDetailsService userDetailsService;

    // POST /api/java/auth/register
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        String userId = request.getUserId();
        String role = request.getRole();
        
        // In production: hash password, create user in DB
        String encryptedPhone = authService.encryptPhone(request.getEmail()); // reusing method for demo
        
        // Generate initial token
        Key key = Keys.hmacShaKeyFor(appConfig.getJwtSecret().getBytes());
        String token = Jwts.builder()
                .setSubject(userId)
                .claim("role", role)
                .claim("sellerId", request.getSellerId() != null ? request.getSellerId() : "")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 900000))
                .signWith(key)
                .compact();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(userId, token, role));
    }

    // GET /api/java/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        String token = authorization.substring(7);
        
        // Verify token and extract user info
        // In production: use proper JWT validation
        String userId = "verified_user"; // simplified
        String role = "buyer"; // simplified
        
        return ResponseEntity.ok().body(java.util.Map.of(
                "userId", userId,
                "role", role
        ));
    }

    // Seller endpoints
    @GetMapping("/sellers/{id}")
    public ResponseEntity<SellerDto> getSeller(@PathVariable String id) {
        // Public profile - no auth required
        SellerDto seller = new SellerDto(id, "user_123", "My Store", "pending", null, "4.5", 1250L);
        return ResponseEntity.ok(seller);
    }

    @PutMapping("/sellers/kyc")
    public ResponseEntity<String> uploadKyc(@RequestParam("document") String documentUrl,
                                            @RequestHeader("Authorization") String authHeader) {
        // Store URL only - actual file goes to MinIO via Node service
        // In production: validate document, store URL, update DB
        return ResponseEntity.ok("KYC document saved: " + documentUrl);
    }

    // Admin endpoints
    @GetMapping("/admin/sellers")
    @RolesAllowed("admin")
    public ResponseEntity<?> listSellersForVerification() {
        // In production: query DB for sellers with pending KYC
        return ResponseEntity.ok(java.util.Map.of(
                "sellers", java.util.List.of(
                        java.util.Map.of("id", "seller_1", "userId", "user_1", "kycStatus", "pending"),
                        java.util.Map.of("id", "seller_2", "userId", "user_2", "kycStatus", "pending")
                )
        ));
    }

    @PutMapping("/admin/sellers/{id}/verify")
    @RolesAllowed("admin")
    public ResponseEntity<?> verifySeller(@PathVariable String id) {
        // In production: update seller KYC status to verified
        return ResponseEntity.ok(java.util.Map.of("id", id, "status", "verified"));
    }

    // Order endpoints for customer
    @GetMapping("/orders/my")
    public ResponseEntity<?> myOrders(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        // In production: fetch orders for authenticated user
        return ResponseEntity.ok(java.util.Map.of(
                "orders", java.util.List.of(
                        java.util.Map.of("id", "order_1", "status", "paid", "amount", 1500.0)
                )
        ));
    }

    // Order endpoints for seller (RLS enforced)
    @GetMapping("/orders/seller/my")
    public ResponseEntity<?> sellerMyOrders(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        // RLS will enforce - seller can only see their own orders
        return ResponseEntity.ok(java.util.Map.of(
                "orders", java.util.List.of(
                        java.util.Map.of("id", "order_1", "status", "pending", "amount", 800.0)
                )
        ));
    }
}