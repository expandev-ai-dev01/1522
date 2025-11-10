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