package com.example.cicddemo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StatusService {

    private final String version;

    public StatusService(@Value("${app.version:1.0.0}") String version) {
        this.version = version;
    }

    public StatusResponse getStatus() {
        return new StatusResponse("UP", "ci-cd-demo", version);
    }
}
