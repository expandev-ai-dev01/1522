/**
 * @schema functional
 * Business logic schema for Editor de Música Cifrada
 */
CREATE SCHEMA [functional];
GO

/**
 * @table song Song catalog with lyrics and chords
 * @multitenancy true
 * @softDelete true
 * @alias sng
 */
CREATE TABLE [functional].[song] (
  [idSong] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [title] NVARCHAR(200) NOT NULL,
  [artist] NVARCHAR(200) NOT NULL,
  [lyrics] NVARCHAR(MAX) NOT NULL,
  [originalKey] NVARCHAR(10) NULL,
  [category] NVARCHAR(50) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkSong
 * @keyType Object
 */
ALTER TABLE [functional].[song]
ADD CONSTRAINT [pkSong] PRIMARY KEY CLUSTERED ([idSong]);
GO

/**
 * @foreignKey fkSong_Account Multi-tenancy account isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[song]
ADD CONSTRAINT [fkSong_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @index ixSong_Account Multi-tenancy account filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSong_Account]
ON [functional].[song]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixSong_Account_Title Search by title within account
 * @type Search
 * @filter Active songs only
 */
CREATE NONCLUSTERED INDEX [ixSong_Account_Title]
ON [functional].[song]([idAccount], [title])
INCLUDE ([artist], [originalKey], [category])
WHERE [deleted] = 0;
GO

/**
 * @index ixSong_Account_Artist Search by artist within account
 * @type Search
 * @filter Active songs only
 */
CREATE NONCLUSTERED INDEX [ixSong_Account_Artist]
ON [functional].[song]([idAccount], [artist])
INCLUDE ([title], [originalKey], [category])
WHERE [deleted] = 0;
GO

/**
 * @index ixSong_Account_Category Filter by category within account
 * @type Search
 * @filter Active songs only
 */
CREATE NONCLUSTERED INDEX [ixSong_Account_Category]
ON [functional].[song]([idAccount], [category])
INCLUDE ([title], [artist])
WHERE [deleted] = 0;
GO

/**
 * @index uqSong_Account_Title_Artist Unique song per account
 * @type Performance
 * @unique true
 * @filter Active songs only
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqSong_Account_Title_Artist]
ON [functional].[song]([idAccount], [title], [artist])
WHERE [deleted] = 0;
GO