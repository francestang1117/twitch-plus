package com.frances.twitch.favorite;

import com.frances.twitch.db.entity.UserEntity;
import com.frances.twitch.model.TypeGroupItemList;
import com.frances.twitch.user.UserSerivce;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite")        // when all the method use the same route path prefix: /favorite
public class FavoriteController {

    private final FavoriteService favoriteService;

    private final UserSerivce userSerivce;

    // Hard-coded user for temporary use, will be replaced in future
//    private final UserEntity userEntity = new UserEntity(1L, "user0", "Foo", "Bar", "password");


    public FavoriteController(FavoriteService favoriteService, UserSerivce userSerivce) {
        this.favoriteService = favoriteService;
        this.userSerivce = userSerivce;
    }

    // Handles GET /favorites, get the user's favorite items grouped by type
    @GetMapping
    public TypeGroupItemList getFavoriteItems(@AuthenticationPrincipal User user) {
        UserEntity userEntity = userSerivce.findUserByUsername(user.getUsername());
        return favoriteService.getGroupedFavoriteItems(userEntity);
    }

    // Handles POST /favorites, adds a new favorite item for the current user
    @PostMapping
    public void setFavoriteItem(@AuthenticationPrincipal User user, @RequestBody FavoriteRequestBody body) {
        UserEntity userEntity = userSerivce.findUserByUsername(user.getUsername());
        favoriteService.setFavoriteItem(userEntity, body.favorite());
    }

    // // Handles DELETE /favorites, removes a favorite item from the current user
    @DeleteMapping
    public void unsetFavoriteItem(@AuthenticationPrincipal User user, @RequestBody FavoriteRequestBody body) {
        UserEntity userEntity = userSerivce.findUserByUsername(user.getUsername());
        favoriteService.unsetFavoriteItem(userEntity, body.favorite().twitchId());
    }
}
