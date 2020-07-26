-- The colon : will be used to variables containing backend data


-- Companies Page -------------------------------

-- View all existing Companies
SELECT companyId, dateJoined FROM Companies

--Add new company
INSERT INTO Companies (companyName, dateJoined) VALUES (:companyNameInput, :dateJoinedInput)



-- Projects Page --------------------------------

-- View all existing Projects
SELECT projectName, companyName, dateStarted, lastUpdated, inMaintenance FROM Projects AS p
JOIN Companies AS c ON p.companyId = c.companyId
GROUP BY projectId ASC

-- Add new project
INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance) VALUES
(:projectNameInput, 
(SELECT companyId FROM Companies WHERE companyName = :companyNameInput), 
:dateStartedInput, :lastUpdatedInput, :inMaintenanceInput)



-- Programmers Page -----------------------------

-- View all existing Programmers
SELECT firstName, lastName, email, dateStarted, accessLevel FROM Programmers

-- Add new programmer 
INSERT INTO Programmer (firstName, lastName, email, dateStarted, accessLevel) VALUES 
(:firstNameInput, :lastNameInput, :emailInput, :dateStartedInput, :accessLevelInput)



-- Bugs Page ------------------------------------

-- View all existing Bugs
SELECT bugSummary, bugDescription, projectName, 
[need way to display all associated programmers], dateStarted, priority, fixed, resolution FROM Bugs

-- Add new bug
INSERT INTO Bugs (projectId, bugSummary, bugDescription, dateStarted, priority, resolution, fixed) VALUES
((SELECT projectId FROM Projects WHERE projectName = :projectNameInput),
:bugSummaryInput, :bugDescriptionInput, :dateStartedInput, :priorityInput, :resolutionInput, :fixedInput)

-- Update bug
UPDATE Bugs SET bugSummary = :bugSummaryInput, bugDescription = :bugDescriptionInput, dateStarted = :dateStartedInput,
priority = :priorityInput, resolution = :resolutionInput, fixed = :fixedInput WHERE bugId = :bugIdInput 

-- Delete bug
DELETE FROM Bugs WHERE bugId = :bugIdInput