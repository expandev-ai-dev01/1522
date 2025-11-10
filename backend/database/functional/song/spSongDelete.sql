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