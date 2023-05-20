package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.Station;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Long> {
    public Station findBySiteName(String siteName);
    public Station findByIntlAqsCode(String intlAqsCode);
    public List<Station> findAllByIntlAqsCode(String intlAqsCode);
}
