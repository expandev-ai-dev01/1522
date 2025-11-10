/**
 * @load account
 * Default account for development
 */
INSERT INTO [subscription].[account]
([name], [dateCreated], [dateModified], [deleted])
VALUES
('Default Account', GETUTCDATE(), GETUTCDATE(), 0);
GO
