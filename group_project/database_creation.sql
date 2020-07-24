
-- Create table and insert data for Programmers
DROP TABLE IF EXISTS `Programmers`;

CREATE TABLE `Programmers` (
    `programmerId` int(11) NOT NULL AUTO_INCREMENT,
    `firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) NOT NULL,
    `email` varchar(255), 
    `dateStarted` date, 
    `accessLevel` int(11),
    PRIMARY KEY (`programmerId`)
)

LOCK TABLES `Programmers` WRITE;

INSERT INTO `Programmers` VALUES 
    (1, 'Joe', 'Smith', 'js@mail.com', '1999-05-05', 2), 
    (2, 'Andy', 'Ng', 'an@mail.com', '2001-04-13', 3);

UNLOCK TABLES;


-- Create table and insert data for Companies
DROP TABLE IF EXISTS `Companies`;

CREATE TABLE `Companies` (
    `companyId` int(11) NOT NULL AUTO_INCREMENT,
    `companyName` varchar(255) NOT NULL,
    `dateJoined` date,
    PRIMARY KEY (`companyId`)
);

LOCK TABLE `Companies` WRITE;

INSERT INTO `Companies` VALUES
    (1, 'Company 1', '1984-07-30'),
    (2, 'Company 2', '1970-10-03');

UNLOCK TABLES;


-- Create table and insert data for Projects
DROP TABLE IF EXISTS `Projects`;

CREATE TABLE `Projects` (
    `projectId` int(11) NOT NULL AUTO_INCREMENT,
    `projectName` varchar(255) NOT NULL, 
    `dateStarted` date,
    `lastUpdated` date, 
    `inMaintenance` bit,
    `companyId` int(11) NOT NULL,
    FOREIGN KEY (`companyId`) REFERENCES `Companies` (`companyId`)
);

LOCK TABLE `Projects` WRITE;

INSERT INTO `Projects` (`projectName`, `dateStarted`, `lastUpdated`, `inMaintenance`, 'companyId') VALUES
    ('Project 1', '2002-03-19', '2002-03-19', '1', (SELECT `companyId` FROM `Companies` WHERE `companyName` = 'Company 1')),
    ('Project 2', '2020-02-27', '2020-05-08', '0', (SELECT `companyId` FROM `Companies` WHERE `companyName` = 'Company 2'))
);

UNLOCK TABLES;


-- Create table and insert data for Bugs
