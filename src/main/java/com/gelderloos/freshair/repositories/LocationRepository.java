package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.models.Station;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface LocationRepository extends JpaRepository<Location, Long> {
    public Location findByLocationName(String locationName);
    public Set<Location> findAllByLat(double lat);
    public Station findByIntlAqsCode(String intlAqsCode);

}
