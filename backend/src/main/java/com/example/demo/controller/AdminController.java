package com.example.demo.controller;

import com.example.demo.model.Showtime;
import com.example.demo.services.AdminServices;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminServices adminServices;

    public AdminController(AdminServices adminServices) {
        this.adminServices = adminServices;
    }

    @PostMapping("/schedule-movie")
    public List<Showtime> scheduleMovie(
            @RequestParam Integer adminUserId,
            @RequestBody ScheduleMovieRequest request
    ) {
        return adminServices.scheduleMovie(
                adminUserId,
                request.getMovieId(),
                request.getShowroomId(),
                request.getStartTimes(),
                request.getEndTimes()
        );
    }

    public static class ScheduleMovieRequest {
        private Long movieId;
        private Integer showroomId;
        private List<LocalDateTime> startTimes;
        private List<LocalDateTime> endTimes;

        public Long getMovieId() {
            return movieId;
        }

        public void setMovieId(Long movieId) {
            this.movieId = movieId;
        }

        public Integer getShowroomId() {
            return showroomId;
        }

        public void setShowroomId(Integer showroomId) {
            this.showroomId = showroomId;
        }

        public List<LocalDateTime> getStartTimes() {
            return startTimes;
        }

        public void setStartTimes(List<LocalDateTime> startTimes) {
            this.startTimes = startTimes;
        }

        public List<LocalDateTime> getEndTimes() {
            return endTimes;
        }

        public void setEndTimes(List<LocalDateTime> endTimes) {
            this.endTimes = endTimes;
        }
    }
}
