package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {
    public Station findBySiteName(String siteName);
}
