package com.example.cicddemo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HelloServiceTest {

    @Test
    void returnsTheExpectedGreeting() {
        HelloService service = new HelloService();

        assertEquals("Hello from CI/CD Demo!", service.getGreeting());
    }
}
