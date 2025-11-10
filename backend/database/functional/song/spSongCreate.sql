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