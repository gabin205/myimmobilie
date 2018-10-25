-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 23. Nov 2017 um 23:10
-- Server-Version: 10.1.28-MariaDB
-- PHP-Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `fa17g16`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `real_estate_agencies`
--

CREATE TABLE `real_estate_agencies` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `adress_id` int(10) UNSIGNED DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `register_court` varchar(50) NOT NULL,
  `register_number` varchar(50) NOT NULL,
  `website` varchar(50) NOT NULL,
  `manager_id` int(10) UNSIGNED DEFAULT NULL,
  `profilepicture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `real_estate_agencies`
--

INSERT INTO `real_estate_agencies` (`id`, `name`, `adress_id`, `phone`, `mobile`, `email`, `register_court`, `register_number`, `website`, `manager_id`, `profilepicture`) VALUES
(1, 'SFStateHomes', NULL, '0123 45678910', '0123 45678910', 'info@sfstatehomes.com', 'Sanfran Central Court', '123 432 412 422', 'www.sfstatehomes.com', 1, NULL),
(2, 'SJStateRealtors', NULL, '0123 45678910', '0123 45678910', 'info@sjstaterealtors.com', 'Sanfran Central Court', '123 432 412 122', 'www.sjstaterealtors.com', 2, NULL),
(3, 'CSURealEstate', NULL, '0123 45678910', '0123 45678910', 'info@csurealestate.com', 'Sanfran Central Court', '123 432 412 312', 'www.csurealestate.com', 3, NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `real_estate_agencies`
--
ALTER TABLE `real_estate_agencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `real_estate_agencies_email_unique` (`email`),
  ADD UNIQUE KEY `real_estate_agencies_register_number_unique` (`register_number`),
  ADD KEY `real_estate_agencies_adress_id_index` (`adress_id`),
  ADD KEY `real_estate_agencies_manager_id_index` (`manager_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `real_estate_agencies`
--
ALTER TABLE `real_estate_agencies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `real_estate_agencies`
--
ALTER TABLE `real_estate_agencies`
  ADD CONSTRAINT `real_estate_agencies_adress_id_foreign` FOREIGN KEY (`adress_id`) REFERENCES `adresses` (`id`),
  ADD CONSTRAINT `real_estate_agencies_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
