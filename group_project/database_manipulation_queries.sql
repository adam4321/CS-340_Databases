-- The colon : will be used to variables containing backend data


-- Companies Page -------------------------------

-- View all existing Companies
SELECT companyId, companyName, dateJoined FROM Companies;

--Add new company
INSERT INTO Companies (companyName, dateJoined) VALUES (:companyNameInput, :dateJoinedInput);



-- Projects Page --------------------------------

-- View all existing Projects
SELECT projectId, projectName, companyName, dateStarted, lastUpdated, inMaintenance FROM Projects AS p
JOIN Companies AS c ON p.companyId = c.companyId
GROUP BY projectId ASC;

-- Add new project
INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance) VALUES
(:projectNameInput, 
(SELECT companyId FROM Companies WHERE companyName = :companyNameInput), 
:dateStartedInput, :lastUpdatedInput, :inMaintenanceInput);



-- Programmers Page -----------------------------

-- View all existing Programmers
SELECT programmerId, firstName, lastName, email, dateStarted, accessLevel FROM Programmers;

-- Add new programmer 
INSERT INTO Programmer (firstName, lastName, email, dateStarted, accessLevel) VALUES 
(:firstNameInput, :lastNameInput, :emailInput, :dateStartedInput, :accessLevelInput);



-- Bugs Page ------------------------------------

-- View all existing Bugs
SELECT b.bugId, p.projectName, b.bugSummary, b.bugDescription, b.dateStarted FROM Bugs b
JOIN Projects p ON b.projectId = p.projectId

SELECT p.firstName, p.lastName FROM Programmers p 
JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
WHERE bp.bugId = :bugIdInput;  -- Run once per bug

-- Add new bug
INSERT INTO Bugs (projectId, bugSummary, bugDescription, dateStarted, priority, resolution, fixed) VALUES
((SELECT projectId FROM Projects WHERE projectName = :projectNameInput),
:bugSummaryInput, :bugDescriptionInput, :dateStartedInput, :priorityInput, :resolutionInput, :fixedInput);

INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:bugId, :programmerId);  -- Run once per programmer

-- Update bug
UPDATE Bugs SET bugSummary = :bugSummaryInput, bugDescription = :bugDescriptionInput, dateStarted = :dateStartedInput,
priority = :priorityInput, resolution = :resolutionInput, fixed = :fixedInput WHERE bugId = :bugIdInput;

-- Update M:M relationship
INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:bugId, :programmerId);
DELETE FROM Bugs_Programmers WHERE bugId = :bugIdInput AND programmerId = :programmerId;

-- Delete bug
DELETE FROM Bugs_Programmers WHERE bugId = :bugIdInput;
DELETE FROM Bugs WHERE bugId = :bugIdInput;
