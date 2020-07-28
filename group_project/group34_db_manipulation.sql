-- -------------------------------
-- CS-340 Summer 2020: Group 34
-- -------------------------------

-- The colon operator : will be used to indicate variables containing backend data


-- Companies Page -------------------------------------------------------------

-- View all existing Companies --
SELECT * FROM Companies;

--Add new company --
INSERT INTO Companies (companyName, dateJoined) 
    VALUES (:req.query.companyName, :req.query.dateJoined);


-- Projects Page --------------------------------------------------------------

-- View all existing Projects --
SELECT * FROM Projects AS p
JOIN Companies AS c ON p.companyId = c.companyId;

-- View all existing company names --
SELECT companyName FROM Companies;

-- Add new project --
INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance)
    VALUES (:req.query.projectName, (SELECT companyId FROM Companies WHERE companyName = :req.query.companyName),
            :req.query.dateStarted, :req.query.lastUpdated, :req.query.inMaintenance);


-- Programmers Page -----------------------------------------------------------

-- View all existing Programmers --
SELECT * FROM Programmers;

-- Add new programmer --
INSERT INTO Programmers (firstName, lastName, email, dateStarted, accessLevel) 
    VALUES (:req.query.firstName, :req.query.lastName, :req.query.email, :req.query.dateStarted, :req.query.accessLevel);


-- Bugs Page ------------------------------------------------------------------

-- Display the project names in the dropdown --
SELECT projectName, projectId FROM Projects;

-- Display the Programmers in the scrolling checkbox list --
SELECT programmerId, firstName, lastName FROM Programmers;

-- View all existing Bugs with their programmers --
SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary,
b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	FROM Programmers p 
		JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		JOIN Bugs b ON bp.bugId = b.bugId
		LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY bugId;

-- Add new bug --
INSERT INTO Bugs (bugSummary, bugDescription, projectId, dateStarted, priority, fixed, resolution) 
    VALUES (:req.query.bugSummary, :req.query.bugDescription,:req.query.bugProject,
             :req.query.bugStartDate, :req.query.bugPriority, :req.query.bugFixed, :req.query.bugResolution);

-- Run in a loop to insert a Bugs_Programmers row for each programmer --
INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:result.insertId, :req.query.programmer[i]);


-- Update bug -----------------------------------------------------------------

-- Display the project names in the dropdown --
SELECT projectName FROM projects;

-- Display the Programmers in the scrolling checkbox list --
SELECT firstName, lastName FROM PROGRAMMERS;

-- View all existing Bugs with their programmers --
SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary,
b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	FROM Programmers p 
		JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		JOIN Bugs b ON bp.bugId = b.bugId
		LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId
			ORDER BY bugId;


UPDATE Bugs SET bugSummary = :bugSummaryInput, bugDescription = :bugDescriptionInput, dateStarted = :dateStartedInput,
priority = :priorityInput, resolution = :resolutionInput, fixed = :fixedInput WHERE bugId = :bugIdInput;


-- Update M:M relationship
INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:bugId, :programmerId);
DELETE FROM Bugs_Programmers WHERE bugId = :bugIdInput AND programmerId = :programmerId;


-- Delete bug
DELETE FROM Bugs_Programmers WHERE bugId = :bugIdInput;
DELETE FROM Bugs WHERE bugId = :bugIdInput;
