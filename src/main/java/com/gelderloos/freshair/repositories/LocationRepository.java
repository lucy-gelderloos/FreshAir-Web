package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    public Location findBySiteName(String siteName);
}
