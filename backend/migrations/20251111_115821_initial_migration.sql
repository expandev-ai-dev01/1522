/**
 * Database Migration
 * Generated: 2025-11-11T11:58:21.101Z
 * Timestamp: 20251111_115821
 *
 * This migration includes:
 * - Schema structures (tables, indexes, constraints)
 * - Initial data
 * - Stored procedures
 *
 * Note: This file is automatically executed by the migration runner
 * on application startup in Azure App Service.
 */

-- Set options for better SQL Server compatibility
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

PRINT 'Starting database migration...';
PRINT 'Timestamp: 20251111_115821';
GO


-- ============================================
-- STRUCTURE
-- Database schemas, tables, indexes, and constraints
-- ============================================

-- File: security/_structure.sql
/**
 * @schema security
 * Security schema for authentication and authorization
 */
CREATE SCHEMA [security];
GO


-- File: subscription/_structure.sql
/**
 * @schema subscription
 * Subscription schema for account management
 */
CREATE SCHEMA [subscription];
GO

/**
 * @table account Account management for multi-tenancy
 * @multitenancy false
 * @softDelete true
 * @alias acc
 */
CREATE TABLE [subscription].[account] (
  [idAccount] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkAccount
 * @keyType Object
 */
ALTER TABLE [subscription].[account]
ADD CONSTRAINT [pkAccount] PRIMARY KEY CLUSTERED ([idAccount]);
GO

/**
 * @index ixAccount_Name Search by account name
 * @type Search
 * @filter Active accounts only
 */
CREATE NONCLUSTERED INDEX [ixAccount_Name]
ON [subscription].[account]([name])
WHERE [deleted] = 0;
GO


-- File: config/_structure.sql
/**
 * @schema config
 * Configuration schema for system-wide settings
 */
CREATE SCHEMA [config];
GO


-- File: functional/_structure.sql
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


-- ============================================
-- DATA
-- Initial data and configuration
-- ============================================

-- File: security/_data.sql
/**
 * @load security
 * Initial security data
 */


-- File: subscription/_data.sql
/**
 * @load account
 * Default account for development
 */
INSERT INTO [subscription].[account]
([name], [dateCreated], [dateModified], [deleted])
VALUES
('Default Account', GETUTCDATE(), GETUTCDATE(), 0);
GO


-- File: config/_data.sql
/**
 * @load config
 * Initial configuration data
 */



-- ============================================
-- STORED PROCEDURES
-- Database stored procedures and functions
-- ============================================

-- File: functional/song/spSongCreate.sql
/**
 * @summary
 * Creates a new song with lyrics and chord information.
 * Validates required fields and ensures unique title/artist combination per account.
 *
 * @procedure spSongCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/song
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {NVARCHAR(200)} title
 *   - Required: Yes
 *   - Description: Song title
 *
 * @param {NVARCHAR(200)} artist
 *   - Required: Yes
 *   - Description: Artist or composer name
 *
 * @param {NVARCHAR(MAX)} lyrics
 *   - Required: Yes
 *   - Description: Song lyrics with chord annotations
 *
 * @param {NVARCHAR(10)} originalKey
 *   - Required: No
 *   - Description: Original musical key (e.g., C, G, Am)
 *
 * @param {NVARCHAR(50)} category
 *   - Required: No
 *   - Description: Musical category or genre
 *
 * @returns {INT} idSong - Created song identifier
 *
 * @testScenarios
 * - Valid creation with all parameters
 * - Creation with only required parameters
 * - Duplicate title/artist validation
 * - Invalid account validation
 * - Empty title/artist validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSongCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(200),
  @artist NVARCHAR(200),
  @lyrics NVARCHAR(MAX),
  @originalKey NVARCHAR(10) = NULL,
  @category NVARCHAR(50) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @title IS NULL OR LTRIM(RTRIM(@title)) = ''
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  IF @artist IS NULL OR LTRIM(RTRIM(@artist)) = ''
  BEGIN
    ;THROW 51000, 'artistRequired', 1;
  END;

  IF @lyrics IS NULL OR LTRIM(RTRIM(@lyrics)) = ''
  BEGIN
    ;THROW 51000, 'lyricsRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [subscription].[account] acc
    WHERE acc.[idAccount] = @idAccount
      AND acc.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation Duplicate song validation
   * @throw {songAlreadyExists}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[song] sng
    WHERE sng.[idAccount] = @idAccount
      AND sng.[title] = @title
      AND sng.[artist] = @artist
      AND sng.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'songAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-transaction-control-pattern} Transaction for data integrity
     */
    BEGIN TRAN;

      DECLARE @idSong INTEGER;

      /**
       * @rule {db-multi-tenancy-pattern} Insert with account isolation
       */
      INSERT INTO [functional].[song] (
        [idAccount],
        [title],
        [artist],
        [lyrics],
        [originalKey],
        [category],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @title,
        @artist,
        @lyrics,
        @originalKey,
        @category,
        GETUTCDATE(),
        GETUTCDATE(),
        0
      );

      SET @idSong = SCOPE_IDENTITY();

      /**
       * @output {SongCreateResult, 1, 1}
       * @column {INT} idSong
       * - Description: Created song identifier
       */
      SELECT @idSong AS [idSong];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

-- File: functional/song/spSongDelete.sql
/**
 * @summary
 * Soft deletes a song by setting the deleted flag.
 * Maintains data integrity and audit trail.
 *
 * @procedure spSongDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/song/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {INT} idSong
 *   - Required: Yes
 *   - Description: Song identifier
 *
 * @testScenarios
 * - Valid song deletion
 * - Song not found
 * - Song from different account
 * - Already deleted song
 */
CREATE OR ALTER PROCEDURE [functional].[spSongDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idSong INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @idSong IS NULL
  BEGIN
    ;THROW 51000, 'idSongRequired', 1;
  END;

  /**
   * @validation Song existence validation
   * @throw {songDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[song] sng
    WHERE sng.[idSong] = @idSong
      AND sng.[idAccount] = @idAccount
      AND sng.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'songDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-transaction-control-pattern} Transaction for data integrity
     */
    BEGIN TRAN;

      /**
       * @rule {db-soft-delete-pattern} Soft delete implementation
       * @rule {db-multi-tenancy-pattern} Delete with account isolation
       */
      UPDATE [functional].[song]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idSong] = @idSong
        AND [idAccount] = @idAccount;

      /**
       * @output {SongDeleteResult, 1, 1}
       * @column {INT} idSong
       * - Description: Deleted song identifier
       */
      SELECT @idSong AS [idSong];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

-- File: functional/song/spSongGet.sql
/**
 * @summary
 * Retrieves complete song details including lyrics and chords.
 *
 * @procedure spSongGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/song/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idSong
 *   - Required: Yes
 *   - Description: Song identifier
 *
 * @testScenarios
 * - Valid song retrieval
 * - Song not found
 * - Song from different account
 * - Deleted song access attempt
 */
CREATE OR ALTER PROCEDURE [functional].[spSongGet]
  @idAccount INTEGER,
  @idSong INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idSong IS NULL
  BEGIN
    ;THROW 51000, 'idSongRequired', 1;
  END;

  /**
   * @validation Song existence validation
   * @throw {songDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[song] sng
    WHERE sng.[idSong] = @idSong
      AND sng.[idAccount] = @idAccount
      AND sng.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'songDoesntExist', 1;
  END;

  /**
   * @rule {db-multi-tenancy-pattern} Account-based filtering
   */
  /**
   * @output {SongDetail, 1, n}
   * @column {INT} idSong
   * - Description: Song identifier
   * @column {NVARCHAR(200)} title
   * - Description: Song title
   * @column {NVARCHAR(200)} artist
   * - Description: Artist name
   * @column {NVARCHAR(MAX)} lyrics
   * - Description: Song lyrics with chords
   * @column {NVARCHAR(10)} originalKey
   * - Description: Original musical key
   * @column {NVARCHAR(50)} category
   * - Description: Musical category
   * @column {DATETIME2} dateCreated
   * - Description: Creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Last modification timestamp
   */
  SELECT
    sng.[idSong],
    sng.[title],
    sng.[artist],
    sng.[lyrics],
    sng.[originalKey],
    sng.[category],
    sng.[dateCreated],
    sng.[dateModified]
  FROM [functional].[song] sng
  WHERE sng.[idSong] = @idSong
    AND sng.[idAccount] = @idAccount
    AND sng.[deleted] = 0;
END;
GO

-- File: functional/song/spSongList.sql
/**
 * @summary
 * Lists all songs for an account with optional filtering by category, artist, or search term.
 * Returns songs ordered by title.
 *
 * @procedure spSongList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/song
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(50)} category
 *   - Required: No
 *   - Description: Filter by category
 *
 * @param {NVARCHAR(200)} artist
 *   - Required: No
 *   - Description: Filter by artist
 *
 * @param {NVARCHAR(200)} searchTerm
 *   - Required: No
 *   - Description: Search in title, artist, or lyrics
 *
 * @testScenarios
 * - List all songs for account
 * - Filter by category
 * - Filter by artist
 * - Search by term in title/artist/lyrics
 * - Combined filters
 * - Empty result set
 */
CREATE OR ALTER PROCEDURE [functional].[spSongList]
  @idAccount INTEGER,
  @category NVARCHAR(50) = NULL,
  @artist NVARCHAR(200) = NULL,
  @searchTerm NVARCHAR(200) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [subscription].[account] acc
    WHERE acc.[idAccount] = @idAccount
      AND acc.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @rule {db-multi-tenancy-pattern} Account-based filtering
   * @rule {db-soft-delete-pattern} Filter deleted records
   */
  /**
   * @output {SongList, n, n}
   * @column {INT} idSong
   * - Description: Song identifier
   * @column {NVARCHAR(200)} title
   * - Description: Song title
   * @column {NVARCHAR(200)} artist
   * - Description: Artist name
   * @column {NVARCHAR(10)} originalKey
   * - Description: Original musical key
   * @column {NVARCHAR(50)} category
   * - Description: Musical category
   * @column {DATETIME2} dateCreated
   * - Description: Creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Last modification timestamp
   */
  SELECT
    sng.[idSong],
    sng.[title],
    sng.[artist],
    sng.[originalKey],
    sng.[category],
    sng.[dateCreated],
    sng.[dateModified]
  FROM [functional].[song] sng
  WHERE sng.[idAccount] = @idAccount
    AND sng.[deleted] = 0
    AND (@category IS NULL OR sng.[category] = @category)
    AND (@artist IS NULL OR sng.[artist] = @artist)
    AND (
      @searchTerm IS NULL
      OR sng.[title] LIKE '%' + @searchTerm + '%'
      OR sng.[artist] LIKE '%' + @searchTerm + '%'
      OR sng.[lyrics] LIKE '%' + @searchTerm + '%'
    )
  ORDER BY sng.[title];
END;
GO

-- File: functional/song/spSongUpdate.sql
/**
 * @summary
 * Updates existing song information including lyrics and chords.
 * Validates unique title/artist combination.
 *
 * @procedure spSongUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/song/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {INT} idSong
 *   - Required: Yes
 *   - Description: Song identifier
 *
 * @param {NVARCHAR(200)} title
 *   - Required: Yes
 *   - Description: Song title
 *
 * @param {NVARCHAR(200)} artist
 *   - Required: Yes
 *   - Description: Artist name
 *
 * @param {NVARCHAR(MAX)} lyrics
 *   - Required: Yes
 *   - Description: Song lyrics with chords
 *
 * @param {NVARCHAR(10)} originalKey
 *   - Required: No
 *   - Description: Original musical key
 *
 * @param {NVARCHAR(50)} category
 *   - Required: No
 *   - Description: Musical category
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Update with partial parameters
 * - Duplicate title/artist validation
 * - Song not found
 * - Update from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spSongUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idSong INTEGER,
  @title NVARCHAR(200),
  @artist NVARCHAR(200),
  @lyrics NVARCHAR(MAX),
  @originalKey NVARCHAR(10) = NULL,
  @category NVARCHAR(50) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @idSong IS NULL
  BEGIN
    ;THROW 51000, 'idSongRequired', 1;
  END;

  IF @title IS NULL OR LTRIM(RTRIM(@title)) = ''
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  IF @artist IS NULL OR LTRIM(RTRIM(@artist)) = ''
  BEGIN
    ;THROW 51000, 'artistRequired', 1;
  END;

  IF @lyrics IS NULL OR LTRIM(RTRIM(@lyrics)) = ''
  BEGIN
    ;THROW 51000, 'lyricsRequired', 1;
  END;

  /**
   * @validation Song existence validation
   * @throw {songDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[song] sng
    WHERE sng.[idSong] = @idSong
      AND sng.[idAccount] = @idAccount
      AND sng.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'songDoesntExist', 1;
  END;

  /**
   * @validation Duplicate song validation (excluding current song)
   * @throw {songAlreadyExists}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[song] sng
    WHERE sng.[idAccount] = @idAccount
      AND sng.[title] = @title
      AND sng.[artist] = @artist
      AND sng.[idSong] <> @idSong
      AND sng.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'songAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-transaction-control-pattern} Transaction for data integrity
     */
    BEGIN TRAN;

      /**
       * @rule {db-multi-tenancy-pattern} Update with account isolation
       */
      UPDATE [functional].[song]
      SET
        [title] = @title,
        [artist] = @artist,
        [lyrics] = @lyrics,
        [originalKey] = @originalKey,
        [category] = @category,
        [dateModified] = GETUTCDATE()
      WHERE [idSong] = @idSong
        AND [idAccount] = @idAccount;

      /**
       * @output {SongUpdateResult, 1, 1}
       * @column {INT} idSong
       * - Description: Updated song identifier
       */
      SELECT @idSong AS [idSong];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO


-- ============================================
-- Migration completed successfully
-- ============================================

PRINT 'Migration completed successfully!';
GO
