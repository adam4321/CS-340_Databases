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


DROP TABLE IF EXISTS `Companies`;


