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