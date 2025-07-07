package com.frances.twitch.hello;

import net.datafaker.Faker;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController         // spring发送请求的时候只会看带有RestController annotation的class, 程序会根据这些annotation进行动态判断
public class HelloController {

    @GetMapping("/hello")       // route path
    public Person sayHello(@RequestParam(required = false) String name) {
        if (name == null) {
            name = "Hello";
        }

        Faker faker = new Faker();
        String company = faker.company().name();
        String street = faker.address().streetAddress();
        String city = faker.address().city();
        String state = faker.address().state();
        String bookTitle = faker.book().title();
        String bookAuthor = faker.book().author();
        return new Person(name, company, new Address(street, city, state, null), new Book(bookTitle, bookAuthor));
    }
}

