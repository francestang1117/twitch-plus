package com.frances.twitch.external;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.frances.twitch.external.model.Game;

@RestController
public class GameController {

    private final TwitchService twitchService;

    public GameController(TwitchService twitchService) {
        this.twitchService = twitchService;
    }

    @GetMapping("/game")
    public List<Game> getGames(@RequestParam(value = "game_name", required = false) String gameName) {
        if (gameName == null) {
            return twitchService.getTopGames();
        } else {
            return twitchService.getGames(gameName);
        }
    }

    @GetMapping("/search/categories")
    public List<Game> searchCategories(@RequestParam(value = "query", required = true) String query) {
        return twitchService.searchCategories(query);
    }
}
