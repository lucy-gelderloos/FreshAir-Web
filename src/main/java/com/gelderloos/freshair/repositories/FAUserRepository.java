package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FAUserRepository extends JpaRepository<Station, Long> {

}
