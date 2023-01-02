package com.gelderloos.freshair.repositories;

import com.gelderloos.freshair.models.FreshAirUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FAUserRepository extends JpaRepository<FreshAirUser, Long> {

}
