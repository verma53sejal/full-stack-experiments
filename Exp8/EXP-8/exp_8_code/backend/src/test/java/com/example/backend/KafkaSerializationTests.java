package com.example.backend;

import com.example.backend.entity.ScheduledPost;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class KafkaSerializationTests {

    @Test
    void scheduledPostWithLocalDateTimeCanBePublishedAndConsumed() {
        LocalDateTime scheduledTime = LocalDateTime.of(2026, 10, 28, 22, 31);
        ScheduledPost post = new ScheduledPost();
        post.setId(42L);
        post.setContent("serialization test");
        post.setScheduledTime(scheduledTime);
        post.setStatus("PUBLISHING");

        JsonSerializer<ScheduledPost> serializer = new JsonSerializer<>();
        serializer.configure(Map.of("spring.json.add.type.headers", false), false);
        JsonDeserializer<ScheduledPost> deserializer = new JsonDeserializer<>();
        deserializer.configure(Map.of(
                "spring.json.value.default.type", ScheduledPost.class.getName(),
                "spring.json.trusted.packages", "com.example.backend.entity"
        ), false);

        byte[] payload = serializer.serialize("post-topic", post);
        ScheduledPost consumedPost = deserializer.deserialize("post-topic", payload);

        assertEquals(scheduledTime, consumedPost.getScheduledTime());
        assertEquals(post.getId(), consumedPost.getId());
        assertEquals(post.getContent(), consumedPost.getContent());
    }
}
