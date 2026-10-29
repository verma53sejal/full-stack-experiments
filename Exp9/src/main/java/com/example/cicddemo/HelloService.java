package com.example.cicddemo;

import org.springframework.stereotype.Service;

@Service
public class HelloService {

    public String getGreeting() {
        return "Hello from CI/CD Demo!";
    }
}
