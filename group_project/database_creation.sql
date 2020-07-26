-- -------------------------------
-- CS-340 Summer 2020: Group 34
-- -------------------------------

SET foreign_key_checks = 0;

-- Create table and insert data for Programmers -------------------------------
DROP TABLE IF EXISTS `Programmers`;

CREATE TABLE `Programmers` (
    `programmerId` int(11) NOT NULL AUTO_INCREMENT,
    `firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) NOT NULL,
    `email` varchar(255), 
    `dateStarted` date, 
    `accessLevel` int(11),
    PRIMARY KEY (`programmerId`)
) ENGINE=InnoDB;


LOCK TABLES `Programmers` WRITE;

INSERT INTO `Programmers` VALUES 
    (1, 'Joe', 'Smith', 'js@mail.com', '1999-05-05', 2), 
    (2, 'Andy', 'Ng', 'an@mail.com', '2001-04-13', 3);

UNLOCK TABLES;


-- Create table and insert data for Companies ---------------------------------
DROP TABLE IF EXISTS `Companies`;

CREATE TABLE `Companies` (
    `companyId` int(11) NOT NULL AUTO_INCREMENT,
    `companyName` varchar(255) NOT NULL,
    `dateJoined` date,
    PRIMARY KEY (`companyId`)
) ENGINE=InnoDB;

LOCK TABLE `Companies` WRITE;

INSERT INTO `Companies` VALUES
    (1, 'Company 1', '1984-07-30'),
    (2, 'Company 2', '1970-10-03');

UNLOCK TABLES;


-- Create table and insert data for Projects ----------------------------------
DROP TABLE IF EXISTS `Projects`;

CREATE TABLE `Projects` (
    `projectId` int(11) NOT NULL AUTO_INCREMENT,
    `projectName` varchar(255) NOT NULL, 
    `dateStarted` date,
    `lastUpdated` date, 
    `inMaintenance` BOOLEAN DEFAULT TRUE,
    `companyId` int(11) NOT NULL,
    PRIMARY KEY (`projectId`),
    FOREIGN KEY (`companyId`) REFERENCES `Companies` (`companyId`)
) ENGINE=InnoDB;

LOCK TABLES `Projects` WRITE, `Companies` AS c1 WRITE, `Companies` AS c2 WRITE;

INSERT INTO `Projects` (`projectName`, `dateStarted`, `lastUpdated`, `inMaintenance`, `companyId`) VALUES
    ('Project 1', '2002-03-19', '2002-03-19', TRUE, (SELECT `companyId` FROM `Companies` AS c1 WHERE `companyName` = 'Company 1')),
    ('Project 2', '2020-02-27', '2020-05-08', FALSE, (SELECT `companyId` FROM `Companies` AS c2 WHERE `companyName` = 'Company 2'));

UNLOCK TABLES;


-- Create table and insert data for Bugs --------------------------------------
DROP TABLE IF EXISTS `Bugs`;

CREATE TABLE `Bugs` (
    `bugId` int(11) NOT NULL AUTO_INCREMENT,
    `projectId` int(11),
    `bugSummary` text NOT NULL,
    `bugDescription` text,
    `dateStarted` date NOT NULL,
    PRIMARY KEY (`bugId`),
    FOREIGN KEY (`projectId`) REFERENCES `Projects` (`projectId`)
) ENGINE=InnoDB;


LOCK TABLES `Bugs` WRITE, `Projects` AS p1 WRITE, `Projects` AS p2 WRITE;

INSERT INTO `Bugs` (`projectId`, `bugSummary`, `bugDescription`, `dateStarted`) VALUES
    ((SELECT `projectId` FROM `Projects` AS p1 WHERE `projectName` = 'Project 1'), 'Bug Summary 1', 'Bug Description 1', '2000-01-01'),
    ((SELECT `projectId` FROM `Projects` AS p2 WHERE `projectName` = 'Project 2'), 'Bug Summary 2', 'Bug Description 2', '2003-07-11');

UNLOCK TABLES;


-- Create table and insert data for Bugs_Programmers --------------------------
DROP TABLE IF EXISTS `Bugs_Programmers`;

CREATE TABLE `Bugs_Programmers` (
    `bugId` int(11) NOT NULL,
    `programmerId` int(11) NOT NULL,
    PRIMARY KEY (`bugId`, `programmerId`),
    FOREIGN KEY (`bugId`) REFERENCES `Bugs` (`bugId`),
    FOREIGN KEY (`programmerId`) REFERENCES `Programmers` (`programmerId`)
) ENGINE=InnoDB;


LOCK TABLES `Bugs_Programmers` WRITE, `Bugs` AS b1 WRITE, `Programmers` AS p1 WRITE;

INSERT INTO `Bugs_Programmers` (`bugId`, `programmerId`) VALUES
    (1, 1),
    (1, 2),
    (2, 1), 
    (2, 2);

UNLOCK TABLES;


SET foreign_key_checks = 1;