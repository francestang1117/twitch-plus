package com.frances.twitch.recommendation;

import com.frances.twitch.db.entity.UserEntity;
import com.frances.twitch.model.TypeGroupItemList;
import com.frances.twitch.user.UserSerivce;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserSerivce userService;

    public RecommendationController(RecommendationService recommendationService, UserSerivce userService) {
        this.recommendationService = recommendationService;
        this.userService = userService;
    }

    // Handle HTTP GET requests
    @GetMapping("/recommendation")
    public TypeGroupItemList getRecommendation(@AuthenticationPrincipal User user) {

        // Initialize the user entity as null in case the user is not authenticated
        UserEntity userEntity = null;

        // If the user is authenticated, get the user entity from the database by username
        if (user != null) {
            userEntity = userService.findUserByUsername(user.getUsername());
        }

        // generate personalized recommendations
        return recommendationService.recommendItems(userEntity);
    }
}
