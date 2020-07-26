-- -------------------------------
-- CS-340 Summer 2020: Group 34
-- -------------------------------

-- DROP ALL OF THE EXISTING TABLES
-- ---------------------------------------
DROP TABLE IF EXISTS `Bugs_Programmers`;
DROP TABLE IF EXISTS `Bugs`;
DROP TABLE IF EXISTS `Projects`;
DROP TABLE IF EXISTS `Programmers`;
DROP TABLE IF EXISTS `Companies`;
-- ---------------------------------------


-- Create table and insert data for Programmers -------------------------------

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
    (2, 'Andy', 'Ng', 'an@mail.com', '2001-04-13', 3),
    (3, 'Sally', 'Smith', 'ss@gmail.com', '1997-12-31', 2),
    (4, 'Jack', 'Miller', 'jm@gmail.com', '1998-01-01', 1),
    (5, 'Amy', 'Ellis', 'ae@yahoo.com', '1996-08-17', 3),
    (6, 'Dan', 'King', 'dk@yahoo.com', '1995-11-11', 2),
    (7, 'Kate', 'Hooper', 'kh@gmail.com', '2000-07-06', 2),
    (8, 'Ben', 'Kent', 'bk@yahoo.com', '1999-03-20', 3),
    (9, 'Kyle', 'Gable', 'kg@gmail.com', '1996-05-03', 2),
    (10, 'Jen', 'Thomas', 'jt@gmail.com', '1998-09-20', 3);

UNLOCK TABLES;


-- Create table and insert data for Companies ---------------------------------

CREATE TABLE `Companies` (
    `companyId` int(11) NOT NULL AUTO_INCREMENT,
    `companyName` varchar(255) NOT NULL,
    `dateJoined` date,
    PRIMARY KEY (`companyId`)
) ENGINE=InnoDB;

LOCK TABLES `Companies` WRITE;

INSERT INTO `Companies` VALUES
    (1, 'Company 1', '1984-07-30'),
    (2, 'Company 2', '1970-10-03'),
    (3, 'Company 3', '2005-02-02'),
    (4, 'Company 4', '1991-11-12'),
    (5, 'Company 5', '1997-04-12'),
    (6, 'Company 6', '1989-09-09');

UNLOCK TABLES;


-- Create table and insert data for Projects ----------------------------------

CREATE TABLE `Projects` (
    `projectId` int(11) NOT NULL AUTO_INCREMENT,
    `projectName` varchar(255) NOT NULL, 
    `dateStarted` date,
    `lastUpdated` date, 
    `inMaintenance` BOOLEAN DEFAULT TRUE,
    `companyId` int(11) NOT NULL,
    PRIMARY KEY (`projectId`),
    FOREIGN KEY (`companyId`) REFERENCES `Companies` (`companyId`)
		ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;

LOCK TABLES `Projects` WRITE,
	`Companies` AS c1 WRITE,
    `Companies` AS c2 WRITE,
    `Companies` AS c3 WRITE,
    `Companies` AS c4 WRITE,
    `Companies` AS c5 WRITE,
    `Companies` AS c6 WRITE;

INSERT INTO `Projects` (`projectName`, `dateStarted`, `lastUpdated`, `inMaintenance`, `companyId`) VALUES
    ('Project 1', '2002-03-19', '2002-03-19', TRUE, (SELECT `companyId` FROM `Companies` AS c1 WHERE `companyName` = 'Company 1')),
    ('Project 2', '2020-02-27', '2020-05-08', FALSE, (SELECT `companyId` FROM `Companies` AS c2 WHERE `companyName` = 'Company 2')),
    ('Project 3', '2005-06-01', '2018-01-15', FALSE, (SELECT `companyId` FROM `Companies` AS c3 WHERE `companyName` = 'Company 3')),
    ('Project 4', '2016-12-12', '2017-01-15', TRUE, (SELECT `companyId` FROM `Companies` AS c4 WHERE `companyName` = 'Company 4')),
    ('Project 5', '2018-07-03', '2015-01-15', TRUE, (SELECT `companyId` FROM `Companies` AS c5 WHERE `companyName` = 'Company 5')),
    ('Project 6', '2012-09-08', '2019-01-15', FALSE, (SELECT `companyId` FROM `Companies` AS c6 WHERE `companyName` = 'Company 6'));

UNLOCK TABLES;


-- Create table and insert data for Bugs --------------------------------------

CREATE TABLE `Bugs` (
    `bugId` int(11) NOT NULL AUTO_INCREMENT,
    `projectId` int(11),
    `bugSummary` text NOT NULL,
    `bugDescription` text,
    `dateStarted` date NOT NULL,
    PRIMARY KEY (`bugId`),
    FOREIGN KEY (`projectId`) REFERENCES `Projects` (`projectId`)
		ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;


LOCK TABLES `Bugs` WRITE, 
	`Projects` AS p1 WRITE, 
    `Projects` AS p2 WRITE,
    `Projects` AS p3 WRITE,
    `Projects` AS p4 WRITE,
    `Projects` AS p5 WRITE,
    `Projects` AS p6 WRITE,
    `Projects` AS p7 WRITE,
    `Projects` AS p8 WRITE,
    `Projects` AS p9 WRITE,
    `Projects` AS p10 WRITE,
    `Projects` AS p11 WRITE,
    `Projects` AS p12 WRITE,
    `Projects` AS p13 WRITE;

INSERT INTO `Bugs` (`projectId`, `bugSummary`, `bugDescription`, `dateStarted`) VALUES
    ((SELECT `projectId` FROM `Projects` AS p1 WHERE `projectName` = 'Project 1'), 'Bug Summary 1', 'Bug Description 1', '2004-01-01'),
    ((SELECT `projectId` FROM `Projects` AS p2 WHERE `projectName` = 'Project 2'), 'Bug Summary 2', 'Bug Description 2', '2020-07-11'),
    ((SELECT `projectId` FROM `Projects` AS p3 WHERE `projectName` = 'Project 3'), 'Bug Summary 3', 'Bug Description 3', '2015-03-02'),
    ((SELECT `projectId` FROM `Projects` AS p4 WHERE `projectName` = 'Project 4'), 'Bug Summary 4', 'Bug Description 4', '2018-11-05'),
    ((SELECT `projectId` FROM `Projects` AS p5 WHERE `projectName` = 'Project 5'), 'Bug Summary 5', 'Bug Description 5', '2019-08-03'),
    ((SELECT `projectId` FROM `Projects` AS p6 WHERE `projectName` = 'Project 6'), 'Bug Summary 6', 'Bug Description 6', '2014-04-18'),
    ((SELECT `projectId` FROM `Projects` AS p7 WHERE `projectName` = 'Project 1'), 'Bug Summary 7', 'Bug Description 7', '2005-09-21'),
    ((SELECT `projectId` FROM `Projects` AS p8 WHERE `projectName` = 'Project 2'), 'Bug Summary 8', 'Bug Description 8', '2017-12-14'),
    ((SELECT `projectId` FROM `Projects` AS p9 WHERE `projectName` = 'Project 3'), 'Bug Summary 9', 'Bug Description 9', '2008-06-01'),
    ((SELECT `projectId` FROM `Projects` AS p10 WHERE `projectName` = 'Project 4'), 'Bug Summary 10', 'Bug Description 10', '2016-04-13'),
    ((SELECT `projectId` FROM `Projects` AS p11 WHERE `projectName` = 'Project 5'), 'Bug Summary 11', 'Bug Description 11', '2016-02-11'),
    ((SELECT `projectId` FROM `Projects` AS p12 WHERE `projectName` = 'Project 6'), 'Bug Summary 12', 'Bug Description 12', '2015-06-21'),
    ((SELECT `projectId` FROM `Projects` AS p13 WHERE `projectName` = 'Project 1'), 'Bug Summary 13', 'Bug Description 13', '2004-03-01');

UNLOCK TABLES;


-- Create table and insert data for Bugs_Programmers --------------------------

CREATE TABLE `Bugs_Programmers` (
    `bugId` int(11) NOT NULL,
    `programmerId` int(11) NOT NULL,
    PRIMARY KEY (`bugId`, `programmerId`),
    FOREIGN KEY (`bugId`) REFERENCES `Bugs` (`bugId`)
		ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (`programmerId`) REFERENCES `Programmers` (`programmerId`)
		ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB;


LOCK TABLES `Bugs_Programmers` WRITE, `Bugs` AS b1 WRITE, `Programmers` AS p1 WRITE;

INSERT INTO `Bugs_Programmers` (`bugId`, `programmerId`) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 1),
    (12, 1),
    (13, 2),
    (1, 5),
    (2, 7),
    (3, 9);
    (1, 2),
    (2, 1), 
    (2, 2);

UNLOCK TABLES;
